import ProjectsView from "@/components/projects/ProjectsView";
import { getProjects } from "@/services/projectService";

type TaskItem = {
  id: string;
  status: "TODO" | "IN_PROGRESS" | "DONE";
};

type ProjectItem = {
  id: string;
  name: string;
  description?: string;
  tasks: TaskItem[];
};

export default async function ProjectsPage() {


  const projects = await getProjects();

  const totalProjects = projects.length;

  const completedProjects = projects.filter(
    (project: ProjectItem) =>
      project.tasks.every(
        (task: TaskItem) => task.status === "DONE"
      )
  ).length;

  const inProgressProjects = totalProjects - completedProjects;

  return (
    <ProjectsView
      projects={projects}
      totalProjects={totalProjects}
      completedProjects={completedProjects}
      inProgressProjects={inProgressProjects}
    />
  );
}