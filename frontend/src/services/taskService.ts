import type { Task, TaskPriority, TaskStatus } from "@/types/Task";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

type CreateTaskInput = {
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  projectId: string;
  subtasks: Array<{
    title: string;
    status: TaskStatus;
    priority: TaskPriority;
  }>;
};

type UpdateTaskInput = {
  title?: string;
  description?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
};

export async function getTasks(): Promise<Task[]> {
    try {
        const response = await fetch(
      `${API_BASE_URL}/tasks`,
      {
        cache: "no-store",
      }
        );

        if (!response.ok) {
            console.warn("Tasks API returned non-OK status:", response.status);
            return [];
        }

        return response.json();
    } catch (error) {
        console.warn("Tasks API is unavailable:", error);
        return [];
    }
}
export async function createTask(data: CreateTaskInput): Promise<Task> {

  const response = await fetch(
    `${API_BASE_URL}/tasks`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    }
  );

  return response.json();
}

export async function updateTask(
  id: string,
  data: UpdateTaskInput
): Promise<Task> {
  const response = await fetch(`${API_BASE_URL}/tasks/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  return response.json();
}

export async function moveTask(id: string, status: TaskStatus): Promise<Task> {
  return updateTask(id, { status });
}

export async function deleteTask(id: string) {
  await fetch(`${API_BASE_URL}/tasks/${id}`, {
    method: "DELETE",
  });
}