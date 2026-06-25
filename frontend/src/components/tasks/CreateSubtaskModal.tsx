"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createSubtask } from "@/services/subtaskService";

type Props = {
  taskId: string;
  isOpen: boolean;
  onClose: () => void;
};

export default function CreateSubtaskModal({
  taskId,
  isOpen,
  onClose,
}: Props) {

  const router = useRouter();
  const [title, setTitle] = useState("");
  const [status, setStatus] = useState("TODO");
  const [priority, setPriority] = useState("MEDIUM");

  async function handleSubmit() {

    await createSubtask({
      title,
      status,
      priority,
      taskId,
    });

    setTitle("");
    setStatus("TODO");
    setPriority("MEDIUM");

    onClose();

    router.refresh();
  }

  if (!isOpen) return null;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
    >

      <div
        onClick={(event) => event.stopPropagation()}
        className="relative w-[90%] max-w-xl rounded-3xl bg-white p-8"
      >

        <h1 className="text-3xl font-bold mb-8">
          Create Subtask
        </h1>

        {/* Title */}
        <div className="mb-6">

          <label className="font-semibold">
            Title
          </label>

          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border rounded-2xl p-4 mt-2"
          />

        </div>

        {/* Status */}
        <div className="mb-6">

          <label className="font-semibold">
            Status
          </label>

          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full border rounded-2xl p-4 mt-2"
          >
            <option value="TODO">Todo</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="DONE">Done</option>
          </select>

        </div>

        {/* Priority */}
        <div className="mb-8">

          <label className="font-semibold">
            Priority
          </label>

          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            className="w-full border rounded-2xl p-4 mt-2"
          >
            <option value="LOW">Low</option>
            <option value="MEDIUM">Medium</option>
            <option value="HIGH">High</option>
          </select>

        </div>

        <div className="flex justify-end gap-4">

          <button
            onClick={onClose}
            className="px-6 py-3 border rounded-full"
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            className="px-6 py-3 rounded-full bg-black text-white"
          >
            Create
          </button>

        </div>

      </div>

    </div>
  );
}