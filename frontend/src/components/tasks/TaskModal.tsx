"use client";

import { useEffect, useState } from "react";

import DeleteModal from "@/components/common/DeleteModal";
import {
  createSubtask,
  deleteSubtask,
  updateSubtask,
} from "@/services/subtaskService";
import { deleteTask, updateTask } from "@/services/taskService";

type Status = "TODO" | "IN_PROGRESS" | "DONE";
type Priority = "LOW" | "MEDIUM" | "HIGH";

type SubtaskItem = {
  id: string;
  title: string;
  status: Status;
  priority: Priority;
  isDraft?: boolean;
};

type TaskItem = {
  id: string;
  title: string;
  description?: string;
  status: Status;
  priority: Priority;
  projectId: string;
  subtasks?: SubtaskItem[];
};

type Props = {
  task: TaskItem | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdated?: (task: TaskItem) => void;
  onDeleted?: (taskId: string) => void;
};

const STATUS_OPTIONS: Status[] = ["TODO", "IN_PROGRESS", "DONE"];
const PRIORITY_OPTIONS: Priority[] = ["LOW", "MEDIUM", "HIGH"];

function getStatusClasses(status: Status) {
  if (status === "DONE") return "bg-emerald-100 text-emerald-700 border-emerald-200";
  if (status === "IN_PROGRESS") return "bg-amber-100 text-amber-700 border-amber-200";
  return "bg-blue-100 text-blue-700 border-blue-200";
}

function getPriorityClasses(priority: Priority) {
  if (priority === "HIGH") return "bg-rose-100 text-rose-700 border-rose-200";
  if (priority === "MEDIUM") return "bg-amber-100 text-amber-700 border-amber-200";
  return "bg-sky-100 text-sky-700 border-sky-200";
}

function badgeSelectClass(colorClass: string) {
  return `rounded-full border px-3 py-1 text-sm font-medium outline-none ${colorClass}`;
}

