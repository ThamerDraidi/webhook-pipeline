import { Request, Response, NextFunction } from "express";
import { getJobById } from "../db/queries/jobs";
import { getDeliveryAttemptsByJobId } from "../db/queries/delivery";
import { NotFoundError } from "../error";

export async function handleGetJob(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const jobId = req.params.jobId as string;

    const job = await getJobById(jobId);
    if (!job) {
      throw new NotFoundError("Job not found");
    }

    const deliveryAttempts = await getDeliveryAttemptsByJobId(jobId);

    res.json({
      ...job,
      delivery_attempts: deliveryAttempts,
    });
  } catch (err) {
    next(err);
  }
}