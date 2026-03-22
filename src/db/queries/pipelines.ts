import { db } from "../DBConnection";
import { pipelines, pipelineActions, subscriptions } from "../schema";
import { eq } from "drizzle-orm";
import crypto from "crypto";

export async function createPipeline(
  name: string,
  eventType: string,
  actions: { action_type: string; config: object; order_index: number }[],
  subscriberUrls: string[]
) {
  const secret = crypto.randomBytes(32).toString("hex");

  const [pipeline] = await db.insert(pipelines).values({
    name,
    eventType,
    secret,
  }).returning();

  for (const action of actions) {
    await db.insert(pipelineActions).values({
      pipelineId: pipeline.id,
      actionType: action.action_type,
      config: action.config,
      orderIndex: action.order_index,
    });
  }

  for (const url of subscriberUrls) {
    await db.insert(subscriptions).values({
      pipelineId: pipeline.id,
      targetUrl: url,
    });
  }

  return pipeline;
}
export async function getPipelineById(pipelineId: string) {
  const [pipeline] = await db
    .select()
    .from(pipelines)
    .where(eq(pipelines.id, pipelineId));

  return pipeline ?? null;
}
export async function getPipelineActions(pipelineId: string) {
  return await db
    .select()
    .from(pipelineActions)
    .where(eq(pipelineActions.pipelineId, pipelineId))
    .orderBy(pipelineActions.orderIndex);
}
export async function getAllPipelines() {
  return await db
    .select({
      id: pipelines.id,
      name: pipelines.name,
      eventType: pipelines.eventType,
      createdAt: pipelines.createdAt,
    })
    .from(pipelines);
}

export async function deletePipeline(pipelineId: string) {
  await db
    .delete(pipelines)
    .where(eq(pipelines.id, pipelineId));
}
export async function updatePipeline(
  pipelineId: string,
  name: string,
  eventType: string,
  actions: { action_type: string; config: object; order_index: number }[],
  subscriberUrls: string[]
) {
  const [pipeline] = await db
    .update(pipelines)
    .set({ name, eventType })
    .where(eq(pipelines.id, pipelineId))
    .returning();
  await db.delete(pipelineActions).where(eq(pipelineActions.pipelineId, pipelineId));
  for (const action of actions) {
    await db.insert(pipelineActions).values({
      pipelineId,
      actionType: action.action_type,
      config: action.config,
      orderIndex: action.order_index,
    });
  }
  await db.delete(subscriptions).where(eq(subscriptions.pipelineId, pipelineId));
  for (const url of subscriberUrls) {
    await db.insert(subscriptions).values({ pipelineId, targetUrl: url });
  }

  return pipeline;
}