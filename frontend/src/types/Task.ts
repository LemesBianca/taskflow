export type TaskStatus = "TODO" | "IN_PROGRESS" | "DONE";

export type TaskPriority = "LOW" | "MEDIUM" | "HIGH";

export interface TaskProjectSummary {
    name: string;
}

export interface TaskSubtask {
    id: string;
    title: string;
    status: TaskStatus;
    priority: TaskPriority;
}

export interface Task {
    id: string;
    title: string;
    description?: string;
    status: TaskStatus;
    priority: TaskPriority;
    projectId: string;
    project?: TaskProjectSummary;
    subtasks?: TaskSubtask[];
}