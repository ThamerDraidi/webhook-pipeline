import { Request, Response, NextFunction } from "express";
import { processWebhookService } from "../services/webhooks.service";
import { WebhookRequest } from "../middleware/webhookSignature";

export async function handleWebhook(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const pipelineId = req.params.pipelineId as string;
   const rawBody = req.body.toString(); 
const payload = JSON.parse(rawBody);
     console.log("Webhook received:", req.body);
    const result = await processWebhookService(pipelineId, payload);
    res.status(202).json({
      message: "Webhook received and queued",
      job_id: result.job_id,
    });
  } catch (err) {
    next(err);
  }
}