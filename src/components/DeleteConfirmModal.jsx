import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

export default function DeleteConfirmModal({
  open,
  onClose,
  onConfirm,
  isDeleting,
  title = "Delete Item",
  message,
  itemName,
}) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md p-6 rounded-lg shadow-xl">
        <DialogHeader className="flex justify-between items-center">
          <DialogTitle className="text-2xl font-semibold">{title}</DialogTitle>
        </DialogHeader>

        <div className="mt-4 text-center text-gray-700">
          <p>
            {message} <strong>{itemName}</strong>?
          </p>
        </div>

        <div className="flex justify-center gap-3 mt-6">
          <Button
            className="bg-red-600 hover:bg-red-700 text-white"
            onClick={onConfirm}
            disabled={isDeleting}
          >
            {isDeleting ? (
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Deleting...
              </div>
            ) : (
              "Yes, Delete"
            )}
          </Button>

          <Button variant="secondary" className="bg-gray-300" onClick={onClose}>
            Cancel
          </Button>
        </div>
      </DialogContent>
    </Dialog>

  );
}
