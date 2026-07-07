"use client";

import type { DragEvent } from "react";

import PriorityBadge from "../tasks/PriorityBadge";
import type { Task } from "@/types/Task";

type Props = {
  task: Task;
  onClick: () => void;
  onDragStart: (event: DragEvent<HTMLDivElement>) => void;
  onDragEnd: () => void;
  isDragging: boolean;
};

export default function BoardTaskCard({
  task,
  onClick,
  onDragStart,
  onDragEnd,
  isDragging,
}: Props) {
  return (
    <div
      draggable
      onClick={onClick}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      className="
        bg-white
        rounded-2xl
        border
        border-zinc-200
        p-5
        cursor-pointer
        hover:shadow-lg
        active:cursor-grabbing
        transition-all
      "
      style={{ opacity: isDragging ? 0.55 : 1 }}
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