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

export default app;
