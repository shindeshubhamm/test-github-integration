import { Octokit } from "octokit";
import type { Endpoints } from "@octokit/types";

type Repository = Endpoints["GET /repos/{owner}/{repo}"]["response"]["data"];
type User = Endpoints["GET /users/{username}"]["response"]["data"];
type RepositoryContributor =
  Endpoints["GET /repos/{owner}/{repo}/contributors"]["response"]["data"][0];

const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
});

const username = process.env.GITHUB_USERNAME || "";

export const getUserProfile = async () => {
  const { data: user } = await octokit.rest.users.getByUsername({
    username,
  });

  const { data: repos } = await octokit.rest.repos.listForUser({
    username,
    sort: "updated",
    per_page: 100,
  });

  return {
    profile: {
      name: user.name,
      username: username,
      bio: user.bio,
      company: user.company,
      blog: user.blog,
      location: user.location,
      email: user.email,
      hireable: user.hireable,
      twitter_username: user.twitter_username,
      public_repos: user.public_repos,
      followers: user.followers,
      following: user.following,
      created_at: user.created_at,
    },
    repositories: repos.map((repo: Repository) => ({
      name: repo.name,
      description: repo.description,
      url: repo.html_url,
      homepage: repo.homepage,
      topics: repo.topics,
      language: repo.language,
      stars: repo.stargazers_count,
      forks: repo.forks_count,
      issues: repo.open_issues_count,
      created_at: repo.created_at,
      updated_at: repo.updated_at,
    })),
  };
};

export const getRepository = async (repoName: string) => {
  const { data: repo } = await octokit.rest.repos.get({
    owner: username,
    repo: repoName,
  });

  const { data: languages } = await octokit.rest.repos.listLanguages({
    owner: username,
    repo: repoName,
  });

  const { data: contributors = [] } = (await octokit.rest.repos.listContributors({
    owner: username,
    repo: repoName,
  })) || { data: [] };

  return {
    name: repo.name,
    description: repo.description,
    url: repo.html_url,
    homepage: repo.homepage,
    topics: repo.topics,
    languages,
    stars: repo.stargazers_count,
    forks: repo.forks_count,
    issues: repo.open_issues_count,
    created_at: repo.created_at,
    updated_at: repo.updated_at,
    contributors:
      contributors?.length > 0
        ? contributors.map((contributor: RepositoryContributor) => ({
            username: contributor.login,
            avatar: contributor.avatar_url,
            contributions: contributor.contributions,
          }))
        : [],
  };
};

export const createIssue = async (repoName: string, title: string, body: string) => {
  const { data: issue } = await octokit.rest.issues.create({
    owner: username,
    repo: repoName,
    title,
    body,
  });

  return {
    url: issue.html_url,
    number: issue.number,
    title: issue.title,
    state: issue.state,
    created_at: issue.created_at,
  };
};
