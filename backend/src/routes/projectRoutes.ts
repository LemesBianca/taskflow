import { Router } from "express";
import { projectController } from "../controllers/projectController";

const router = Router();

router.get("/", projectController.getAll);

router.post("/", projectController.create);

export default router;