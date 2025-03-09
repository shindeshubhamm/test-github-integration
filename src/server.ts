import { Handler } from "@netlify/functions";
import serverless from "serverless-http";
import express, { Application, Request, Response, NextFunction } from "express";
import githubRoutes from "./routes/github.routes";

const app: Application = express();

// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// routes
app.use("/github", githubRoutes);

// basic route
app.get("/", (req: Request, res: Response) => {
  res.json({ message: "Working" });
});

//  error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong!" });
});

// export app for local development
export default app;

// export handler for netlify functions
export const handler: Handler = async (event, context) => {
  const serverlessHandler = serverless(app);
  try {
    const response = await serverlessHandler(event, context);
    return response as {
      statusCode: number;
      headers: { [key: string]: string | number | boolean };
      body: string;
    };
  } catch (error: any) {
    return {
      statusCode: error.statusCode || 500,
      body: JSON.stringify({ error: error.message || "Internal server error" }),
    };
  }
};
