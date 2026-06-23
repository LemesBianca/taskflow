import { prisma } from "../prisma/prismaClient";
import { CreateTaskDTO } from "../types/taskTypes";
import { Status } from "@prisma/client";

export class TaskService {

    async getAll() {

        return prisma.task.findMany({
            include: {
                project: true
            }
        });

    }

    async create(data: CreateTaskDTO) {

        return prisma.task.create({
            data
        });

    }

    async updateStatus(id: string, status: Status) {

        return prisma.task.update({
            where: { id },
            data: { status }
        });

    }

    async delete(id: string) {

        return prisma.task.delete({
            where: { id }
        });

    }

}