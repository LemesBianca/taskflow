"use client";

type Props = {
  isOpen: boolean;
  title?: string;
  message?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  isSubmitting?: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void> | void;
};

export default function DeleteModal({
  isOpen,
  title = "Delete item",
  message = "This action cannot be undone.",
  confirmLabel = "Delete",
  cancelLabel = "Cancel",
  isSubmitting = false,
  onClose,
  onConfirm,
}: Props) {
  if (!isOpen) return null;

  const handleConfirm = async () => {
    if (isSubmitting) return;
    await onConfirm();
  };

  return (
    <div
      onClick={isSubmitting ? undefined : onClose}
      className="fixed inset-0 z-[70] flex items-center justify-center bg-black/45"
    >
      <div
        onClick={(event) => event.stopPropagation()}
        className="w-[92%] max-w-md rounded-3xl bg-white p-8"
      >
        <h3 className="mb-3 text-2xl font-bold">{title}</h3>
        <p className="mb-8 text-zinc-600">{message}</p>

        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="rounded-full border px-5 py-2.5 disabled:opacity-60"
          >
            {cancelLabel}
          </button>

          <button
            type="button"
            onClick={handleConfirm}
            disabled={isSubmitting}
            className="rounded-full bg-red-600 px-5 py-2.5 text-white disabled:opacity-60"
          >
            {isSubmitting ? "Deleting..." : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
