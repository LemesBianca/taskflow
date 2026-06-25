"use client";

import StatusBadge from "./StatusBadge";
import PriorityBadge from "./PriorityBadge";
import { useState } from "react";
import TaskModal from "./TaskModal";
import { useRouter } from "next/navigation";

type TaskItem = {
  id: string;
  title: string;
  description?: string;
  status: "TODO" | "IN_PROGRESS" | "DONE";
  priority: "LOW" | "MEDIUM" | "HIGH";
  projectId: string;
  project?: {
    name: string;
  };
  subtasks?: Array<{
    id: string;
    title: string;
    status: "TODO" | "IN_PROGRESS" | "DONE";
    priority: "LOW" | "MEDIUM" | "HIGH";
  }>;
};

type Props = {
  task: TaskItem;
  onUpdated?: (task: TaskItem) => void;
  onDeleted?: (taskId: string) => void;
};

export default function TaskCard({
  task,
  onUpdated,
  onDeleted,
}: Props) {
  const router = useRouter();

  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <div className="
        border rounded-3xl p-8
        hover:shadow-xl
        cursor-pointer
        duration-300
      " onClick={handleOpenModal}>

        {task.project?.name && (
          <p className="text-zinc-500 mb-3">
            {task.project.name}
          </p>
        )}

        <h2 className="text-3xl font-bold mb-4">
          {task.title}
        </h2>


        <p className="text-zinc-500 mb-8">
          {task.description}
        </p>


        <div className="flex gap-3">

          <StatusBadge
            status={task.status}
          />

          <PriorityBadge
            priority={task.priority}
          />

        </div>

      </div>

      <TaskModal
        key={task.id}
        task={task}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onUpdated={(updatedTask) => {
          onUpdated?.(updatedTask);
          router.refresh();
        }}
        onDeleted={(taskId) => {
          setIsModalOpen(false);
          onDeleted?.(taskId);
          router.refresh();
        }}
      />
    </>
  );
}