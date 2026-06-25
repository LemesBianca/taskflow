import { Priority, Status } from "@prisma/client";

export interface CreateTaskDTO {
    title: string;
    description: string;
    status: Status;
    priority: Priority;
    projectId: string;
    subtasks?: Array<{
        title: string;
        status: Status;
        priority: Priority;
    }>;
}

export interface UpdateTaskDTO {
    title?: string;
    description?: string;
    status?: Status;
    priority?: Priority;
}