"use client";

import { FormEvent, useMemo, useState } from "react";

type Status = "TODO" | "IN_PROGRESS" | "DONE";
type Priority = "LOW" | "MEDIUM" | "HIGH";

type EditTaskInput = {
  title: string;
  description: string;
  status: Status;
  priority: Priority;
};

type TaskSnapshot = {
  title: string;
  description?: string;
  status: Status;
  priority: Priority;
};

type Props = {
  isOpen: boolean;
  task: TaskSnapshot;
  onClose: () => void;
  onSubmit: (task: EditTaskInput) => Promise<void> | void;
};

const STATUS_OPTIONS: Status[] = ["TODO", "IN_PROGRESS", "DONE"];
const PRIORITY_OPTIONS: Priority[] = ["LOW", "MEDIUM", "HIGH"];

export default function EditTaskModal({
  isOpen,
  task,
  onClose,
  onSubmit,
}: Props) {
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description ?? "");
  const [status, setStatus] = useState<Status>(task.status);
  const [priority, setPriority] = useState<Priority>(task.priority);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const canSubmit = useMemo(() => {
    return Boolean(title.trim()) && !isSubmitting;
  }, [isSubmitting, title]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!canSubmit) return;

    try {
      setIsSubmitting(true);
      await onSubmit({
        title: title.trim(),
        description: description.trim(),
        status,
        priority,
      });
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      onClick={isSubmitting ? undefined : onClose}
      className="fixed inset-0 z-[70] flex items-center justify-center bg-black/45"
    >
      <div
        onClick={(event) => event.stopPropagation()}
        className="relative w-[92%] max-w-2xl rounded-3xl bg-white p-8"
      >
        <h2 className="mb-2 text-3xl font-bold">Edit Task</h2>
        <p className="mb-8 text-zinc-500">Update the task details below.</p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <label htmlFor="edit-task-title" className="block text-sm font-medium">
              Title
            </label>
            <input
              id="edit-task-title"
              type="text"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              className="w-full rounded-2xl border px-4 py-3 outline-none"
              required
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="edit-task-description" className="block text-sm font-medium">
              Description
            </label>
            <textarea
              id="edit-task-description"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              rows={4}
              className="w-full resize-none rounded-2xl border px-4 py-3 outline-none"
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label htmlFor="edit-task-status" className="block text-sm font-medium">
                Status
              </label>
              <select
                id="edit-task-status"
                value={status}
                onChange={(event) => setStatus(event.target.value as Status)}
                className="w-full rounded-2xl border px-4 py-3 outline-none"
              >
                {STATUS_OPTIONS.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label htmlFor="edit-task-priority" className="block text-sm font-medium">
                Priority
              </label>
              <select
                id="edit-task-priority"
                value={priority}
                onChange={(event) => setPriority(event.target.value as Priority)}
                className="w-full rounded-2xl border px-4 py-3 outline-none"
              >
                {PRIORITY_OPTIONS.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-full border px-5 py-2.5"
              disabled={isSubmitting}
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={!canSubmit}
              className="rounded-full bg-black px-5 py-2.5 text-white disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
