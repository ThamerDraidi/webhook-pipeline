import { db } from "../DBConnection";
import { subscriptions, deliveryAttempts } from "../schema";
import { eq } from "drizzle-orm";

export async function getSubscriptionsByPipelineId(pipelineId: string) {
  return await db
    .select()
    .from(subscriptions)
    .where(eq(subscriptions.pipelineId, pipelineId));
}

export async function createDeliveryAttempt(
  jobId: string,
  subscriptionId: string,
  status: string,
  responseCode?: number | null,
  error?: string | null
) {
  await db.insert(deliveryAttempts).values({
    jobId,
    subscriptionId,
    status,
    responseCode: responseCode ?? null,
    error: error ?? null,
  });
}
export async function getDeliveryAttemptsByJobId(jobId: string) {
  return await db
    .select()
    .from(deliveryAttempts)
    .where(eq(deliveryAttempts.jobId, jobId));
}