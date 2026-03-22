import { Request, Response, NextFunction } from "express";
import { createPipeline, getPipelineById, getAllPipelines, deletePipeline ,updatePipeline} from "../db/queries/pipelines";
import { BadRequestError, NotFoundError } from "../error";


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
export async function handleGetAllPipelines(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const allPipelines = await getAllPipelines();
    res.json(allPipelines);
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
    const pipelineId = req.params.id as string;

    const pipeline = await getPipelineById(pipelineId);
    if (!pipeline) {
      throw new NotFoundError("Pipeline not found");
    }

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
    const pipelineId = req.params.id as string;

    const pipeline = await getPipelineById(pipelineId);
    if (!pipeline) {
      throw new NotFoundError("Pipeline not found");
    }

    await deletePipeline(pipelineId);
    res.status(204).send();
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
    const pipelineId = req.params.id as string;
    const { name, event_type, actions, subscriber_urls } = req.body;

    if (!name || !event_type || !actions || !subscriber_urls) {
      throw new BadRequestError("Missing required fields");
    }

    const pipeline = await getPipelineById(pipelineId);
    if (!pipeline) {
      throw new NotFoundError("Pipeline not found");
    }

    const updated = await updatePipeline(pipelineId, name, event_type, actions, subscriber_urls);
    res.json(updated);
  } catch (err) {
    next(err);
  }
}