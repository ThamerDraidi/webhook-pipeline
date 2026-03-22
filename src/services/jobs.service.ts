import { getJobById } from "../db/queries/jobs";
import { getDeliveryAttemptsByJobId } from "../db/queries/delivery";
import { NotFoundError } from "../error";

export async function getJobService(jobId: string) {
  const job = await getJobById(jobId);
  if (!job) {
    throw new NotFoundError("Job not found");
  }

  const deliveryAttempts = await getDeliveryAttemptsByJobId(jobId);

  return {
    ...job,
    delivery_attempts: deliveryAttempts,
  };
}