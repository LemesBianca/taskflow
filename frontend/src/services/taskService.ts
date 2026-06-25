const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export async function getTasks() {
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
export async function createTask(data: {
  title: string;
  description: string;
  status: string;
  priority: string;
  projectId: string;
  subtasks: Array<{
    title: string;
    status: string;
    priority: string;
  }>;
}) {

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
  data: {
    title: string;
    description: string;
    status: string;
    priority: string;
  }
) {
  const response = await fetch(`${API_BASE_URL}/tasks/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  return response.json();
}

export async function deleteTask(id: string) {
  await fetch(`${API_BASE_URL}/tasks/${id}`, {
    method: "DELETE",
  });
}