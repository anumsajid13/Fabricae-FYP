"use client";
import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { useSelectedCardsStore } from "../../store/selectedCardsStore";
import { FaChevronRight } from "react-icons/fa";

interface PatternGalleryPopupProps {
  isOpen: boolean;
  onClose: () => void;
  images: { title: string; imageUrl: string; patternType: string }[];
}

const PatternGalleryPopup: React.FC<PatternGalleryPopupProps> = ({ isOpen, onClose, images }) => {
  const [loading, setLoading] = useState(true);
  const [sortedImages, setSortedImages] = useState<{ [key: string]: { title: string; imageUrl: string }[] }>({});
  const [selectedImages, setSelectedImages] = useState<{ title: string; imageUrl: string }[]>([]);
  const { updateSelectedCards } = useSelectedCardsStore(); // ✅ Zustand hook for managing selected cards

  useEffect(() => {
    if (!isOpen) return;

    // Categorize images by patternType
    const categorizedImages: { [key: string]: { title: string; imageUrl: string }[] } = {
      sketch: [],
      prompt: [],
      "edited-pattern": [],
    };

    images.forEach((image) => {
      if (categorizedImages[image.patternType]) {
        categorizedImages[image.patternType].push({ title: image.title, imageUrl: image.imageUrl });
      }
    });

    setSortedImages(categorizedImages);
    setLoading(false);
  }, [isOpen, images]);

  // ✅ Toggle selection of images
  const toggleImageSelection = (image: { title: string; imageUrl: string }) => {
    setSelectedImages((prevSelected) => {
      const isAlreadySelected = prevSelected.some((img) => img.imageUrl === image.imageUrl);
      if (isAlreadySelected) {
        return prevSelected.filter((img) => img.imageUrl !== image.imageUrl);
      } else {
        return [...prevSelected, image];
      }
    });
  };
  const handleSaveSelectedImages = () => {
    const formattedImages = selectedImages.map((image) => ({
      title: image.title,
      src: image.imageUrl, // Convert imageUrl to src
    }));
  
    updateSelectedCards((prev) => [...prev, ...formattedImages]); // Append correctly formatted images
    onClose(); // Close the modal after saving
  };

  if (!isOpen) return null;

  return (
    <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-60 backdrop-blur-md flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-4/5 max-w-5xl h-[540px] flex flex-col border border-gray-300">
        {/* 🔹 Navbar */}
        <div className="bg-white border-b-3 border-[#cf5069] px-4 py-3 rounded-t-lg shadow-sm flex justify-between items-center">
          <h2 className="text-xl font-bold text-[#9e4557]">Select a Pattern</h2>
          <button onClick={onClose} className="text-gray-600 text-lg">
            <FontAwesomeIcon icon={faTimes} className="text-xl" />
          </button>
        </div>

        {/* 🔹 Scrollable Image Gallery */}
        <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
          {loading ? (
            <p className="text-gray-500 text-center">Loading...</p>
          ) : Object.values(sortedImages).every((group) => group.length === 0) ? (
            <p className="text-gray-500 text-center">No patterns available.</p>
          ) : (
            <>
              {/* 🔹 Sketch Patterns */}
              {sortedImages["sketch"].length > 0 && (
                <>
                  <h3 className="text-lg font-semibold text-[#9e4557] mb-2">Sketch</h3>
                  <div className="grid grid-cols-4 gap-4 mb-6">
                    {sortedImages["sketch"].map((image, index) => (
                      <GalleryImage
                        key={index}
                        title={image.title}
                        imageUrl={image.imageUrl}
                        isSelected={selectedImages.some((img) => img.imageUrl === image.imageUrl)}
                        onSelect={() => toggleImageSelection(image)}
                      />
                    ))}
                  </div>
                </>
              )}

              {/* 🔹 Prompt Patterns */}
              {sortedImages["prompt"].length > 0 && (
                <>
                  <h3 className="text-lg font-semibold text-[#9e4557] mb-2">Prompt</h3>
                  <div className="grid grid-cols-4 gap-4 mb-6">
                    {sortedImages["prompt"].map((image, index) => (
                      <GalleryImage
                        key={index}
                        title={image.title}
                        imageUrl={image.imageUrl}
                        isSelected={selectedImages.some((img) => img.imageUrl === image.imageUrl)}
                        onSelect={() => toggleImageSelection(image)}
                      />
                    ))}
                  </div>
                </>
              )}

              {/* 🔹 Edited Patterns */}
              {sortedImages["edited-pattern"].length > 0 && (
                <>
                  <h3 className="text-lg font-semibold text-[#9e4557] mb-2">Edited Pattern</h3>
                  <div className="grid grid-cols-4 gap-4 mb-6">
                    {sortedImages["edited-pattern"].map((image, index) => (
                      <GalleryImage
                        key={index}
                        title={image.title}
                        imageUrl={image.imageUrl}
                        isSelected={selectedImages.some((img) => img.imageUrl === image.imageUrl)}
                        onSelect={() => toggleImageSelection(image)}
                      />
                    ))}
                  </div>
                </>
              )}
            </>
          )}
        </div>

        {/* ✅ Move Further Button (Fixed at bottom-right) */}
        {selectedImages.length > 0 && (
          <button
            onClick={handleSaveSelectedImages}
            className="fixed bottom-6 right-6 bg-[#822538] p-3 rounded-full shadow-lg hover:bg-[#B4707E] transition-all duration-300"
          >
            <FaChevronRight className="text-white text-xl" />
          </button>
        )}
      </div>

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

const GalleryImage = ({
  title,
  imageUrl,
  isSelected,
  onSelect,
}: {
  title: string;
  imageUrl: string;
  isSelected: boolean;
  onSelect: () => void;
}) => {
  return (
    <div
      onClick={onSelect}
      className={`relative group rounded-lg overflow-hidden shadow-md cursor-pointer transition-transform hover:scale-105 ${
        isSelected ? "ring-4 ring-[#822538]" : ""
      }`}
    >
      <img src={imageUrl} alt={title} className="w-full h-40 object-cover transition-opacity duration-300 group-hover:opacity-75" />
    </div>
  );
};

export default PatternGalleryPopup;
