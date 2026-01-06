import { useEffect, useRef } from "react";

export default function GooglePlaceInput({
  label,
  value,
  onChange,
  placeholder = "Enter location",
}) {
  const inputRef = useRef(null);

  useEffect(() => {
    if (!window.google || !window.google.maps) return;

    const autocomplete = new window.google.maps.places.Autocomplete(
      inputRef.current,
      {
        componentRestrictions: { country: "lk" },
      }
    );

    autocomplete.addListener("place_changed", () => {
      const place = autocomplete.getPlace();
      if (!place.geometry) return;

      onChange({
        location: place.formatted_address,
        latitude: place.geometry.location.lat(),
        longitude: place.geometry.location.lng(),
      });
    });
  }, []);

  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label className="text-gray-900 text-[15px] font-medium">
          {label}
        </label>
      )}

      <input
        ref={inputRef}
        type="text"
        value={value || ""}
        placeholder={placeholder}

        onChange={(e) =>
          onChange({
            location: e.target.value,
            latitude: null,
            longitude: null,
          })
        }

        className="
          w-full bg-white text-gray-700
          border border-gray-300
          rounded-md px-4 py-3
          focus:outline-none focus:border-gray-400
          placeholder:text-gray-400
          shadow-sm
        "
      />
    </div>
  );
}
