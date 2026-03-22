import { Router } from "express";
import pipelinesRouter from "./pipelines.routes";
import webhooksRouter from "./webhooks.routes";
import jobsRouter from "./jobs.routes";

const router = Router();

router.use("/pipelines", pipelinesRouter);
router.use("/webhooks", webhooksRouter);
router.use("/jobs", jobsRouter);

export default router;