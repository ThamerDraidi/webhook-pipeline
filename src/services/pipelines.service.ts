import { createPipeline, getPipelineById, getAllPipelines, deletePipeline, updatePipeline } from "../db/queries/pipelines";
import { NotFoundError } from "../error";

export async function createPipelineService(
  name: string,
  eventType: string,
  actions: { action_type: string; config: object; order_index: number }[],
  subscriberUrls: string[]
) {
  return await createPipeline(name, eventType, actions, subscriberUrls);
}

export async function getAllPipelinesService() {
  return await getAllPipelines();
}

export async function getPipelineService(pipelineId: string) {
  const pipeline = await getPipelineById(pipelineId);
  if (!pipeline) {
    throw new NotFoundError("Pipeline not found");
  }
  const { secret, ...pipelineWithoutSecret } = pipeline;
  return pipelineWithoutSecret;
}

export async function updatePipelineService(
  pipelineId: string,
  name: string,
  eventType: string,
  actions: { action_type: string; config: object; order_index: number }[],
  subscriberUrls: string[]
) {
  const pipeline = await getPipelineById(pipelineId);
  if (!pipeline) {
    throw new NotFoundError("Pipeline not found");
  }
  const updated = await updatePipeline(pipelineId, name, eventType, actions, subscriberUrls);
  const { secret, ...updatedWithoutSecret } = updated;
  return updatedWithoutSecret;
}

export async function deletePipelineService(pipelineId: string) {
  const pipeline = await getPipelineById(pipelineId);
  if (!pipeline) {
    throw new NotFoundError("Pipeline not found");
  }
  await deletePipeline(pipelineId);
}