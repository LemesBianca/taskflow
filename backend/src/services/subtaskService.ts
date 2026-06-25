import { prisma } from "../prisma/prismaClient";

type SubtaskStatus = "TODO" | "IN_PROGRESS" | "DONE";
type SubtaskPriority = "LOW" | "MEDIUM" | "HIGH";

export class SubtaskService {

  async create(
    title: string,
    status: SubtaskStatus,
    priority: SubtaskPriority,
    taskId: string
  ) {

    return prisma.subtask.create({
      data: {
        title,
        status,
        priority,
        taskId
      }
    });

  }

  async update(
    id: string,
    data: {
      title?: string;
      status?: SubtaskStatus;
      priority?: SubtaskPriority;
    }
  ) {
    return prisma.subtask.update({
      where: { id },
      data,
    });
  }

  async delete(id: string) {
    return prisma.subtask.delete({
      where: { id },
    });
  }

}