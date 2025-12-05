import { supabase } from "@/lib/supabaseClient";

// Upload multiple images to supabase and return array of URLs
export async function uploadVehicleImages(vehicleNumber, images = []) {
  if (!images || images.length === 0) return [];

  const uploadedUrls = [];

  const folder = `vehicles/${vehicleNumber}/`;

  for (let image of images) {
    const uniqueName = `${Date.now()}-${image.name}`;
    const filePath = folder + uniqueName;

    // Upload file
    const { error } = await supabase.storage
      .from("vehicle_bucket") // <-- your bucket name
      .upload(filePath, image);

    if (error) {
      console.error("Upload error:", error);
      continue;
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from("vehicle_bucket")
      .getPublicUrl(filePath);

    uploadedUrls.push(urlData.publicUrl);
  }

  return uploadedUrls;
}
