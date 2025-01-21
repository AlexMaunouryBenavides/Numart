import { supabase } from "../supabaseClient.js";

export const handleDelete = async (filePath) => {
  try {
    const { error } = await supabase.storage.from("userImageStorage").remove([filePath]);
    if (error) {
      console.error("Erreur lors de la suppression de l'image :", error.message);
      return false;
    }
    console.log(`Fichier supprimé : `, filePath);
    return true;
  } catch (err) {
    console.error("Une erreur s'est produite lors de la suppression :", err);
    return false;
  }
};

export const handleUpload = async (files, userId) => {
  if (files.length === 0) {
    alert("Insert an image");
    return;
  }

  const uploads = Array.from(files).map(async (file) => {
    const filePath = `${userId}/${Date.now()}-${file.name}`;

    const { error } = await supabase.storage.from("userImageStorage").upload(filePath, file);
    if (error) {
      console.error("Error when uploading", error.message);
      return null;
    }
    const { data: publicUrlData, error: urlError } = supabase.storage.from("userImageStorage").getPublicUrl(filePath);
    if (urlError) {
      console.error("Error getting public URL:", urlError.message);
      return null;
    }

    return publicUrlData.publicUrl;
  });
  const uploadedUrls = await Promise.all(uploads);
  return uploadedUrls.filter((url) => url);
};
