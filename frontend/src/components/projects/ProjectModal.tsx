"use client";

import { startTransition, useOptimistic, useState } from "react";
import { useRouter } from "next/navigation";

import CreateTaskModal from "@/components/tasks/CreateTaskModal";
import TaskModal from "@/components/tasks/TaskModal";
import { createTask, updateTask } from "@/services/taskService";

type TaskItem = {
  id: string;
  title: string;
  description?: string;
  status: "TODO" | "IN_PROGRESS" | "DONE";
  priority: "LOW" | "MEDIUM" | "HIGH";
  projectId: string;
  subtasks?: Array<{
    id: string;
    title: string;
    status: "TODO" | "IN_PROGRESS" | "DONE";
    priority: "LOW" | "MEDIUM" | "HIGH";
  }>;
};

type ProjectItem = {
  id: string;
  name: string;
  description?: string;
  tasks: TaskItem[];
};

type Props = {
  project: ProjectItem | null;
  isOpen: boolean;
  onClose: () => void;
  onProjectUpdated?: (project: ProjectItem) => void;
};

type ProjectTaskAction =
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

function applyProjectTaskAction(
  projectValue: ProjectItem | null,
  action: ProjectTaskAction
) {
  if (!projectValue) return projectValue;

  if (action.type === "create") {
    return {
      ...projectValue,
      tasks: [action.task, ...projectValue.tasks],
    };
  }

  if (action.type === "update") {
    return {
      ...projectValue,
      tasks: projectValue.tasks.map((task) =>
        task.id === action.task.id
          ? action.task
          : task
      ),
    };
  }

  return {
    ...projectValue,
    tasks: projectValue.tasks.filter(
      (task) => task.id !== action.taskId
    ),
  };
}

function getStatusClasses(status: "TODO" | "IN_PROGRESS" | "DONE") {
  if (status === "DONE") return "bg-emerald-100 text-emerald-700 border-emerald-200";
  if (status === "IN_PROGRESS") return "bg-amber-100 text-amber-700 border-amber-200";
  return "bg-blue-100 text-blue-700 border-blue-200";
}

function getPriorityClasses(priority: "LOW" | "MEDIUM" | "HIGH") {
  if (priority === "HIGH") return "bg-rose-100 text-rose-700 border-rose-200";
  if (priority === "MEDIUM") return "bg-amber-100 text-amber-700 border-amber-200";
  return "bg-sky-100 text-sky-700 border-sky-200";
}

function badgeSelectClass(colorClass: string) {
  return `rounded-full border px-3 py-1 text-sm font-medium outline-none ${colorClass}`;
}

