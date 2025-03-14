import React from "react";

export const ImageOptionsModal = ({
  onClose,
  onChooseFromComputer,
  onChooseFromGallery,
}) => {
  return (
    <div
      id="webcrumbs"
      style={{ zIndex: 1000 }}
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
    >
      <div className="w-[400px] bg-[#e7e4d8] rounded-lg shadow-lg overflow-hidden transform transition-transform duration-300 hover:scale-[1.02]">
        <div className="relative p-5 border-b border-[#616852]/20">
          <h2 className="text-[#822538] text-xl font-bold text-center">
            Choose Image
          </h2>
          <button
            onClick={onClose}
            className="absolute top-5 right-5 text-[#616852] hover:text-[#b4707e] transition-colors duration-200"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className="p-6 space-y-4">
          {/* Button to trigger file input */}
          <button
            onClick={onChooseFromComputer}
            style={{ borderRadius: "40px" }}
            className="w-full bg-[#616852] hover:bg-[#616852]/90 text-white py-3 px-4 flex items-center justify-center space-x-3 transition-all duration-200 hover:shadow-md transform hover:-translate-y-0.5"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <span>Choose from Computer</span>
          </button>

          {/* Button to choose from gallery */}
          <button
            onClick={onChooseFromGallery}
            style={{ borderRadius: "40px" }}
            className="w-full bg-[#b4707e] hover:bg-[#b4707e]/90 text-white py-3 px-4 flex items-center justify-center space-x-3 transition-all duration-200 hover:shadow-md transform hover:-translate-y-0.5"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <span>Choose from Gallery</span>
          </button>
        </div>
      </div>
    </div> 
  );
};