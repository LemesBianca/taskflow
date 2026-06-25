const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export async function getProjects() {
    try {
        const response = await fetch(
      `${API_BASE_URL}/projects`,
      {
        cache: "no-store",
      }
        );

        if (!response.ok) {
            console.warn("Projects API returned non-OK status:", response.status);
            return [];
        }

        return response.json();
    } catch (error) {
        console.warn("Projects API is unavailable:", error);
        return [];
    }
}
export async function createProject(data: {
  name: string;
  description: string;
}) {

  const response = await fetch(
    `http://localhost:3001/projects`,
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