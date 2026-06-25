import { Router } from "express";
import { SubtaskController } from "../controllers/subtaskController";

const router = Router();

const subtaskController = new SubtaskController();

router.post(
  "/",
  subtaskController.create
);

router.put(
  "/:id",
  subtaskController.update
);

router.delete(
  "/:id",
  subtaskController.delete
);

export default router;