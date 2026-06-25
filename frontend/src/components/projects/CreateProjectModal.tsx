"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createProject } from "@/services/projectService";

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

export default function CreateProjectModal({
  isOpen,
  onClose,
}: Props) {

  const router = useRouter();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  async function handleSubmit() {

    if (!name.trim()) return;

    await createProject({
      name,
      description,
    });

    setName("");
    setDescription("");

    onClose();

    router.refresh();
  }

  if (!isOpen) return null;

  return (
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
          rounded-3xl
          p-8
          w-[90%]
          max-w-2xl
          relative
        "
      >

        <h1 className="text-4xl font-bold mb-8">
          Create Project
        </h1>


        {/* Nome */}
        <div className="mb-6">

          <label className="font-semibold">
            Name
          </label>

          <input
            type="text"
            value={name}
            onChange={(e) =>
              setName(e.target.value)
            }
            className="
              w-full
              border
              rounded-2xl
              p-4
              mt-2
            "
          />

        </div>


        {/* Descrição */}
        <div className="mb-8">

          <label className="font-semibold">
            Description
          </label>

          <textarea
            value={description}
            onChange={(e) =>
              setDescription(e.target.value)
            }
            rows={5}
            className="
              w-full
              border
              rounded-2xl
              p-4
              mt-2
              resize-none
            "
          />

        </div>


        {/* Botões */}
        <div className="flex justify-end gap-4">

          <button
            onClick={onClose}
            className="
              px-6 py-3
              border
              rounded-full
            "
          >
            Cancel
          </button>


          <button
            onClick={handleSubmit}
            className="
              px-6 py-3
              rounded-full
              bg-black
              text-white
              hover:opacity-80
            "
          >
            Create
          </button>

        </div>

      </div>

    </div>
  );
}