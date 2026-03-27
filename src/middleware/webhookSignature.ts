import { Request, Response, NextFunction } from "express";
import crypto from "crypto";
import { getPipelineById } from "../db/queries/pipelines";
import { UnauthorizedError, NotFoundError } from "../error";

 export interface WebhookRequest extends Request {
  rawBody: string;
}

export async function verifyWebhookSignature(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const pipelineId = req.params.pipelineId as string;
    const signature = req.headers["x-webhook-signature"] as string;

    if (!signature) {
      throw new UnauthorizedError("Missing webhook signature");
    }

    const pipeline = await getPipelineById(pipelineId);
    if (!pipeline) {
      throw new NotFoundError("Pipeline not found");
    }

const rawBody = req.body.toString();
    const expectedSignature = crypto
      .createHmac("sha256", pipeline.secret)
      .update(rawBody)
      .digest("hex");

    if (signature !== expectedSignature) {
      throw new UnauthorizedError("Invalid webhook signature");
    }

    next();
  } catch (err) {
    next(err);
  }
}