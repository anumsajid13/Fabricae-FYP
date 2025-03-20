import { useEffect, useState } from "react";
import { Image } from "fabric";
import * as fabric from "fabric";

const ImageBox = ({ canvas, currentFilter, setCurrentFilter }) => {
  const [patterns, setPatterns] = useState([]);

  const displayImageOnCanvas = async (imageUrl) => {
    try {
      console.log("Attempting to fetch image:", imageUrl);

      const image = await Image.fromURL(imageUrl, { crossOrigin: "Anonymous" });
      console.log("image", image);
      image.scale(0.5);
      canvas.add(image);
      canvas.centerObject(image);
      canvas.setActiveObject(image);
    } catch (error) {
      console.error("Error displaying image on canvas:", error);
    }
  };

  useEffect(() => {
    const fetchPatterns = async () => {
      const username = localStorage.getItem("userEmail");
      if (!username) {
        console.error("No username found in localStorage");
        return;
      }
      try {
        const response = await fetch(`http://localhost:5000/api/prompt-designs/retrieve-by-username/${username}`);
        if (!response.ok) {
          throw new Error("Failed to fetch patterns");
        }
        const data = await response.json();
        setPatterns(data);
      } catch (error) {
        console.error("Error fetching patterns:", error);
      }
    };

    fetchPatterns();
  }, []);

  return (
    <div className="flex flex-col items-start space-y-4 p-4 bg-[#434242] shadow-md rounded-xl fixed top-[7rem] right-2 h-[calc(89vh-4rem)] overflow-y-scroll scrollbar-hide w-84">
      {/* 🔹 YOUR DESIGNS Header */}
      <h2 className="text-white text-lg font-bold uppercase tracking-wider border-b border-transparent pb-0 w-full text-center">
        YOUR DESIGNS
      </h2>

      {/* 🔹 Image Grid */}
      <div className="grid grid-cols-3 gap-3 w-full">
        {patterns.map((pattern, index) => (
          <div
            key={index}
            className="w-24 h-24 bg-gray-200 cursor-pointer hover:opacity-75 rounded-lg overflow-hidden transition-transform transform hover:scale-105"
            onClick={() => displayImageOnCanvas(pattern.imageUrl)}
          >
            <img
              src={pattern.imageUrl}
              alt={`Pattern ${index}`}
              className="w-full h-full object-cover"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ImageBox;
