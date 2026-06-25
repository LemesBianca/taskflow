const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export async function createSubtask(data: {
  title: string;
  status: string;
  priority: string;
  taskId: string;
}) {

  const response = await fetch(
    `${API_BASE_URL}/subtasks`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }
  );

  return response.json();
}

export async function updateSubtask(
  id: string,
  data: {
    title: string;
    status: string;
    priority: string;
  }
) {
  const response = await fetch(
    `${API_BASE_URL}/subtasks/${id}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }
  );

  return response.json();
}

export async function deleteSubtask(id: string) {
  await fetch(`${API_BASE_URL}/subtasks/${id}`, {
    method: "DELETE",
  });
}