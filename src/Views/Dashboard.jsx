import React, { useEffect, useState } from "react";
import { UserAuth } from "../Context/AuthContext.jsx";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient.js";
import { handleDelete, handleUpload } from "../utils/ImageStorageUtils.js";

function Dashboard() {
  const [fileNames, setFilenames] = useState("No files...");
  const [files, setFiles] = useState([]);
  const [uploadedImages, setUploadedImages] = useState([]);
  const { session, signOut } = UserAuth();
  const navigate = useNavigate();
  const handleSignOut = async (e) => {
    e.preventDefault();
    try {
      await signOut();
      navigate("/");
    } catch (err) {
      console.log(err);
    }
  };

  const handleFileChange = (e) => {
    const selectedFiles = e.target.files;
    if (selectedFiles.length > 0) {
      setFiles(selectedFiles);
      const fileCount = selectedFiles.length;
      const output = fileCount === 1 ? fileCount + " file" : fileCount + " files";

      setFilenames(output);
    } else {
      setFiles([]);
      setFilenames("No files...");
    }
  };

  useEffect(() => {
    const fetchImages = async () => {
      try {
        // Lister les fichiers dans le dossier de l'utilisateur
        const { data, error } = await supabase.storage.from("userImageStorage").list(`${session.user.id}/`, { limit: 50, offset: 0 });

        // Gérer les erreurs lors de la récupération
        if (error) {
          console.error("Erreur lors de la récupération des images :", error.message);
          return;
        }

        // Vérifier si des fichiers ont été trouvés
        if (!data || data.length === 0) {
          console.log("Aucun fichier trouvé pour cet utilisateur.");
          setUploadedImages([]); // Réinitialiser les images
          return;
        }

        // Récupérer les URLs publiques pour les fichiers trouvés
        const urls = data.map((file) => {
          const { data: publicUrlData, error: urlError } = supabase.storage.from("userImageStorage").getPublicUrl(`${session.user.id}/${file.name}`);

          if (urlError) {
            console.error("Erreur lors de la récupération de l'URL publique :", urlError.message);
            return null; // Ignorer cette URL si une erreur survient
          }
          console.log(publicUrlData.publicUrl);
          return publicUrlData.publicUrl;
        });

        // Mettre à jour l'état des images
        setUploadedImages(urls.filter((url) => url));
      } catch (err) {
        console.error("Une erreur s'est produite lors du fetch des images :", err);
      }
    };

    fetchImages(); // Appeler la fonction lors du chargement du composant
  }, [session.user.id]);

  const deleteImage = async (filePath) => {
    console.log("Tentative de suppression du fichier :", filePath);
    const success = await handleDelete(filePath);
    if (success) {
      setUploadedImages((prev) => {
        const updatedImages = prev.filter((url) => {
          // Reconstruire le chemin complet à partir de l'URL publique
          const extractedFilePath = `${session.user.id}/${decodeURIComponent(url.split(`${session.user.id}/`)[1])}`;
          console.log("Comparaison :", extractedFilePath, filePath); // Debugging
          return extractedFilePath !== filePath;
        });
        console.log("Images mises à jour :", updatedImages); // Debugging
        return [...updatedImages];
      });
    } else {
      console.log("Erreur lors de la suppression de l'image");
    }
  };
  const uploadImages = async () => {
    try {
      const uploadUrls = await handleUpload(files, session.user.id);
      setUploadedImages((prev) => [...prev, ...uploadUrls]);
    } catch (err) {
      console.error("Error during file upload", err.message);
    }
  };

  return (
    <div className="max-w-7xl m-auto py-5">
      <div>
        <h3 className="text-2xl">
          Welcome <span className="text-slate-500 ">{session?.user?.email}</span>{" "}
        </h3>
        <p onClick={handleSignOut} className="hover:cursor-pointer border inline-block p-4 mt-4">
          Sign out
        </p>
        <div className="flex gap-5 justify-center">
          <div className="flex flex-col justify-center items-center gap-5">
            <label htmlFor="fileInput" className="custom-file-label">
              Choose files
            </label>
            <span className=".file-chosen"> {fileNames} </span>
            <input id="fileInput" className="hidden" type="file" accept=".jpg, .jpeg, .png" multiple onChange={handleFileChange} />
          </div>

          <button onClick={uploadImages} className="border p-4 bg-slate-700">
            Upload Images
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
          {uploadedImages.map((url, index) => {
            // Extraire le chemin du fichier à partir de l'URL publique
            const decodedFilePath = decodeURIComponent(url.split(`${session.user.id}/`)[1]);

            return (
              <div key={index} className="relative">
                <img className="w-full h-80 object-cover" src={url} alt={`Uploaded ${index}`} />
                <button onClick={() => deleteImage(`${session.user.id}/${decodedFilePath}`)} className="absolute top-2 right-2 bg-slate-700 p-2">
                  Delete
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
