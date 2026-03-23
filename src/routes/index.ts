import { Router } from "express";
import pipelinesRouter from "./pipelines.routes";
import webhooksRouter from "./webhooks.routes";
import jobsRouter from "./jobs.routes";
import authRouter from "./auth.routes"
import { authMiddleware } from "../middleware/auth";

const router = Router();
router.use("/auth", authRouter);
router.use("/webhooks", webhooksRouter);
router.use("/pipelines", authMiddleware, pipelinesRouter);
router.use("/jobs", authMiddleware, jobsRouter);


export default router;