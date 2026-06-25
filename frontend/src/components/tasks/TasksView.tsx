"use client";

import { useRouter } from "next/navigation";
import { startTransition, useOptimistic, useState } from "react";
import CreateTaskModal from "@/components/tasks/CreateTaskModal";
import TaskCard from "@/components/tasks/TaskCard";
import { createTask } from "@/services/taskService";

type ProjectOption = {
  id: string;
  name: string;
};

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
  tasks: TaskItem[];
  projects: ProjectOption[];
};

type TaskListAction =
  | {
      type: "create";
      task: TaskItem;
    }
  | {
      type: "update";
      task: TaskItem;
    }
  | {
      type: "delete";
      taskId: string;
    };

export default function TasksView({
  tasks,
  projects,
}: Props) {
  const router = useRouter();
  const [openCreate, setOpenCreate] = useState(false);
  const [taskList, updateTaskList] = useOptimistic(
    tasks,
    (currentTasks, action: TaskListAction) => {
      if (action.type === "create") {
        return [action.task, ...currentTasks];
      }

      if (action.type === "update") {
        return currentTasks.map((currentTask) =>
          currentTask.id === action.task.id
            ? action.task
            : currentTask
        );
      }

      return currentTasks.filter(
        (currentTask) => currentTask.id !== action.taskId
      );
    }
  );

  const completed = taskList.filter(
    (task) => task.status === "DONE"
  ).length;

  const inProgress = taskList.filter(
    (task) => task.status === "IN_PROGRESS"
  ).length;

  const handleCreateTask = async (data: {
    title: string;
    description: string;
    status: "TODO" | "IN_PROGRESS" | "DONE";
    priority: "LOW" | "MEDIUM" | "HIGH";
    projectId: string;
    subtasks: Array<{
      title: string;
      status: "TODO" | "IN_PROGRESS" | "DONE";
      priority: "LOW" | "MEDIUM" | "HIGH";
    }>;
  }) => {
    const createdTask = await createTask(data);

    startTransition(() => {
      updateTaskList({
        type: "create",
        task: createdTask,
      });
    });

    router.refresh();
  };

  return (
    <>
      <div className="space-y-10">
        <div>
          <h1 className="text-4xl font-bold">
            Tasks
          </h1>

          <p className="text-zinc-500 mt-2">
            Overview of your tasks
          </p>
        </div>

        <input
          type="text"
          placeholder="Search task"
          className="
            w-full
            border
            rounded-full
            px-5
            py-3
          "
        />

        <div className="grid md:grid-cols-4 gap-6">
          <div className="border rounded-3xl p-6 text-center">
            <p className="text-zinc-500">
              All tasks
            </p>

            <p className="text-4xl font-bold">
              {taskList.length}
            </p>
          </div>

          <div className="border rounded-3xl p-6 text-center">
            <p className="text-zinc-500">
              In progress
            </p>

            <p className="text-4xl font-bold">
              {inProgress}
            </p>
          </div>

          <div className="border rounded-3xl p-6 text-center">
            <p className="text-zinc-500">
              Complete
            </p>

            <p className="text-4xl font-bold">
              {completed}
            </p>
          </div>

          <button
            onClick={() => setOpenCreate(true)}
            className="
              border rounded-3xl p-6
              text-4xl font-bold
              hover:bg-black hover:text-white
              duration-300
            "
          >
            +
          </button>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {taskList.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onUpdated={(updatedTask) => {
                startTransition(() => {
                  updateTaskList({
                    type: "update",
                    task: updatedTask,
                  });
                });
              }}
              onDeleted={(taskId) => {
                startTransition(() => {
                  updateTaskList({
                    type: "delete",
                    taskId,
                  });
                });
              }}
            />
          ))}
        </div>
      </div>

      <CreateTaskModal
        isOpen={openCreate}
        onClose={() => setOpenCreate(false)}
        onSubmit={handleCreateTask}
        projects={projects}
      />
    </>
  );
}
