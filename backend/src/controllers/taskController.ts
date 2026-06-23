import { Request, Response } from "express";
import { TaskService } from "../services/taskService";

const taskService = new TaskService();

class TaskController {

    async getAll(
        req: Request,
        res: Response
    ) {

        const tasks = await taskService.getAll();

        return res.json(tasks);

    }

    async create(
        req: Request,
        res: Response
    ) {

        const task = await taskService.create(
            req.body
        );

        return res.status(201).json(task);

    }

    async updateStatus(
        req: Request<{ id: string }>,
        res: Response
    ) {

        const { id } = req.params;
        const { status } = req.body;

        const task = await taskService.updateStatus(
            id,
            status
        );

        return res.json(task);

    }

    async delete(
        req: Request<{ id: string }>,
        res: Response
    ) {

        const { id } = req.params;

        await taskService.delete(id);

        return res.status(204).send();

    }

}

export const taskController =
  new TaskController();