export default function ProjectModal({
  project,
  isOpen,
  onClose,
  onProjectUpdated,
}: Props) {
  const router = useRouter();
  const [openCreate, setOpenCreate] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [currentProject, updateCurrentProject] = useOptimistic(
    project,
    applyProjectTaskAction
  );

  const applyProjectAction = (action: ProjectTaskAction) => {
    if (!currentProject) return;

    const nextProject = applyProjectTaskAction(currentProject, action);

    startTransition(() => {
      updateCurrentProject(action);
    });

    if (nextProject) {
      onProjectUpdated?.(nextProject);
    }
  };

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
    if (!currentProject) return;

    const createdTask = await createTask({
      ...data,
      projectId: currentProject.id,
    });

    applyProjectAction({
      type: "create",
      task: createdTask,
    });

    router.refresh();
  };

  const selectedTask = currentProject?.tasks.find(
    (task) => task.id === selectedTaskId
  ) ?? null;

  const handleInlineTaskChange = async (
    taskId: string,
    patch: Partial<Pick<TaskItem, "status" | "priority">>
  ) => {
    const currentTask = currentProject?.tasks.find((task) => task.id === taskId);
    if (!currentTask) return;

    const optimisticTask: TaskItem = {
      ...currentTask,
      ...patch,
    };

    applyProjectAction({
      type: "update",
      task: optimisticTask,
    });

    const updatedTask = await updateTask(taskId, {
      title: optimisticTask.title,
      description: optimisticTask.description ?? "",
      status: optimisticTask.status,
      priority: optimisticTask.priority,
    });

    applyProjectAction({
      type: "update",
      task: {
        ...optimisticTask,
        ...updatedTask,
        subtasks: updatedTask.subtasks ?? optimisticTask.subtasks,
      },
    });

    router.refresh();
  };

  if (!isOpen || !currentProject) return null;

  return (
    <>
      <div
        onClick={onClose}
        className="
          fixed inset-0
          bg-black/40
          flex items-center justify-center
          z-50
        "
      >
        <div
          onClick={(event) => event.stopPropagation()}
          className="
            bg-white
            w-[90%]
            max-w-5xl
            rounded-3xl
            p-8
            relative
          "
        >
          {/* Header */}
          <div className="mb-8">

            <h1 className="text-4xl font-bold">
              {currentProject.name}
            </h1>

            <p className="text-zinc-500 mt-3">
              {currentProject.description}
            </p>

          </div>

          {/* Estatísticas */}
          <div className="flex gap-8 mb-10">

            <div>
              <p className="text-zinc-500">
                Total tasks
              </p>

              <p className="text-3xl font-bold">
                {currentProject.tasks.length}
              </p>
            </div>

            <div>
              <p className="text-zinc-500">
                In progress
              </p>

              <p className="text-3xl font-bold">
                {
                  currentProject.tasks.filter(
                    (task) =>
                      task.status === "IN_PROGRESS"
                  ).length
                }
              </p>
            </div>

            <div>
              <p className="text-zinc-500">
                Completed
              </p>

              <p className="text-3xl font-bold">
                {
                  currentProject.tasks.filter(
                    (task) =>
                      task.status === "DONE"
                  ).length
                }
              </p>
            </div>

          </div>

          {/* Tarefas */}
          <div className="border rounded-3xl p-6">

            <div className="flex justify-between mb-6">

              <h2 className="text-2xl font-bold">
                Tasks
              </h2>

              <button
                onClick={() => setOpenCreate(true)}
                className="
                  w-10 h-10
                  rounded-full
                  border
                  hover:bg-black
                  hover:text-white
                  duration-300
                "
              >
                +
              </button>


            </div>

            <div className="space-y-4">

              {currentProject.tasks.map((task) => (

                <div
                  key={task.id}
                  className="
                    border-b
                    pb-3
                    flex justify-between
                    cursor-pointer
                    hover:opacity-75
                    duration-300
                  "
                  onClick={() => setSelectedTaskId(task.id)}
                >
                  <div>

                    <h3 className="font-bold">
                      {task.title}
                    </h3>

                    <p className="text-zinc-500 text-sm">
                      {task.description}
                    </p>

                  </div>

                  <div className="flex gap-4">

                    <select
                      value={task.status}
                      onClick={(event) => event.stopPropagation()}
                      onChange={(event) => {
                        void handleInlineTaskChange(task.id, {
                          status: event.target.value as "TODO" | "IN_PROGRESS" | "DONE",
                        });
                      }}
                      className={badgeSelectClass(getStatusClasses(task.status))}
                    >
                      <option value="TODO">TODO</option>
                      <option value="IN_PROGRESS">IN_PROGRESS</option>
                      <option value="DONE">DONE</option>
                    </select>

                    <select
                      value={task.priority}
                      onClick={(event) => event.stopPropagation()}
                      onChange={(event) => {
                        void handleInlineTaskChange(task.id, {
                          priority: event.target.value as "LOW" | "MEDIUM" | "HIGH",
                        });
                      }}
                      className={badgeSelectClass(getPriorityClasses(task.priority))}
                    >
                      <option value="LOW">LOW</option>
                      <option value="MEDIUM">MEDIUM</option>
                      <option value="HIGH">HIGH</option>
                    </select>

                  </div>

                </div>

              ))}

            </div>

          </div>

        </div>
      </div>

      <CreateTaskModal
        isOpen={openCreate}
        onClose={() => setOpenCreate(false)}
        onSubmit={handleCreateTask}
        projects={[{ id: currentProject.id, name: currentProject.name }]}
        defaultProjectId={currentProject.id}
      />

      <TaskModal
        key={selectedTask?.id ?? "closed-task"}
        task={selectedTask}
        isOpen={selectedTask !== null}
        onClose={() => setSelectedTaskId(null)}
        onUpdated={(updatedTask: TaskItem) => {
          applyProjectAction({
            type: "update",
            task: updatedTask,
          });
          router.refresh();
        }}
        onDeleted={(taskId: string) => {
          setSelectedTaskId(null);
          applyProjectAction({
            type: "delete",
            taskId,
          });
          router.refresh();
        }}
      />
    </>
  );
}