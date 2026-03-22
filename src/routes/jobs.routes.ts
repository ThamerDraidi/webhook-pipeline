import { Router } from "express";
import { handleGetJob } from "../api/jobs";

const router = Router();

router.get("/:jobId", handleGetJob);

export default router;