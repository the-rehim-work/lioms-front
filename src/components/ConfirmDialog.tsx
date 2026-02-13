import Modal from "./Modal";

interface ConfirmDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  loading?: boolean;
  title?: string;
  message?: string;
}

export default function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  loading,
  title = "Silmə təsdiqi",
  message = "Bu əməliyyatı geri qaytarmaq mümkün olmayacaq. Davam etmək istəyirsiniz?",
}: ConfirmDialogProps) {
  return (
    <Modal open={open} onClose={onClose} title={title}>
      <p className="mb-6 text-sm text-gray-600 dark:text-gray-400">{message}</p>
      <div className="flex justify-end gap-3">
        <button
          onClick={onClose}
          className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
        >
          Ləğv et
        </button>
        <button
          onClick={onConfirm}
          disabled={loading}
          className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50"
        >
          {loading ? "Silinir..." : "Sil"}
        </button>
      </div>
    </Modal>
  );
}