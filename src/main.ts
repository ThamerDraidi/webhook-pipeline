import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import helmet from "helmet";
import { config } from "./config";
import { BaseError } from "./error";
import { handleCreatePipeline } from "./api/pipelines";
import { handleWebhook } from "./api/webhooks";
import { handleGetJob } from "./api/jobs";

const app = express();

app.use(express.json());
app.use(cors());
app.use(helmet());

app.get("/health", (req: Request, res: Response) => {
  res.json({ status: "ok" });
});

app.post("/pipelines", handleCreatePipeline);
app.post("/webhooks/:pipelineId", handleWebhook);
app.get("/jobs/:jobId", handleGetJob);

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof BaseError) {
    return res.status(err.statusCode).json({ error: err.message });
  }
  console.error(err.message);
  res.status(500).json({ error: "Internal Server Error" });
});

app.listen(config.port, () => {
  console.log(`Server running on port ${config.port}`);
});