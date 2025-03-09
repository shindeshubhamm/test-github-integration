import { Router, Request, Response } from "express";
import { getUserProfile, getRepository, createIssue } from "../services/github.service";

const router = Router();

// GET /github
router.get("/", async (req: Request, res: Response) => {
  try {
    const data = await getUserProfile();
    res.json(data);
  } catch (error: any) {
    res.status(500).json({
      error: error.message || "Failed to fetch GitHub profile",
    });
  }
});

// GET /github/:repoName
router.get("/:repoName", async (req: Request, res: Response) => {
  try {
    const { repoName } = req.params;
    const data = await getRepository(repoName);
    res.json(data);
  } catch (error: any) {
    res.status(error.status === 404 ? 404 : 500).json({
      error: error.message || "Failed to fetch repository details",
    });
  }
});

// POST /github/:repoName/issues
// @ts-ignore
router.post("/:repoName/issues", async (req: Request, res: Response) => {
  try {
    const { repoName } = req.params;
    const { title, body } = req.body;

    if (!title || !body) {
      return res.status(400).json({
        error: "Title and body are required",
      });
    }

    const data = await createIssue(repoName, title, body);
    return res.status(201).json(data);
  } catch (error: any) {
    res.status(error.status === 404 ? 404 : 500).json({
      error: error.message || "Failed to create issue",
    });
  }
});

export default router;
