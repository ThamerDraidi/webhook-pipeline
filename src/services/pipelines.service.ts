import { createPipeline, getPipelineById, getAllPipelines, deletePipeline, updatePipeline } from "../db/queries/pipelines";
import { NotFoundError, UnauthorizedError } from "../error";

export async function createPipelineService(
  userId: string,
  name: string,
  eventType: string,
  actions: { action_type: string; config: object; order_index: number }[],
  subscriberUrls: string[]
) {
  return await createPipeline(userId, name, eventType, actions, subscriberUrls);
}

export async function getAllPipelinesService(userId: string) {
  return await getAllPipelines(userId);
}

export async function getPipelineService(pipelineId: string, userId: string) {
  const pipeline = await getPipelineById(pipelineId);
  if (!pipeline) {
    throw new NotFoundError("Pipeline not found");
  }
  if (pipeline.userId !== userId) {
    throw new UnauthorizedError("Access denied");
  }
  const { secret, ...pipelineWithoutSecret } = pipeline;
  return pipelineWithoutSecret;
}

export async function updatePipelineService(
  pipelineId: string,
  userId: string,
  name: string,
  eventType: string,
  actions: { action_type: string; config: object; order_index: number }[],
  subscriberUrls: string[]
) {
  const pipeline = await getPipelineById(pipelineId);
  if (!pipeline) {
    throw new NotFoundError("Pipeline not found");
  }
  if (pipeline.userId !== userId) {
    throw new UnauthorizedError("Access denied");
  }
  const updated = await updatePipeline(pipelineId, name, eventType, actions, subscriberUrls);
  const { secret, ...updatedWithoutSecret } = updated;
  return updatedWithoutSecret;
}

export async function deletePipelineService(pipelineId: string, userId: string) {
  const pipeline = await getPipelineById(pipelineId);
  if (!pipeline) {
    throw new NotFoundError("Pipeline not found");
  }
  if (pipeline.userId !== userId) {
    throw new UnauthorizedError("Access denied");
  }
  await deletePipeline(pipelineId);
}