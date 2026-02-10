import { useState } from "react";
import { FiTrash2, FiPlus } from "react-icons/fi";
import GooglePlaceInput from "./GooglePlaceInput";

export default function DynamicList({
  title = "Add Destination",
  destinations,
  setDestinations,
}) {
  const [newItem, setNewItem] = useState({
    location: "",
    latitude: null,
    longitude: null,
  });

  const addItem = () => {
    if (!newItem.location.trim()) return;

    setDestinations([...destinations, newItem]);

    setNewItem({
      location: "",
      latitude: null,
      longitude: null,
    });
  };

  const removeItem = (index) => {
    setDestinations(destinations.filter((_, i) => i !== index));
  };

  return (
    <div className="flex flex-col">

      {/* TITLE */}
      <label className="text-gray-900 text-[15px] font-medium">
        {title}
      </label>

      {/* INPUT SECTION */}
      <div className="sticky top-0 z-10 flex items-center gap-3 pb-2">
        <GooglePlaceInput
          value={newItem.location}   // ✅ STRING ONLY
          onChange={(val) => {
            // val is OBJECT from GooglePlaceInput
            setNewItem({
              location: val.location || "",
              latitude: val.latitude ?? null,
              longitude: val.longitude ?? null,
            });
          }}
          placeholder="Enter location"
        />

        <button
          type="button"
          onClick={addItem}
          className="bg-[#0F3B45] text-white px-4 py-2 rounded-sm flex items-center gap-2 hover:bg-[#0c2e36]"
        >
          Add <FiPlus />
        </button>
      </div>

      {/* DESTINATION LIST */}
      <div className="space-y-3 pr-1">
        {destinations.map((item, index) => (
          <div
            key={index}
            className="flex justify-between items-center border px-4 py-1 rounded-sm text-gray-800"
          >
            <span className="truncate">
              {item.location}
            </span>

            <FiTrash2
              className="text-red-500 cursor-pointer hover:text-red-600"
              onClick={() => removeItem(index)}
            />
          </div>
        ))}

        {destinations.length === 0 && (
          <p className="text-sm text-gray-400 text-center">
            No destinations added
          </p>
        )}
      </div>
    </div>
  );
}
