import axios from "axios";
import { getSubscriptionsByPipelineId, createDeliveryAttempt } from "./db/queries/delivery";

const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 1000;

async function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function deliverToSubscribers(
  jobId: string,
  pipelineId: string,
  result: Record<string, unknown>
) {
  const subs = await getSubscriptionsByPipelineId(pipelineId);

  for (const sub of subs) {
    let delivered = false;

    for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
      try {
        const response = await axios.post(sub.targetUrl, result, {
          timeout: 5000,
        });

        await createDeliveryAttempt(jobId, sub.id, "success", response.status);

        delivered = true;
        break;
      } catch (err: unknown) {
        const errorMsg = err instanceof Error ? err.message : "Unknown error";
        const responseCode = axios.isAxiosError(err) ? err.response?.status : null;

        await createDeliveryAttempt(jobId, sub.id, "failed", responseCode, errorMsg);

        if (attempt < MAX_RETRIES) {
          await sleep(RETRY_DELAY_MS * attempt);
        }
      }
    }

    if (!delivered) {
      console.error(`Failed to deliver to ${sub.targetUrl} after ${MAX_RETRIES} attempts`);
    }
  }
}