import { Worker } from "bullmq";
import { config } from "./config";
import { scoreCalculation } from "./actions/scoreCalculation";
import { levelCalculation } from "./actions/levelCalculation";
import { achievementSystem } from "./actions/achievementSystem";
import { updateJobStatus } from "./db/queries/jobs";
import { getPipelineActions, getPipelineById } from "./db/queries/pipelines";

const worker = new Worker(
  "webhook-jobs",
  async (job) => {
    const { jobId, pipelineId, payload } = job.data;

    console.log(`Processing job: ${jobId}`);
    const pipeline = await getPipelineById(pipelineId);
    const eventType = pipeline?.eventType;
    const actions = await getPipelineActions(pipelineId);

    const results: Record<string, unknown> = {};

    for (const action of actions) {
      if (action.actionType === "score_calculation") {
        results.score = await scoreCalculation(eventType, payload);
      } else if (action.actionType === "level_calculation") {
        results.level = await levelCalculation(payload);
      } else if (action.actionType === "achievement_system") {
        results.achievements = await achievementSystem(payload);
      }
    }

    await updateJobStatus(jobId, "completed", results);
    console.log(`Job ${jobId} completed`);
  },
  { connection: config.redis }
);

worker.on("failed", async (job, err) => {
  console.log(`Job ${job?.id} failed: ${err.message}`);
  if (job?.data.jobId) {
    await updateJobStatus(job.data.jobId, "failed");
  }
});

console.log("Worker started...");