export default function TaskModal({
  task,
  isOpen,
  onClose,
  onUpdated,
  onDeleted,
}: Props) {
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSavingTask, setIsSavingTask] = useState(false);
  const [title, setTitle] = useState(task?.title ?? "");
  const [description, setDescription] = useState(task?.description ?? "");
  const [status, setStatus] = useState<Status>(task?.status ?? "TODO");
  const [priority, setPriority] = useState<Priority>(task?.priority ?? "MEDIUM");
  const [savedTask, setSavedTask] = useState({
    title: task?.title ?? "",
    description: task?.description ?? "",
    status: task?.status ?? "TODO",
    priority: task?.priority ?? "MEDIUM",
  });
  const [taskSubtasks, setTaskSubtasks] = useState<SubtaskItem[]>(task?.subtasks ?? []);
  const [savingSubtaskId, setSavingSubtaskId] = useState<string | null>(null);
  const [deletingSubtaskId, setDeletingSubtaskId] = useState<string | null>(null);

  useEffect(() => {
    if (!task) {
      setTitle("");
      setDescription("");
      setStatus("TODO");
      setPriority("MEDIUM");
      setSavedTask({
        title: "",
        description: "",
        status: "TODO",
        priority: "MEDIUM",
      });
      setTaskSubtasks([]);
      return;
    }

    setTitle(task.title ?? "");
    setDescription(task.description ?? "");
    setStatus(task.status ?? "TODO");
    setPriority(task.priority ?? "MEDIUM");
    setSavedTask({
      title: task.title ?? "",
      description: task.description ?? "",
      status: task.status ?? "TODO",
      priority: task.priority ?? "MEDIUM",
    });
    setTaskSubtasks(task.subtasks ?? []);
  }, [task?.id]);

  if (!isOpen || !task) return null;

  const emitTaskUpdate = (nextSubtasks: SubtaskItem[], overrides?: Partial<TaskItem>) => {
    onUpdated?.({
      ...task,
      title,
      description,
      status,
      priority,
      subtasks: nextSubtasks,
      ...overrides,
    });
  };

  const persistTask = async (overrides?: Partial<{
    title: string;
    description: string;
    status: Status;
    priority: Priority;
  }>) => {
    const nextTitle = (overrides?.title ?? title).trim();
    const nextDescription = (overrides?.description ?? description).trim();
    const nextStatus = overrides?.status ?? status;
    const nextPriority = overrides?.priority ?? priority;

    if (!nextTitle) {
      setTitle(savedTask.title);
      return;
    }

    if (
      nextTitle === savedTask.title
      && nextDescription === savedTask.description
      && nextStatus === savedTask.status
      && nextPriority === savedTask.priority
    ) {
      return;
    }

    try {
      setIsSavingTask(true);

      const updatedTask = await updateTask(task.id, {
        title: nextTitle,
        description: nextDescription,
        status: nextStatus,
        priority: nextPriority,
      });

      const persistedTask: TaskItem = {
        ...task,
        ...updatedTask,
        title: updatedTask.title ?? nextTitle,
        description: updatedTask.description ?? nextDescription,
        status: updatedTask.status ?? nextStatus,
        priority: updatedTask.priority ?? nextPriority,
        subtasks: updatedTask.subtasks ?? taskSubtasks,
      };

      setTitle(persistedTask.title);
      setDescription(persistedTask.description ?? "");
      setStatus(persistedTask.status);
      setPriority(persistedTask.priority);
      setSavedTask({
        title: persistedTask.title,
        description: persistedTask.description ?? "",
        status: persistedTask.status,
        priority: persistedTask.priority,
      });

      onUpdated?.(persistedTask);
    } finally {
      setIsSavingTask(false);
    }
  };

  const handleAddSubtask = () => {
    setTaskSubtasks((currentSubtasks) => [
      ...currentSubtasks,
      {
        id: `draft-${Date.now()}-${currentSubtasks.length}`,
        title: "",
        status: "TODO",
        priority: "MEDIUM",
        isDraft: true,
      },
    ]);
  };

  const updateLocalSubtask = (
    subtaskId: string,
    updater: (subtask: SubtaskItem) => SubtaskItem
  ) => {
    setTaskSubtasks((currentSubtasks) =>
      currentSubtasks.map((currentSubtask) =>
        currentSubtask.id === subtaskId
          ? updater(currentSubtask)
          : currentSubtask
      )
    );
  };

  const persistSubtask = async (subtaskId: string) => {
    const currentSubtask = taskSubtasks.find((item) => item.id === subtaskId);
    if (!currentSubtask) return;

    const trimmedTitle = currentSubtask.title.trim();
    if (!trimmedTitle) {
      if (currentSubtask.isDraft) {
        setTaskSubtasks((currentSubtasks) =>
          currentSubtasks.filter((item) => item.id !== subtaskId)
        );
        return;
      }

      const originalSubtask = task.subtasks?.find((item) => item.id === subtaskId);
      if (!originalSubtask) return;

      updateLocalSubtask(subtaskId, () => originalSubtask);
      return;
    }

    try {
      setSavingSubtaskId(subtaskId);

      const persistedSubtask = currentSubtask.isDraft
        ? await createSubtask({
            title: trimmedTitle,
            status: currentSubtask.status,
            priority: currentSubtask.priority,
            taskId: task.id,
          })
        : await updateSubtask(subtaskId, {
            title: trimmedTitle,
            status: currentSubtask.status,
            priority: currentSubtask.priority,
          });

      const nextSubtasks = taskSubtasks.map((item) =>
        item.id === subtaskId
          ? persistedSubtask
          : item
      );

      setTaskSubtasks(nextSubtasks);
      emitTaskUpdate(nextSubtasks);
    } finally {
      setSavingSubtaskId(null);
    }
  };

  const handleSubtaskStatusChange = async (subtaskId: string, nextStatus: Status) => {
    const currentSubtask = taskSubtasks.find((item) => item.id === subtaskId);
    if (!currentSubtask) return;

    const nextSubtasks = taskSubtasks.map((item) =>
      item.id === subtaskId
        ? {
            ...item,
            status: nextStatus,
          }
        : item
    );

    setTaskSubtasks(nextSubtasks);

    if (currentSubtask.isDraft && !currentSubtask.title.trim()) {
      return;
    }

    try {
      setSavingSubtaskId(subtaskId);

      const persistedSubtask = currentSubtask.isDraft
        ? await createSubtask({
            title: currentSubtask.title.trim(),
            status: nextStatus,
            priority: currentSubtask.priority,
            taskId: task.id,
          })
        : await updateSubtask(subtaskId, {
            title: currentSubtask.title.trim() || currentSubtask.title,
            status: nextStatus,
            priority: currentSubtask.priority,
          });

      const persistedSubtasks = nextSubtasks.map((item) =>
        item.id === subtaskId ? persistedSubtask : item
      );

      setTaskSubtasks(persistedSubtasks);
      emitTaskUpdate(persistedSubtasks);
    } finally {
      setSavingSubtaskId(null);
    }
  };

  const handleSubtaskPriorityChange = async (subtaskId: string, nextPriority: Priority) => {
    const currentSubtask = taskSubtasks.find((item) => item.id === subtaskId);
    if (!currentSubtask) return;

    const nextSubtasks = taskSubtasks.map((item) =>
      item.id === subtaskId
        ? {
            ...item,
            priority: nextPriority,
          }
        : item
    );

    setTaskSubtasks(nextSubtasks);

    if (currentSubtask.isDraft && !currentSubtask.title.trim()) {
      return;
    }

    try {
      setSavingSubtaskId(subtaskId);

      const persistedSubtask = currentSubtask.isDraft
        ? await createSubtask({
            title: currentSubtask.title.trim(),
            status: currentSubtask.status,
            priority: nextPriority,
            taskId: task.id,
          })
        : await updateSubtask(subtaskId, {
            title: currentSubtask.title.trim() || currentSubtask.title,
            status: currentSubtask.status,
            priority: nextPriority,
          });

      const persistedSubtasks = nextSubtasks.map((item) =>
        item.id === subtaskId ? persistedSubtask : item
      );

      setTaskSubtasks(persistedSubtasks);
      emitTaskUpdate(persistedSubtasks);
    } finally {
      setSavingSubtaskId(null);
    }
  };

  const handleDeleteSubtask = async (subtaskId: string) => {
    if (deletingSubtaskId) return;

    const currentSubtask = taskSubtasks.find((item) => item.id === subtaskId);
    if (!currentSubtask) return;

    if (currentSubtask.isDraft) {
      setTaskSubtasks((currentSubtasks) =>
        currentSubtasks.filter((item) => item.id !== subtaskId)
      );
      return;
    }

    try {
      setDeletingSubtaskId(subtaskId);
      await deleteSubtask(subtaskId);

      const nextSubtasks = taskSubtasks.filter((item) => item.id !== subtaskId);
      setTaskSubtasks(nextSubtasks);
      emitTaskUpdate(nextSubtasks);
    } finally {
      setDeletingSubtaskId(null);
    }
  };

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      await deleteTask(task.id);
      setIsDeleteOpen(false);
      onClose();
      onDeleted?.(task.id);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <div
        onClick={onClose}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
      >
        <div
          onClick={(event) => event.stopPropagation()}
          className="relative w-[92%] max-w-2xl rounded-3xl bg-white p-8"
        >
          <div className="mb-4 flex items-start justify-between gap-4">
            <input
              type="text"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              onBlur={() => void persistTask()}
              className="w-full border-none bg-transparent text-3xl font-bold outline-none"
              placeholder="Task title"
              disabled={isSavingTask}
            />

            <div className="flex items-center gap-3">
              <select
                value={status}
                onChange={(event) => {
                  const nextStatus = event.target.value as Status;
                  setStatus(nextStatus);
                  void persistTask({ status: nextStatus });
                }}
                className={badgeSelectClass(getStatusClasses(status))}
                disabled={isSavingTask}
              >
                {STATUS_OPTIONS.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>

              <select
                value={priority}
                onChange={(event) => {
                  const nextPriority = event.target.value as Priority;
                  setPriority(nextPriority);
                  void persistTask({ priority: nextPriority });
                }}
                className={badgeSelectClass(getPriorityClasses(priority))}
                disabled={isSavingTask}
              >
                {PRIORITY_OPTIONS.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="mb-8">
            <textarea
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              onBlur={() => void persistTask()}
              rows={5}
              className="min-h-[120px] w-full resize-none rounded-3xl border p-6 outline-none"
              placeholder="Add a description"
              disabled={isSavingTask}
            />

            <p className="mt-2 text-sm text-zinc-500">
              {isSavingTask ? "Saving task..." : "Changes are saved automatically."}
            </p>
          </div>

          <div className="mb-8 rounded-3xl border p-6">
            <div className="mb-6 flex items-center justify-between">
              <h3 className="text-xl font-semibold">Subtasks</h3>

              <button
                type="button"
                onClick={handleAddSubtask}
                className="flex h-10 w-10 items-center justify-center rounded-full border"
              >
                +
              </button>
            </div>

            <div className="space-y-3">
              {taskSubtasks.map((subtask) => (
                <div
                  key={subtask.id}
                  className="flex items-start justify-between gap-4 border-b pb-3"
                >
                  <div className="flex-1">
                    <input
                      type="text"
                      value={subtask.title}
                      onChange={(event) => {
                        const nextTitle = event.target.value;
                        updateLocalSubtask(subtask.id, (currentSubtask) => ({
                          ...currentSubtask,
                          title: nextTitle,
                        }));
                      }}
                      onBlur={() => void persistSubtask(subtask.id)}
                      className="mb-2 w-full border-none bg-transparent font-medium outline-none"
                      disabled={savingSubtaskId === subtask.id || deletingSubtaskId === subtask.id}
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <select
                      value={subtask.status}
                      onChange={(event) => void handleSubtaskStatusChange(subtask.id, event.target.value as Status)}
                      className={badgeSelectClass(getStatusClasses(subtask.status))}
                      disabled={savingSubtaskId === subtask.id || deletingSubtaskId === subtask.id}
                    >
                      {STATUS_OPTIONS.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>

                    <select
                      value={subtask.priority}
                      onChange={(event) => void handleSubtaskPriorityChange(subtask.id, event.target.value as Priority)}
                      className={badgeSelectClass(getPriorityClasses(subtask.priority))}
                      disabled={savingSubtaskId === subtask.id || deletingSubtaskId === subtask.id}
                    >
                      {PRIORITY_OPTIONS.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>

                    <button
                      type="button"
                      onClick={() => void handleDeleteSubtask(subtask.id)}
                      className="rounded-full border border-red-300 px-3 py-1.5 text-sm text-red-600 disabled:opacity-60"
                      disabled={savingSubtaskId === subtask.id || deletingSubtaskId === subtask.id}
                    >
                      {deletingSubtaskId === subtask.id ? "Deleting..." : "Delete"}
                    </button>
                  </div>
                </div>
              ))}

              {taskSubtasks.length === 0 && (
                <p className="text-sm text-zinc-500">No subtasks yet.</p>
              )}
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => setIsDeleteOpen(true)}
              className="rounded-full border border-red-300 px-6 py-3 text-red-600"
            >
              Delete
            </button>
          </div>
        </div>
        
      </div>

      <DeleteModal
        isOpen={isDeleteOpen}
        title="Delete Task"
        message="Are you sure you want to delete this task? This action cannot be undone."
        confirmLabel="Delete task"
        isSubmitting={isDeleting}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleDelete}
      />
    </>
  );
}
