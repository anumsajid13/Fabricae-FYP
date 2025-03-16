import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";
import { ref, deleteObject } from "firebase/storage";
import { storage } from "../../firebase"; 
import DeleteConfirmationModal from "../ui/delete-modal";

const ImageGalleryPopup = ({ isOpen, onClose, username }) => {
  const [images, setImages] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [sortOrder, setSortOrder] = useState("latest");
  const [deleteModal, setDeleteModal] = useState(false);
  const [imageToDelete, setImageToDelete] = useState(null);
  

  useEffect(() => {
    if (!isOpen) return;

    const fetchImages = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/api/prompt-designs/retrieve-by-username-and-patternType/${username}/edited-pattern`
        );
        if (!response.ok) throw new Error("Failed to fetch images");
        const data = await response.json();

        setImages(
          data.sort((a, b) =>
            sortOrder === "latest"
              ? new Date(b.creationDate) - new Date(a.creationDate)
              : new Date(a.creationDate) - new Date(b.creationDate)
          )
        );
      } catch (error) {
        console.error("Error fetching images:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchImages();
  }, [isOpen, username, sortOrder]);

  // 🔹 Handle Delete Click (Opens Confirmation Modal)
  const confirmDelete = (title, imageUrl) => {
    setImageToDelete({ title, imageUrl });
    setDeleteModal(true);
  };

  // 🔹 Function to handle deletion from Firebase Storage & MongoDB
  const handleDelete = async () => {
    if (!imageToDelete) return;
    const { title, imageUrl } = imageToDelete;
    setDeleteModal(false);

    try {
      // 🔥 Remove from UI Instantly
      setImages((prevImages) => prevImages.filter((img) => img.title !== title));

      // 🔥 Delete from MongoDB
      const res = await fetch("http://localhost:5000/api/prompt-designs/delete", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title }),
      });

      if (!res.ok) {
        throw new Error("Failed to delete from database.");
      }

      // 🔥 Delete from Firebase Storage
      const storageRef = ref(storage, imageUrl);
      await deleteObject(storageRef);
      console.log("✅ Deleted from Firebase Storage");

      toast.success("Image deleted successfully!");
    } catch (error) {
      console.error("❌ Error deleting image:", error);
      toast.error("Error deleting the image.");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-60 backdrop-blur-md flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-4/5 max-w-4xl h-[520px] flex flex-col border border-gray-300">
      {/* bg-[#fffefe5e]  */}
        {/* 🔹 Navbar */}
        <div className="bg-white border-b-3 border-[#cf5069]  px-4 py-3 rounded-t-lg shadow-sm flex justify-between items-center">
          <h2 className="text-xl font-bold text-[#9e4557]">MY EDITS</h2>
          <button onClick={onClose} className="text-gray-600 text-lg">✖</button>
        </div>

        {/* 🔹 Sort Button (Positioned below the navbar, aligned to the right) */}
        <div className="flex justify-end px-4 py-2">
          <button onClick={() => setSortOrder(sortOrder === "latest" ? "oldest" : "latest")}>
            <img src="/sort (2).png" alt="Sort" className="w-12 h-12 cursor-pointer" />
          </button>
        </div>

        {/* 🔹 Scrollable Image Gallery */}
        <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
          {loading ? (
            <p className="text-gray-500 text-center">Loading...</p>
          ) : images.length > 0 ? (
            <div className="grid grid-cols-4 gap-4">
              {images.map((image, index) => (
                <div
                  key={index}
                  className="relative group rounded-lg overflow-hidden shadow-md cursor-pointer transition-transform hover:scale-105"
                >
                  {/* Image */}
                  <img
                    src={image.imageUrl}
                    alt={`Edit ${index}`}
                    className="w-full h-40 object-cover transition-opacity duration-300 group-hover:opacity-75"
                  />

                  {/* Trash Button (Appears on Hover) */}
                  <button
                    onClick={() => confirmDelete(image.title, image.imageUrl)}
                    className="absolute top-2 right-2  bg-opacity-60 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <FontAwesomeIcon icon={faTrash} className="text-black text-lg w-6 h-6" />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center">No edited images found.</p>
          )}
        </div>
      </div>

      {/* 🔹 Delete Confirmation Modal */}
      <DeleteConfirmationModal 
        isOpen={deleteModal} 
        onClose={() => setDeleteModal(false)} 
        onConfirm={handleDelete} 
      />

      {/* 🔹 Custom Scrollbar */}
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #999;
          border-radius: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #555;
        }
      `}</style>
    </div>
  );
};

export default ImageGalleryPopup;
