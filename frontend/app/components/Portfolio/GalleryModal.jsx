import React, { useState, useEffect } from "react";

export const GalleryModal = ({ onClose, onSelectImage }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState("prompt"); // Default to "prompt"
  const [images, setImages] = useState([]); // State to store fetched images
  const [isLoading, setIsLoading] = useState(false); // Loading state
  const [error, setError] = useState(null); // Error state

  // Filter options with your specified values
  const filterOptions = [
    { label: "Prompt Designs", value: "prompt" },
    { label: "Sketch Designs", value: "sketch" },
    { label: "3D Preview", value: "3d" },
    { label: "Edited Designs", value: "edited" },
  ];

  // Fetch images from the backend based on the selected filter
  const fetchImages = async (patternType) => {


    setIsLoading(true);
    setError(null);

    try {

      const username = localStorage.getItem("userEmail");

      console.log (username,patternType)

      const response = await fetch(
        `http://localhost:5000/api/prompt-designs/${username}/${patternType}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch images");
      }

      const data = await response.json();


      console.log ( data , username)
      // Filter out duplicate images based on both imageUrl and title
      const uniqueImages = data.reduce((acc, current) => {
        const isDuplicate = acc.some(
          (image) =>
            image.imageUrl === current.imageUrl || image.title === current.title
        );
        if (!isDuplicate) {
          acc.push(current);
        }
        return acc;
      }, []);

      if (uniqueImages.length === 0) {
        setError(`No designs found for ${patternType}.`);
      } else {
        setImages(uniqueImages); // Set the fetched images
      }
    } catch (error) {
      console.error("Error fetching images:", error);
      setError("Failed to fetch images. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch images when the selected filter changes
  useEffect(() => {
    fetchImages(selectedFilter);
  }, [selectedFilter]);

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
              <span>
                {filterOptions.find((opt) => opt.value === selectedFilter).label}
              </span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className={`h-3 w-3 transition-transform duration-300 ${
                  isDropdownOpen ? "rotate-180" : ""
                }`}
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
                      selectedFilter === option.value
                        ? "bg-[#e0ddd1] text-[#616852] font-medium"
                        : "text-[#616852]"
                    } ${index !== 0 ? "border-t border-[#e0ddd1]" : ""}`}
                    onClick={() => handleFilterSelect(option)}
                  >
                    {option.label}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="flex justify-center items-center h-40">
              <p className="text-[#616852]">Loading...</p>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="flex justify-center items-center h-40">
              <p className="text-[#822538]">{error}</p>
            </div>
          )}

          {/* Image Grid */}
          {!isLoading && !error && (
            <div
              className="grid grid-cols-2 gap-3 overflow-y-auto"
              style={{ maxHeight: "230px" }}
            >
              {images.map((image, index) => (
                <div
                  key={image._id} // Use the unique _id from the backend
                  className="group relative aspect-square overflow-hidden rounded-xl bg-[#f5f4ee] shadow-md hover:shadow-lg transition-all duration-300"
                  onClick={() => onSelectImage(image.imageUrl)} // Use imageUrl from the backend
                >
                  {/* Image */}
                  <img
                    src={image.imageUrl} // Use imageUrl from the backend
                    alt={image.title || `Design ${index + 1}`} // Use title from the backend
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                  />
                  {/* Image Label */}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[#616852] p-2 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                    <h3 className="text-white text-xs font-semibold">
                      {image.title || `Design ${index + 1}`} // Use title from the backend
                    </h3>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};