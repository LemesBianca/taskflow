"use client";

import type { DragEvent } from "react";

import BoardTaskCard from "./BoardTaskCard";
import type { Task, TaskStatus } from "@/types/Task";

type Props = {
  title: string;
  status: TaskStatus;
  tasks: Task[];
  onTaskClick: (task: Task) => void;
  onTaskDragStart: (taskId: string) => void;
  onTaskDragEnd: () => void;
  onColumnDragOver: (status: TaskStatus) => void;
  onTaskDrop: (status: TaskStatus) => void;
  draggedTaskId: string | null;
  isDragOver: boolean;
};

export default function BoardColumn({
  title,
  status,
  tasks,
  onTaskClick,
  onTaskDragStart,
  onTaskDragEnd,
  onColumnDragOver,
  onTaskDrop,
  draggedTaskId,
  isDragOver,
}: Props) {
  const handleDragOver = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    onColumnDragOver(status);
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    onTaskDrop(status);
  };
  

  return (
    <div
      className="
        bg-zinc-100
        rounded-3xl
        p-6
        min-h-[650px]
        transition-colors
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

      <div
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className={[
          "space-y-4 rounded-2xl border border-dashed border-transparent p-2 transition-colors",
          isDragOver ? "border-zinc-300 bg-white/70" : "",
        ].join(" ")}
      >
        {tasks.map((task) => (
          <BoardTaskCard
            key={task.id}
            task={task}
            onClick={() => onTaskClick(task)}
            onDragStart={() => onTaskDragStart(task.id)}
            onDragEnd={onTaskDragEnd}
            isDragging={draggedTaskId === task.id}
          />
        ))}
      </div>
    </div>
  );
}