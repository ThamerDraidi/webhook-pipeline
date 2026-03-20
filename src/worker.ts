import dotenv from "dotenv";
dotenv.config();

import { Worker } from "bullmq";
import { config } from "./config";

const worker = new Worker(
  "webhook-jobs",
  async (job) => {
    console.log(`Processing job: ${job.id}`);
    console.log("Data:", job.data);
  },
  { connection: config.redis }
);

worker.on("completed", (job) => {
  console.log(`Job ${job.id} completed`);
});

worker.on("failed", (job, err) => {
  console.log(`Job ${job?.id} failed: ${err.message}`);
});

console.log("Worker started...");