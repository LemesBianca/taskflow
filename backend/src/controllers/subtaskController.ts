import { Request, Response } from "express";
import { SubtaskService } from "../services/subtaskService";

const subtaskService = new SubtaskService();

export class SubtaskController {

  async create(req: Request, res: Response) {

    const {
      title,
      status,
      priority,
      taskId
    } = req.body;

    const subtask = await subtaskService.create(
      title,
      status,
      priority,
      taskId
    );

    res.status(201).json(subtask);

  }

  async update(
    req: Request<{ id: string }>,
    res: Response
  ) {
    const { id } = req.params;

    const subtask = await subtaskService.update(id, req.body);

    return res.json(subtask);
  }

  async delete(
    req: Request<{ id: string }>,
    res: Response
  ) {
    const { id } = req.params;

    await subtaskService.delete(id);

    return res.status(204).send();
  }

}