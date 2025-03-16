"use client";
import React, { useEffect, useState } from "react";
import { FaTrash, FaTimes } from "react-icons/fa";

interface ThreeDGalleryProps {
  isOpen: boolean;
  onClose: () => void;
}

const ThreeDGallery: React.FC<ThreeDGalleryProps> = ({ isOpen, onClose }) => {
  const [designs, setDesigns] = useState<{ _id: string; title: string; imageUrl: string; createdAt: string }[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [sortOrder, setSortOrder] = useState<"latest" | "oldest">("latest");

  useEffect(() => {
    if (!isOpen) return;

    const fetchDesigns = async () => {
      const username = localStorage.getItem("userEmail");
      if (!username) return;

      try {
        const response = await fetch(`http://localhost:5000/api/prompt-designs/get3D/${username}`);
        if (!response.ok) throw new Error("Failed to fetch designs");

        const data = await response.json();
        setDesigns(data);
      } catch (error) {
        console.error("Error fetching designs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDesigns();
  }, [isOpen]);

  const handleDelete = async (designId: string) => {
    try {
      const response = await fetch(`http://localhost:5000/api/prompt-designs/delete3D/${designId}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete design");

      setDesigns((prev) => prev.filter((design) => design._id !== designId));
    } catch (error) {
      console.error("Error deleting design:", error);
    }
  };

  // Sort Designs Based on sortOrder
  const sortedDesigns = [...designs].sort((a, b) => {
    return sortOrder === "latest"
      ? new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime() // Latest First
      : new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(); // Oldest First
  });

  if (!isOpen) return null;

  return (
    <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-60 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-4/5 max-w-5xl h-[540px] flex flex-col border border-gray-300">
        {/* Navbar */}
        <div className="flex justify-between items-center border-b border-gray-300 pb-2 mb-4">
          <h2 className="text-xl font-bold text-[#822538]">3D Designs Gallery</h2>
          <button onClick={onClose} className="text-gray-600 text-lg">
            <FaTimes className="text-xl" />
          </button>
        </div>

        {/* Sort Button */}
        <div className="flex justify-end px-4 py-2">
          <button onClick={() => setSortOrder(sortOrder === "latest" ? "oldest" : "latest")}>
            <img
              src="/sort (2).png"
              alt="Sort"
              className="w-12 h-12 cursor-pointer transition-transform duration-300 hover:scale-110"
            />
          </button>
        </div>

        {/* Image Gallery */}
        <div className="flex-1 overflow-y-auto p-4">
          {loading ? (
            <p className="text-gray-500 text-center">Loading...</p>
          ) : sortedDesigns.length === 0 ? (
            <p className="text-gray-500 text-center">No saved 3D designs found.</p>
          ) : (
            <div className="grid grid-cols-3 gap-6">
              {sortedDesigns.map((design) => (
                <div
                  key={design._id}
                  className="relative overflow-hidden group rounded-lg shadow-lg cursor-pointer transform transition-all duration-300 hover:scale-105"
                >
                  {/* 3D Image */}
                  <img
                    src={design.imageUrl}
                    alt={design.title}
                    className="w-full h-80 object-cover rounded-lg transition-all duration-300 group-hover:brightness-50"
                  />

                  {/* Title Overlay */}
                  <div className="absolute bottom-4 left-4 right-4 text-white opacity-0 group-hover:opacity-100 transition-all duration-300">
                    <p className="text-lg font-semibold">{design.title}</p>
                  </div>

                  {/* Trash Icon */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(design._id);
                    }}
                    className="absolute top-4 right-4 bg-[#822538] p-2 rounded-full shadow-md text-white opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-[#B4707E]"
                  >
                    <FaTrash size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ThreeDGallery;
