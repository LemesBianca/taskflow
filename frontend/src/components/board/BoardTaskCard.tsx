"use client";

import PriorityBadge from "../tasks/PriorityBadge";

type Props = {
  task: {
    id: string;
    title: string;
    priority: "LOW" | "MEDIUM" | "HIGH";
    project?: {
      name: string;
    };
  };

  onClick: () => void;
};

export default function BoardTaskCard({
  task,
  onClick,
}: Props) {
  return (
    <div
      onClick={onClick}
      className="
        bg-white
        rounded-2xl
        border
        border-zinc-200
        p-5
        cursor-pointer
        hover:shadow-lg
        transition-all
      "
    >
      <h3 className="font-semibold text-lg">
        {task.title}
      </h3>

      <p className="text-sm text-zinc-500 mt-2">
        {task.project?.name}
      </p>

      <div className="mt-4">
        <PriorityBadge priority={task.priority} />
      </div>
    </div>
  );
}