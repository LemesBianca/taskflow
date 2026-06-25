import { prisma } from "../prisma/prismaClient";

export class ProjectService {

  async getAll() {
    return prisma.project.findMany({
      include: {
        tasks: {
          include: {
            subtasks: true,
          },
        },
      }
    });
  }

  async create(name: string, description?: string) {
    return prisma.project.create({
      data: {
        name,
        description
      }
    });
  }

}