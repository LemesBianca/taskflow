import { prisma } from "../prisma/prismaClient";
import { CreateTaskDTO, UpdateTaskDTO } from "../types/taskTypes";

export class TaskService {

    async getAll() {

        return prisma.task.findMany({
            include: {
                project: true,
                subtasks: true,
            }
        });

    }

    async create(data: CreateTaskDTO) {

        const { subtasks = [], ...taskData } = data;

        return prisma.task.create({
            data: {
                ...taskData,
                subtasks: subtasks.length > 0
                    ? {
                        create: subtasks,
                    }
                    : undefined,
            },
            include: {
                subtasks: true,
            },
        });

    }

    async update(id: string, data: UpdateTaskDTO) {

        return prisma.task.update({
            where: { id },
            data,
            include: {
                subtasks: true,
            },
        });

    }

    async delete(id: string) {

        return prisma.task.delete({
            where: { id }
        });

    }

}