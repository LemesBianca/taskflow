"use client";

import BoardTaskCard from "./BoardTaskCard";

type Props = {
  title: string;
  tasks: any[];
  onTaskClick: (task: any) => void;
};

export default function BoardColumn({
  title,
  tasks,
  onTaskClick,
}: Props) {
  return (
    <div
      className="
        bg-zinc-100
        rounded-3xl
        p-6
        min-h-[650px]
      "
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">{title}</h2>

        <span
          className="
            bg-white
            rounded-full
            px-3
            py-1
            text-sm
            font-semibold
          "
        >
          {tasks.length}
        </span>
      </div>

      <div className="space-y-4">
        {tasks.map((task) => (
          <BoardTaskCard
            key={task.id}
            task={task}
            onClick={() => onTaskClick(task)}
          />
        ))}
      </div>
    </div>
  );
}