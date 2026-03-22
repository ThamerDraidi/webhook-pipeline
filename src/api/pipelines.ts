import { Request, Response, NextFunction } from "express";
import { createPipelineService, getAllPipelinesService, getPipelineService, updatePipelineService, deletePipelineService } from "../services/pipelines.service";
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
    const pipeline = await createPipelineService(name, event_type, actions, subscriber_urls);
    res.status(201).json(pipeline);
  } catch (err) {
    next(err);
  }
}

export async function handleGetAllPipelines(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const pipelines = await getAllPipelinesService();
    res.json(pipelines);
  } catch (err) {
    next(err);
  }
}

export async function handleGetPipeline(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const pipeline = await getPipelineService(req.params.id as string);
    res.json(pipeline);
  } catch (err) {
    next(err);
  }
}

export async function handleUpdatePipeline(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { name, event_type, actions, subscriber_urls } = req.body;
    if (!name || !event_type || !actions || !subscriber_urls) {
      throw new BadRequestError("Missing required fields");
    }
    const pipeline = await updatePipelineService(req.params.id as string, name, event_type, actions, subscriber_urls);
    res.json(pipeline);
  } catch (err) {
    next(err);
  }
}

export async function handleDeletePipeline(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    await deletePipelineService(req.params.id as string);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}