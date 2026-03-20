import { Request, Response, NextFunction } from "express";
import { createPipeline } from "../db/queries/pipelines";
import { BadRequestError } from "../error";

export async function handleCreatePipeline(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { name, event_type, actions, subscriber_urls } = req.body;

    if (!name || !event_type || !actions || !subscriber_urls) {
      throw new BadRequestError("Missing required fields");
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