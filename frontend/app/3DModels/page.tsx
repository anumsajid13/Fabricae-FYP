'use client';
import React, { useState, useEffect, useRef} from "react";
import html2canvas from "html2canvas";
import NavBar from '../components/ImageGenerator/NavBar2';
import { Canvas } from "@react-three/fiber";
import dynamic from "next/dynamic";
import { OrbitControls, Environment, PerspectiveCamera, ContactShadows } from "@react-three/drei";
import { MeshStandardMaterial } from "three";
import { useSelectedCardsStore} from "../store/selectedCardsStore"
import { useThree } from "@react-three/fiber";

const ModelComponent = dynamic(
  () => import("../components/3Dvisualization/ModelComponent"),
  { ssr: false }
);

const ModelsPage = () => {
  const [models, setModels] = useState<any[]>([]);
  const [selectedModel, setSelectedModel] = useState<any>(null);
  const [patterns, setPatterns] = useState<any[]>([]);
  const [selectedPattern, setSelectedPattern] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [sliderValue, setSliderValue] = useState<any>(1)
  const { selectedCards } = useSelectedCardsStore();
  const [screenshot, setScreenshot] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState<boolean>(false);
  const [isCapturing, setIsCapturing] = useState(false);

  const canvasRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchModels = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/model-routes/3d-mockups");
        if (!response.ok) {
          throw new Error("Failed to fetch models");
        }
        const data = await response.json();
        setModels(data);
        setSelectedModel(data[0]);
      } catch (error) {
        console.error("Error fetching models:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchModels();
  }, []);

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

  const handleSliderChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSliderValue(Number(event.target.value)); 
  };

  const captureScreenshot = async () => {
    setIsCapturing(true);
    try {
      // Get the Three.js canvas element
      const canvas = document.querySelector('canvas');
      if (!canvas) {
        console.error("Canvas not found");
        return;
      }
  
      // Create a new canvas and get its context
      const newCanvas = document.createElement('canvas');
      const context = newCanvas.getContext('2d');
      if (!context) {
        console.error("Could not get 2d context");
        return;
      }
  
      // Set the new canvas dimensions to match the original
      newCanvas.width = canvas.width;
      newCanvas.height = canvas.height;
  
      // Draw the WebGL canvas content onto the new canvas
      // This preserves the WebGL state
      context.drawImage(canvas, 0, 0);
  
      // Convert to base64 image
      const dataUrl = newCanvas.toDataURL('image/png', 1.0);
      setScreenshot(dataUrl);
      setShowPreview(true);
  
    } catch (error) {
      console.error("Error capturing screenshot:", error);
    }finally {
      setIsCapturing(false);
    }
  };
  
  // Add this function to actually save the screenshot
  const handleSaveDesign = async () => {
    if (!screenshot) return;
  
    try {
      // Convert base64 to blob
      const base64Response = await fetch(screenshot);
      const blob = await base64Response.blob();
  
      // Create a download link
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `design-${Date.now()}.png`;
      
      // Trigger download
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
  
      setShowPreview(false);
    } catch (error) {
      console.error("Error saving screenshot:", error);
    }
  };

  if (loading) return <p>Loading...</p>;

  return (

    <div className="bg-[#E7E4D8] min-h-screen overflow-hidden">
    <NavBar />
    <div className="flex flex-col md:flex-row h-[90vh] mt-1">
      {/* Left Side: 3D Model Display (70%) */}
      
     <div className="w-full md:w-7/12 p-6 flex items-center justify-center relative">
  <div className="bg-[#F7F7F8] rounded-2xl shadow-xl p-4 w-full h-full flex items-center justify-center border-1" ref={canvasRef}>
    {selectedModel && (
      <Canvas gl={{ preserveDrawingBuffer: true }} style={{ width: "100%", height: "100%", borderRadius: "16px" }}>
        {/* Flat Background Color */}
        <color attach="background" args={["#EAE7DB"]} />
        <Environment preset="sunset" />
        <PerspectiveCamera makeDefault position={[0, 3, 10]} fov={10} />
        <OrbitControls enablePan={false} enableZoom={true} enableRotate={true} />
        
        {/* Centered Model */}
        <group position={[0, -1, 0]}>
        <ModelComponent key={selectedModel._id} modelUrl={selectedModel.glbUrl} textureUrl={selectedPattern} sliderValue={sliderValue}/>
        </group>
      </Canvas>
    )}

    {/* Buttons inside the canvas */}
    <div className="absolute top-12 right-12 flex gap-2">
      <img
        src="/undo.png"
        alt="Undo"
        className="w-10 h-10 bg-gradient-to-r from-white to-[#F8F7F2] p-2 rounded-full shadow-lg hover:shadow-xl transform hover:scale-110 transition-all duration-300 cursor-pointer"
      />
      <img
        src="/redo.png"
        alt="Redo"
        className="w-10 h-10 bg-gradient-to-r from-white to-[#F8F7F2] p-2 rounded-full shadow-lg hover:shadow-xl transform hover:scale-110 transition-all duration-300 cursor-pointer"
      />
    </div>


    {/* Slider below */}
    <div className="absolute bottom-12 left-12 right-4 w-[89%]">
      <input
        type="range"
        className="w-full accent-[#B4707E] hover:accent-[#822538] transition-all duration-300"
        value={sliderValue}  // Bind slider value
        onChange={handleSliderChange}
      />
    </div>
  </div>
</div>

  
      {/* Right Side: Mannequin Selection and Patterns (30%) */}
      <div className="w-full md:w-5/12 space-y-6 p-4 bg-[#E7E4D8] overflow-auto">
        {/* Select Mannequin */}
        <div className="bg-gradient-to-br from-white to-[#F8F7F2] rounded-2xl p-4 shadow-md">
          <h2 className="text-lg font-semibold mb-3 bg-gradient-to-r from-[#822538] to-[#B4707E] bg-clip-text text-transparent">
            Select Mannequin
          </h2>
          <div className="grid grid-cols-2 gap-4">
            {models.map((model) => (
              <div
                key={model._id}
                className={`w-26 h-26 aspect-square bg-gradient-to-br from-[#EAE7DB] to-[#E7E4D8] rounded-2xl cursor-pointer hover:shadow-xl transform hover:scale-105 transition-all duration-300 p-2 ${
                  selectedModel?._id === model._id ? "ring-4 ring-[#822538]" : ""
                }`}
                onClick={() => setSelectedModel(model)}
              >
                {/* Model Image */}
                <img
                  src={model.images[0]} // Assuming images is an array and the first image is used
                  alt={model.mockupName}
                  className="w-full h-full object-cover rounded-2xl shadow-md" // Ensures the image covers the area and is rounded
                />
              </div>
            ))}
          </div>
        </div>

        {/* Screenshot Preview Modal */}
        {showPreview && screenshot && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-white p-6 rounded-lg shadow-lg max-w-2xl w-full mx-4">
      <h2 className="text-lg font-semibold mb-4">Preview Screenshot</h2>
      <div className="relative">
        <img 
          src={screenshot} 
          alt="Screenshot Preview" 
          className="rounded-lg shadow-md mb-4 w-full"
        />
      </div>
      <div className="flex justify-end gap-4">
        <button
          onClick={() => setShowPreview(false)}
          className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={handleSaveDesign}
          className="px-4 py-2 bg-gradient-to-r from-[#822538] to-[#B4707E] text-white rounded-lg hover:from-[#B4707E] hover:to-[#822538] transition-colors"
        >
          Download
        </button>
      </div>
    </div>
  </div>
)}
  
        {/* Design Patterns */}
        <div className="bg-gradient-to-br from-white to-[#F8F7F2] rounded-2xl p-4 shadow-md">
          <h2 className="text-lg font-semibold mb-3 bg-gradient-to-r from-[#822538] to-[#B4707E] bg-clip-text text-transparent">
            Design Patterns
          </h2>
          <div className="grid grid-cols-3 gap-3">
            {selectedCards.map((pattern) => (
              <div
                key={pattern.src}
                className={`bg-[#E7E4D8] flex flex-col items-center p-4 rounded-2xl cursor-pointer shadow-md transition-all transform hover:scale-105 ${
                  selectedPattern === pattern.src ? "ring-4 ring-[#822538]" : ""
                }`}
                onClick={() => setSelectedPattern(pattern.src)}
              >
                {/* Pattern Image */}
                <img
                  src={pattern.src}
                  alt={pattern.title}
                  className="object-cover rounded-2xl shadow-md"
                />
                {/* <p className="mt-2 text-sm font-medium text-center text-[#333]">{pattern.title}</p> */}
              </div>
            ))}
          </div>
        </div>
  
        {/* Action Buttons */}
        <div className="flex gap-4">
          <button  onClick={captureScreenshot} disabled={isCapturing} className="flex-1 bg-gradient-to-r from-[#822538] to-[#B4707E] text-white py-3 rounded-2xl font-semibold hover:from-[#B4707E] hover:to-[#822538] transform hover:scale-105 transition-all duration-300 shadow-md hover:shadow-xl">
            <span className="flex items-center justify-center gap-2">
            <img className= "w-8 h-8" src= "/save.png"/>
            {isCapturing ? 'Capturing...' : 'Save Design'}
            </span>
            
          </button>
          <button className="flex-1 bg-gradient-to-r from-white to-[#F8F7F2] text-[#822538] border-2 border-[#822538] py-3 rounded-2xl font-semibold hover:bg-[#E7E4D8] transform hover:scale-105 transition-all duration-300 shadow-md hover:shadow-xl">
           
            <span className="flex items-center justify-center gap-2">
            Next
            <img className= "w-8 h-8" src= "/next.png"/>
              
            </span>
          </button>
        </div>
      </div>
    </div>
  </div>
  

  );
  
};

export default ModelsPage;
