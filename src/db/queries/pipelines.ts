import { db } from "../DBConnection";
import { pipelines, pipelineActions, subscriptions } from "../schema";
import { eq } from "drizzle-orm";

export async function createPipeline(
  name: string,
  eventType: string,
  actions: { action_type: string; config: object; order_index: number }[],
  subscriberUrls: string[]
) {
  const [pipeline] = await db.insert(pipelines).values({
    name,
    eventType,
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