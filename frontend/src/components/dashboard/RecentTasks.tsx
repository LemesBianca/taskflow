"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import PriorityBadge from "@/components/tasks/PriorityBadge";
import StatusBadge from "@/components/tasks/StatusBadge";
import TaskModal from "@/components/tasks/TaskModal";

type Task = {
  id: string;
  title: string;
  description?: string;
  status: "TODO" | "IN_PROGRESS" | "DONE";
  priority: "LOW" | "MEDIUM" | "HIGH";
  projectId: string;
  project: {
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
  tasks: Task[];
};

export default function RecentTasks({
  tasks,
}: Props) {
  const router = useRouter();
  const [currentTasks, setCurrentTasks] = useState<Task[]>(tasks);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);

  useEffect(() => {
    setCurrentTasks(tasks);
  }, [tasks]);

  const selectedTask = useMemo(
    () => currentTasks.find((task) => task.id === selectedTaskId) ?? null,
    [currentTasks, selectedTaskId]
  );

  return (
    <>
      <div className="bg-white rounded-3xl p-8 border border-zinc-300">

        <h2 className="text-2xl font-bold mb-8">
          Recent Tasks
        </h2>

        <div className="grid md:grid-cols-3 gap-8">

          {currentTasks.slice(0, 3).map((task) => (

            <div
              key={task.id}
              role="button"
              tabIndex={0}
              onClick={() => setSelectedTaskId(task.id)}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  setSelectedTaskId(task.id);
                }
              }}
              className="border rounded-3xl p-8 text-center cursor-pointer hover:shadow-xl duration-300"
            >

              <p className="text-zinc-500">
                {task.project.name}
              </p>

              <h3 className="text-3xl font-bold mt-4">
                {task.title}
              </h3>

              <p className="mt-6 text-zinc-600">
                {task.description}
              </p>

              <div className="mt-6 space-y-2">

                <div className="flex justify-center gap-2">
                  <StatusBadge status={task.status} />
                  <PriorityBadge priority={task.priority} />
                </div>

              </div>

            </div>

          ))}

        </div>

      </div>

      <TaskModal
        key={selectedTask?.id ?? "closed-task"}
        task={selectedTask}
        isOpen={selectedTask !== null}
        onClose={() => setSelectedTaskId(null)}
        onUpdated={(updatedTask) => {
          setCurrentTasks((previousTasks) =>
            previousTasks.map((currentTask) =>
              currentTask.id === updatedTask.id
                ? {
                    ...currentTask,
                    ...updatedTask,
                    project: currentTask.project,
                  }
                : currentTask
            )
          );
          router.refresh();
        }}
        onDeleted={(taskId) => {
          setSelectedTaskId(null);
          setCurrentTasks((previousTasks) =>
            previousTasks.filter((currentTask) => currentTask.id !== taskId)
          );
          router.refresh();
        }}
      />
    </>
  );
}