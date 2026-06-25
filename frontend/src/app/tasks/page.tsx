import TasksView from "@/components/tasks/TasksView";
import { getProjects } from "@/services/projectService";
import { getTasks } from "@/services/taskService";

export default async function TasksPage() {

  const projects = await getProjects();
  const tasks = await getTasks();

  return (
    <TasksView
      tasks={tasks}
      projects={projects}
    />
  );
}