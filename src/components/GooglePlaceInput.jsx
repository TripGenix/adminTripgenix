import { useEffect, useRef } from "react";

export default function GooglePlaceInput({
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
        flex h-10 w-full rounded-md border border-input
        bg-background px-3 py-2 text-sm
        ring-offset-background
        placeholder:text-muted-foreground
        focus-visible:outline-none
        focus-visible:ring-2
        focus-visible:ring-ring
        focus-visible:ring-offset-2
        disabled:cursor-not-allowed
        disabled:opacity-50
      "
    />
  );
}
