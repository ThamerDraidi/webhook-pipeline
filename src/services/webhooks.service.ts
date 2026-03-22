import { getPipelineById } from "../db/queries/pipelines";
import { createJob } from "../db/queries/jobs";
import { jobQueue } from "../queue";
import { NotFoundError } from "../error";

export async function processWebhookService(
  pipelineId: string,
  payload: Record<string, unknown>
) {
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

  return { job_id: job.id };
}