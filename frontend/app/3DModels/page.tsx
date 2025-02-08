'use client';
import React, { useState, useEffect} from "react";
import NavBar from '../components/ImageGenerator/NavBar2';
import { Canvas } from "@react-three/fiber";
import dynamic from "next/dynamic";
import { OrbitControls, Environment, PerspectiveCamera, ContactShadows } from "@react-three/drei";
import { MeshStandardMaterial } from "three";

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

  if (loading) return <p>Loading...</p>;

  return (

    <div className="bg-[#E7E4D8] min-h-screen overflow-hidden">
    <NavBar />
    <div className="flex flex-col md:flex-row h-[90vh] mt-1">
      {/* Left Side: 3D Model Display (70%) */}
      
     <div className="w-full md:w-7/12 p-6 flex items-center justify-center relative">
  <div className="bg-[#F7F7F8] rounded-2xl shadow-xl p-4 w-full h-full flex items-center justify-center border-1">
    {selectedModel && (
      <Canvas style={{ width: "100%", height: "100%", borderRadius: "16px" }}>
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
      <button className="bg-gradient-to-r from-white to-[#F8F7F2] p-2 rounded-full shadow-lg hover:shadow-xl transform hover:scale-110 transition-all duration-300">
        <span className="material-symbols-outlined text-[#822538] hover:text-[#B4707E]">
          zoom_in
        </span>
      </button>
      <button className="bg-gradient-to-r from-white to-[#F8F7F2] p-2 rounded-full shadow-lg hover:shadow-xl transform hover:scale-110 transition-all duration-300">
        <span className="material-symbols-outlined text-[#822538] hover:text-[#B4707E]">
          rotate_right
        </span>
      </button>
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
  
        {/* Design Patterns */}
        <div className="bg-gradient-to-br from-white to-[#F8F7F2] rounded-2xl p-4 shadow-md">
          <h2 className="text-lg font-semibold mb-3 bg-gradient-to-r from-[#822538] to-[#B4707E] bg-clip-text text-transparent">
            Design Patterns
          </h2>
          <div className="grid grid-cols-3 gap-3">
            {patterns.map((pattern) => (
              <div
                key={pattern.imageUrl}
                className={`bg-[#E7E4D8] flex flex-col items-center p-4 rounded-2xl cursor-pointer shadow-md transition-all transform hover:scale-105 ${
                  selectedPattern === pattern.imageUrl ? "ring-4 ring-[#822538]" : ""
                }`}
                onClick={() => setSelectedPattern(pattern.imageUrl)}
              >
                {/* Pattern Image */}
                <img
                  src={pattern.imageUrl}
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
          <button className="flex-1 bg-gradient-to-r from-[#822538] to-[#B4707E] text-white py-3 rounded-lg font-semibold hover:from-[#B4707E] hover:to-[#822538] transform hover:scale-105 transition-all duration-300 shadow-md hover:shadow-xl">
            <span className="flex items-center justify-center gap-2">
              <span className="material-symbols-outlined">save</span>
              Save Design
            </span>
          </button>
          <button className="flex-1 bg-gradient-to-r from-white to-[#F8F7F2] border-2 border-[#822538] py-3 rounded-lg font-semibold hover:bg-[#E7E4D8] transform hover:scale-105 transition-all duration-300 shadow-md hover:shadow-xl">
            <span className="flex items-center justify-center gap-2">
              Next
              <span className="material-symbols-outlined">arrow_forward</span>
            </span>
          </button>
        </div>
      </div>
    </div>
  </div>
  

  );
  
};

export default ModelsPage;
