import { Router } from "express";
import { handleWebhook } from "../api/webhooks";
import { webhookLimiter } from "../middleware/rateLimiter";
import { verifyWebhookSignature } from "../middleware/webhookSignature";

const router = Router();

router.post("/:pipelineId", webhookLimiter, verifyWebhookSignature, handleWebhook);

export default router;