import Button from "./Button2";

export default function ConfirmationModal({ open, title, message, onCancel, onConfirm }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-xl max-w-sm w-full">
        <h3 className="text-lg font-bold">{title}</h3>
        <p className="mt-2">{message}</p>

        <div className="flex justify-end gap-3 mt-4">
          <Button variant="secondary" onClick={onCancel}>Cancel</Button>
          <Button variant="danger" onClick={onConfirm}>Delete</Button>
        </div>
      </div>
    </div>
  );
}
