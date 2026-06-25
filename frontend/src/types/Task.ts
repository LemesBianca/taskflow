export interface Task {
    id: string;
    title: string;
    description?: string;

    status:
        | "TODO"
        | "IN_PROGRESS"
        | "DONE";

    priority:
        | "LOW"
        | "MEDIUM"
        | "HIGH";

    projectId: string;
}