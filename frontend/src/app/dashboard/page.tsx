import StatCard from "@/components/dashboard/StatCard";
import RecentProjects from "@/components/dashboard/RecentProjects";
import RecentTasks from "@/components/dashboard/RecentTasks";
import { getProjects } from "@/services/projectService";
import { getTasks } from "@/services/taskService";

type TaskItem = {
  id: string;
  status: "TODO" | "IN_PROGRESS" | "DONE";
};

export default async function DashboardPage() {

  const projects = await getProjects();
  const tasks = await getTasks();

  const totalProjects = projects.length;

  const totalTasks = tasks.length;

  const completedTasks = tasks.filter(
    (task: TaskItem) => task.status === "DONE"
  ).length;

  const inProgressTasks = tasks.filter(
    (task: TaskItem) => task.status === "IN_PROGRESS"
  ).length;

  return (
    <div className="space-y-10">

      {/* Título */}
      <div>
        <h1 className="text-4xl font-bold">
          Dashboard
        </h1>

        <p className="text-zinc-500 mt-2">
          Overview of your projects and tasks
        </p>
      </div>


      {/* Statistics */}
      <div className="grid md:grid-cols-4 gap-6">

        <StatCard
          title="Projects"
          value={totalProjects}
        />

        <StatCard
          title="Tasks"
          value={totalTasks}
        />

        <StatCard
          title="Completed"
          value={completedTasks}
        />

        <StatCard
          title="In Progress"
          value={inProgressTasks}
        />

      </div>


      <RecentProjects projects={projects} />

      <RecentTasks tasks={tasks} />

    </div>
  );
}