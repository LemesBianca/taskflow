import { prisma } from "../prisma/prismaClient";

export class UserService {

  async getAll() {
    return prisma.user.findMany();
  }

}