import { Request, Response, NextFunction } from "express";
import { createPipeline } from "../db/queries/pipelines.js";

export async function handleCreatePipeline(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { name, event_type, actions, subscriber_urls } = req.body;

    if (!name || !event_type || !actions || !subscriber_urls) {
      res.status(400).json({ error: "Missing required fields" });
      return;
    }

    const pipeline = await createPipeline(
      name,
      event_type,
      actions,
      subscriber_urls
    );

    res.status(201).json(pipeline);
  } catch (err) {
    next(err);
  }
}