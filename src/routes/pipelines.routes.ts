import { Router } from "express";
import { handleCreatePipeline, handleGetAllPipelines, handleGetPipeline, handleUpdatePipeline, handleDeletePipeline } from "../api/pipelines";

const router = Router();

router.post("/", handleCreatePipeline);
router.get("/", handleGetAllPipelines);
router.get("/:id", handleGetPipeline);
router.put("/:id", handleUpdatePipeline);
router.delete("/:id", handleDeletePipeline);

export default router;