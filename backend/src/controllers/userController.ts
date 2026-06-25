import { Request, Response } from "express";
import { UserService } from "../services/userService";

const userService = new UserService();

class UserController {

  async getAll(req: Request, res: Response) {

    const users = await userService.getAll();

    res.json(users);

  }
}

export const userController =
  new UserController(); 