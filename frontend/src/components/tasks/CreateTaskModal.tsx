"use client";

import { FormEvent, useMemo, useState } from "react";

type Status = "TODO" | "IN_PROGRESS" | "DONE";
type Priority = "LOW" | "MEDIUM" | "HIGH";

type ProjectOption = {
  id: string;
  name: string;
};

type SubtaskInput = {
  title: string;
  status: Status;
  priority: Priority;
};

type DraftSubtask = SubtaskInput & {
  id: string;
};

type CreateTaskInput = {
  title: string;
  description: string;
  status: Status;
  priority: Priority;
  projectId: string;
  subtasks: SubtaskInput[];
};

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: (task: CreateTaskInput) => Promise<void> | void;
  projects?: ProjectOption[];
  defaultProjectId?: string;
};

const STATUS_OPTIONS: Status[] = ["TODO", "IN_PROGRESS", "DONE"];
const PRIORITY_OPTIONS: Priority[] = ["LOW", "MEDIUM", "HIGH"];

export default function CreateTaskModal({
  isOpen,
  onClose,
  onSubmit,
  projects = [],
  defaultProjectId,
}: Props) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<Status>("TODO");
  const [priority, setPriority] = useState<Priority>("MEDIUM");
  const [projectId, setProjectId] = useState("");
  const [subtasks, setSubtasks] = useState<DraftSubtask[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const resolvedProjectId = projectId || defaultProjectId || "";

  const canSubmit = useMemo(() => {
    if (!title.trim()) return false;
    if (projects.length > 0 && !resolvedProjectId) return false;
    return true;
  }, [projects.length, resolvedProjectId, title]);

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setStatus("TODO");
    setPriority("MEDIUM");
    setProjectId("");
    setSubtasks([]);
  };

  const handleAddSubtask = () => {
    setSubtasks((currentSubtasks) => [
      ...currentSubtasks,
      {
        id: `draft-${Date.now()}-${currentSubtasks.length}`,
        title: "",
        status: "TODO",
        priority: "MEDIUM",
      },
    ]);
  };

  const handleDeleteSubtask = (subtaskId: string) => {
    setSubtasks((currentSubtasks) =>
      currentSubtasks.filter((subtask) => subtask.id !== subtaskId)
    );
  };

  const updateSubtask = (
    subtaskId: string,
    patch: Partial<DraftSubtask>
  ) => {
    setSubtasks((currentSubtasks) =>
      currentSubtasks.map((subtask) =>
        subtask.id === subtaskId
          ? {
              ...subtask,
              ...patch,
            }
          : subtask
      )
    );
  };

  const handleClose = () => {
    if (isSubmitting) return;
    resetForm();
    onClose();
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!canSubmit || isSubmitting) return;

    try {
      setIsSubmitting(true);
      await onSubmit?.({
        title: title.trim(),
        description: description.trim(),
        status,
        priority,
        projectId: resolvedProjectId,
        subtasks: subtasks
          .filter((subtask) => subtask.title.trim())
          .map((subtask) => ({
            title: subtask.title.trim(),
            status: subtask.status,
            priority: subtask.priority,
          })),
      });
      handleClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      onClick={handleClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
    >
      <div
        onClick={(event) => event.stopPropagation()}
        className="relative w-[92%] max-w-2xl rounded-3xl bg-white p-8"
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex items-start justify-between gap-3">
            <label htmlFor="create-task-title" className="sr-only">
              Task title
            </label>

            <input
              id="create-task-title"
              type="text"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="Task title"
              className="w-full border-none bg-transparent text-3xl font-bold outline-none"
              required
            />

            <div className="flex items-center gap-3">
              <label htmlFor="create-task-status" className="sr-only">
                Status
              </label>

              <select
                id="create-task-status"
                value={status}
                onChange={(event) => setStatus(event.target.value as Status)}
                className="rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-sm font-medium text-blue-700 outline-none"
              >
                {STATUS_OPTIONS.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>

              <label htmlFor="create-task-priority" className="sr-only">
                Priority
              </label>

              <select
                id="create-task-priority"
                value={priority}
                onChange={(event) => setPriority(event.target.value as Priority)}
                className="rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-sm font-medium text-amber-700 outline-none"
              >
                {PRIORITY_OPTIONS.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="create-task-description" className="sr-only">
              Description
            </label>

            <textarea
              id="create-task-description"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="Add a description"
              rows={5}
              className="min-h-[120px] w-full resize-none rounded-3xl border p-6 outline-none"
            />
          </div>

          <div className="space-y-4 rounded-3xl border p-5">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold">Subtasks</h3>
                <p className="text-sm text-zinc-500">Optional subtasks for this task.</p>
              </div>

              <button
                type="button"
                onClick={handleAddSubtask}
                className="flex h-10 w-10 items-center justify-center rounded-full border"
              >
                +
              </button>
            </div>

            <div className="space-y-3">
              {subtasks.map((subtask) => (
                <div
                  key={subtask.id}
                  className="flex items-start justify-between gap-4 border-b pb-3"
                >
                  <div className="flex-1">
                    <input
                      type="text"
                      value={subtask.title}
                      onChange={(event) =>
                        updateSubtask(subtask.id, {
                          title: event.target.value,
                        })
                      }
                      placeholder="Subtask title"
                      className="mb-2 w-full border-none bg-transparent font-medium outline-none"
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <select
                      value={subtask.status}
                      onChange={(event) =>
                        updateSubtask(subtask.id, {
                          status: event.target.value as Status,
                        })
                      }
                      className="rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-sm font-medium text-blue-700 outline-none"
                    >
                      {STATUS_OPTIONS.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>

                    <select
                      value={subtask.priority}
                      onChange={(event) =>
                        updateSubtask(subtask.id, {
                          priority: event.target.value as Priority,
                        })
                      }
                      className="rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-sm font-medium text-blue-700 outline-none"
                    >
                      {PRIORITY_OPTIONS.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>

                    <button
                      type="button"
                      onClick={() => handleDeleteSubtask(subtask.id)}
                      className="rounded-full border border-red-300 px-3 py-1.5 text-sm text-red-600"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}

              {subtasks.length === 0 && (
                <p className="text-sm text-zinc-500">No subtasks added yet.</p>
              )}
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <div className="min-w-[220px] flex-1 max-w-xs">
              <label htmlFor="create-task-project" className="sr-only">
                Project
              </label>

              <select
                id="create-task-project"
                value={resolvedProjectId}
                onChange={(event) => setProjectId(event.target.value)}
                className="w-full rounded-full border px-4 py-2.5 outline-none disabled:opacity-60"
                disabled={projects.length === 0}
              >
                <option value="">
                  {projects.length > 0 ? "Select project" : "No projects yet"}
                </option>
                {projects.map((project) => (
                  <option key={project.id} value={project.id}>
                    {project.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleClose}
                className="rounded-full border px-5 py-2.5"
                disabled={isSubmitting}
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={!canSubmit || isSubmitting}
                className="rounded-full bg-black px-5 py-2.5 text-white disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSubmitting ? "Saving..." : "Create Task"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
