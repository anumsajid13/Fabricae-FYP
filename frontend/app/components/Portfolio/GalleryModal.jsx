import React from "react";

export const GalleryModal = ({ onClose, onSelectImage }) => {
  // Array of image URLs for the gallery
  const images = [
    "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe",
    "https://images.unsplash.com/photo-1617791160505-6f00504e3519",
    "https://images.unsplash.com/photo-1626544827763-d516dce335e2",
    "https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4",
    "https://images.unsplash.com/photo-1633074280586-ddf70578fb6e",
    "https://images.unsplash.com/photo-1618172193763-c511deb635ca",
  ];

  return (
    <div id="webcrumbs">
      {/* Modal Container */}
      <div className="bg-[#e7e4d8] rounded-xl overflow-hidden shadow-2xl">
        <div className="relative p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold text-[#616852]">My Gallery</h2>
            {/* Close Button */}
            <button
              onClick={onClose}
              className="text-[#822538] hover:text-[#b4707e] transition-colors duration-300"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8"
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

          {/* Filter Buttons */}
          <div className="flex space-x-4 mb-8">
            <button className="py-2 px-4 bg-[#616852] text-white rounded-lg hover:bg-opacity-90 transform hover:scale-105 transition-all duration-300 shadow-md">
              Your Sketch to Designs
            </button>
            <button className="py-2 px-4 bg-[#b4707e] text-white rounded-lg hover:bg-opacity-90 transform hover:scale-105 transition-all duration-300 shadow-md">
              Prompt Based Patterns
            </button>
            <button className="py-2 px-4 bg-[#822538] text-white rounded-lg hover:bg-opacity-90 transform hover:scale-105 transition-all duration-300 shadow-md">
              3D Designs
            </button>
            <button className="py-2 px-4 bg-[#616852] text-white rounded-lg hover:bg-opacity-90 transform hover:scale-105 transition-all duration-300 shadow-md">
              Edited Designs
            </button>
          </div>

          {/* Image Grid */}
          <div className="grid grid-cols-3 gap-4">
            {images.map((image, index) => (
              <div
                key={index}
                className="group relative overflow-hidden rounded-lg h-[200px] bg-[#f5f4ee] shadow-md hover:shadow-lg transition-all duration-300"
                onClick={() => onSelectImage(image)} // Pass the selected image URL
              >
                {/* Image */}
                <img
                  src={image}
                  alt={`Gallery item ${index + 1}`}
                  className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                />
                {/* Image Label */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[#616852] p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                  <h3 className="text-white font-semibold">
                    Design {index + 1}
                  </h3>
                </div>
              </div>
            ))}
          </div>

          {/* Load More Button */}
          <div className="flex justify-center mt-8">
            <button className="py-2 px-6 bg-[#b4707e] text-white rounded-full hover:bg-[#822538] transform hover:scale-105 transition-all duration-300 shadow-md flex items-center">
              Load More
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 ml-2"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 3a1 1 0 00-1 1v5H4a1 1 0 100 2h5v5a1 1 0 102 0v-5h5a1 1 0 100-2h-5V4a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};