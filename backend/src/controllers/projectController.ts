import { Request, Response } from "express";
import { ProjectService } from "../services/projectService";

const projectService = new ProjectService();

class ProjectController {

  async getAll(req: Request, res: Response) {
    const projects = await projectService.getAll();

    res.json(projects);
  }

  async create(req: Request, res: Response) {

    const { name, description } = req.body;

    const project = await projectService.create(
      name,
      description
    );

    res.status(201).json(project);
  }

}
export const projectController =
  new ProjectController();