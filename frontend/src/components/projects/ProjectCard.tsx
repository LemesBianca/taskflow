"use client";

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

type Props = {
  project: ProjectItem;
  onClick?: () => void;
};

export default function ProjectCard({
  project,
  onClick,
}: Props) {

  const completed = project.tasks.filter(
    (task) => task.status === "DONE"
  ).length;

  const inProgress = project.tasks.filter(
    (task) => task.status === "IN_PROGRESS"
  ).length;

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onClick?.();
        }
      }}
      className="
        border rounded-3xl p-8
        cursor-pointer hover:shadow-xl duration-300
    ">
      <h2 className="text-3xl font-bold mb-4">
        {project.name}
      </h2>

      <p className="text-zinc-500 mb-8">
        {project.description}
      </p>


      <div className="flex gap-10">

        <div>
          <p className="text-zinc-500">
            Tasks
          </p>

          <p className="text-2xl font-bold">
            {project.tasks.length}
          </p>
        </div>


        <div>
          <p className="text-zinc-500">
            In Progress
          </p>

          <p className="text-2xl font-bold">
            {inProgress}
          </p>
        </div>


        <div>
          <p className="text-zinc-500">
            Complete
          </p>

          <p className="text-2xl font-bold">
            {completed}
          </p>
        </div>

      </div>

    </div>
  );
}