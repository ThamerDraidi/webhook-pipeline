import { Queue } from "bullmq";
import { config } from "./config";

export const jobQueue = new Queue("webhook-jobs", {
  connection: config.redis,
});