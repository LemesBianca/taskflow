import { Priority, Status } from "@prisma/client";

export interface CreateTaskDTO {
    title: string;
    description: string;
    status: Status;
    priority: Priority;
    projectId: string;
}

export interface UpdateTaskDTO {
    status: Status;
}