import { db } from "../DBConnection";
import { jobs } from "../schema";
import { eq } from "drizzle-orm";

export async function createJob(
  pipelineId: string,
  payload: Record<string, unknown>
) {
  const [job] = await db.insert(jobs).values({
    pipelineId,
    payload,
    status: "pending",
  }).returning();

  return job;
}

export async function getJobById(jobId: string) {
  const [job] = await db
    .select()
    .from(jobs)
    .where(eq(jobs.id, jobId));

  return job ?? null;
}

export async function updateJobStatus(
  jobId: string,
  status: string,
  result?: Record<string, unknown>
) {
  const [job] = await db
    .update(jobs)
    .set({ status, result, updatedAt: new Date() })
    .where(eq(jobs.id, jobId))
    .returning();

  return job;
}