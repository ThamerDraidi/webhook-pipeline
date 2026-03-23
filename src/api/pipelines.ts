import { Response, NextFunction } from "express";
import { createPipelineService, getAllPipelinesService, getPipelineService, updatePipelineService, deletePipelineService } from "../services/pipelines.service";
import { BadRequestError } from "../error";
import { AuthRequest } from "../types/auth.types";

export async function handleCreatePipeline(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const userId = req.userId!;
    const { name, event_type, actions, subscriber_urls } = req.body;
    if (!name || !event_type || !actions || !subscriber_urls) {
      throw new BadRequestError("Missing required fields");
    }
    const pipeline = await createPipelineService(userId, name, event_type, actions, subscriber_urls);
    res.status(201).json(pipeline);
  } catch (err) {
    next(err);
  }
}

export async function handleGetAllPipelines(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const pipelines = await getAllPipelinesService(req.userId!);
    res.json(pipelines);
  } catch (err) {
    next(err);
  }
}

export async function handleGetPipeline(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const pipeline = await getPipelineService(req.params.id as string, req.userId!);
    res.json(pipeline);
  } catch (err) {
    next(err);
  }
}

export async function handleUpdatePipeline(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const { name, event_type, actions, subscriber_urls } = req.body;
    if (!name || !event_type || !actions || !subscriber_urls) {
      throw new BadRequestError("Missing required fields");
    }
    const pipeline = await updatePipelineService(req.params.id as string, req.userId!, name, event_type, actions, subscriber_urls);
    res.json(pipeline);
  } catch (err) {
    next(err);
  }
}

export async function handleDeletePipeline(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  try {
    await deletePipelineService(req.params.id as string, req.userId!);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}