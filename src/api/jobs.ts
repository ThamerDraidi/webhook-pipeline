import { Request, Response, NextFunction } from "express";
import { getJobService } from "../services/jobs.service";

export async function handleGetJob(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const job = await getJobService(req.params.jobId as string);
    res.json(job);
  } catch (err) {
    next(err);
  }
}