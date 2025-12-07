export default function DeleteConfirmModal({ open, onCancel, onConfirm }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <div className="bg-white w-full max-w-md p-6 rounded-2xl shadow-xl">

        <h2 className="text-xl font-bold text-red-700 mb-2">
          Delete Account?
        </h2>

        <p className="text-gray-700 mb-6">
          Are you sure you want to delete your account?
        </p>

        <div className="flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-100"
          >
            Cancel
          </button>

          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 shadow"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
