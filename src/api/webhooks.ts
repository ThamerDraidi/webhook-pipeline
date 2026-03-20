import { Request, Response, NextFunction } from "express";
import { createJob } from "../db/queries/jobs";
import { getPipelineById } from "../db/queries/pipelines";
import { jobQueue } from "../queue";
import { NotFoundError } from "../error";

export async function handleWebhook(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const pipelineId = req.params.pipelineId as string;
    const payload = req.body;

    const pipeline = await getPipelineById(pipelineId);
    if (!pipeline) {
      throw new NotFoundError("Pipeline not found");
    }

    const job = await createJob(pipelineId, payload);

    await jobQueue.add("process-job", {
      jobId: job.id,
      pipelineId,
      payload,
    });

    res.status(202).json({
      message: "Webhook received and queued",
      job_id: job.id,
    });
  } catch (err) {
    next(err);
  }
}