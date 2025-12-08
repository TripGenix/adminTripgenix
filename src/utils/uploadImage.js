// /utils/uploadImage.js
import supabase from "@/lib/supabaseClient";

export default async function uploadToSupabase(file, folder) {
  if (!file) return null;

  const fileName = `${folder}/${Date.now()}-${file.name}`;

  const { data, error } = await supabase.storage
    .from("images")
    .upload(fileName, file);

  if (error) {
    console.error("Upload error:", error);
    return null;
  }

  const { data: urlData } = supabase.storage
    .from("images")
    .getPublicUrl(fileName);

  return urlData.publicUrl;
}
