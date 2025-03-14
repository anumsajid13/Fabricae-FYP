import React, { useState } from "react";

export const GalleryModal = ({ onClose, onSelectImage }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState("");

  // Array of image URLs for the gallery
  const images = [
    "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe",
    "https://images.unsplash.com/photo-1617791160505-6f00504e3519",
    "https://images.unsplash.com/photo-1626544827763-d516dce335e2",
    "https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4",
    "https://images.unsplash.com/photo-1633074280586-ddf70578fb6e",
    "https://images.unsplash.com/photo-1618172193763-c511deb635ca",
  ];

  // Filter options with your specified values
  const filterOptions = [
    { label: "Prompt Designs", value: "prompt" },
    { label: "Sketch Designs", value: "sketch" },
    { label: "3D Preview", value: "3d" },
    { label: "Edited Designs", value: "edited" },
  ];

  const handleFilterSelect = (option) => {
    setSelectedFilter(option.value);
    setIsDropdownOpen(false);
  };

  return (
    <div
      id="webcrumbs"
      style={{ zIndex: 2000 }}
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
    >
      {/* Modal Container */}
      <div className="bg-[#e7e4d8] rounded-2xl overflow-hidden shadow-2xl max-w-sm w-full mx-4">
        <div className="relative p-4">
          {/* Header */}
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-xl font-bold text-[#616852]">My Gallery</h2>
            {/* Close Button */}
            <button
              onClick={onClose}
              className="text-[#822538] hover:text-[#b4707e] transition-colors duration-300"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Smaller Custom Dropdown */}
          <div className="mb-3 relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="w-full flex items-center justify-between py-2 px-3 bg-[#616852] text-white rounded-lg text-xs focus:outline-none hover:bg-[#6e7559] transition-all duration-300 border border-[#616852] focus:border-[#b4707e]"
            >
              <span>{selectedFilter ? filterOptions.find(opt => opt.value === selectedFilter).label : "Select a Folder"}</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className={`h-3 w-3 transition-transform duration-300 ${isDropdownOpen ? "rotate-180" : ""}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>
            
            {/* Dropdown Options with Background Color */}
            {isDropdownOpen && (
              <div className="absolute z-10 mt-1 w-full bg-[#f5f4ee] rounded-lg shadow-lg overflow-hidden border border-[#e0ddd1] animate-fadeIn">
                {filterOptions.map((option, index) => (
                  <div
                    key={index}
                    className={`py-1.5 px-3 cursor-pointer hover:bg-[#e0ddd1] text-xs ${
                      selectedFilter === option.value ? "bg-[#e0ddd1] text-[#616852] font-medium" : "text-[#616852]"
                    } ${index !== 0 ? "border-t border-[#e0ddd1]" : ""}`}
                    onClick={() => handleFilterSelect(option)}
                  >
                    {option.label}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Image Grid */}
          <div
            className="grid grid-cols-2 gap-3 overflow-y-auto"
            style={{ maxHeight: "230px" }}
          >
            {images.map((image, index) => (
              <div
                key={index}
                className="group relative aspect-square overflow-hidden rounded-xl bg-[#f5f4ee] shadow-md hover:shadow-lg transition-all duration-300"
                onClick={() => onSelectImage(image)}
              >
                {/* Image */}
                <img
                  src={image}
                  alt={`Gallery item ${index + 1}`}
                  className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                />
                {/* Image Label */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[#616852] p-2 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                  <h3 className="text-white text-xs font-semibold">
                    Design {index + 1}
                  </h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};