import React, { useRef } from "react";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

export default function ImageUploader({ images = [], setImages }) {
  const fileInputRef = useRef();

  function handleSelectFiles(e) {
    const files = Array.from(e.target.files);

    e.target.value = ""; // prevent double firing on same file

    setImages([...images, ...files]);
  }

  function handleRemove(index) {
    const updated = images.filter((_, i) => i !== index);
    setImages(updated);
  }

  return (
    <div className="space-y-3">
      <Button
        type="button"
        variant="outline"
        className="w-full justify-start"
        onClick={() => fileInputRef.current.click()}
      >
        + Add Images
      </Button>

      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        multiple
        accept="image/*"
        onChange={handleSelectFiles}
      />

      {images.length > 0 && (
        <div className="grid grid-cols-3 gap-4">
          {images.map((file, index) => (
            <div
              key={file.name + index}
              className="relative w-28 h-28 rounded-md overflow-hidden border bg-gray-100"
            >
              <img
                src={URL.createObjectURL(file)}
                className="w-full h-full object-cover"
              />
              <button
                onClick={() => handleRemove(index)}
                className="absolute top-1 right-1 bg-white p-1 rounded-full shadow"
              >
                <X size={14} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
