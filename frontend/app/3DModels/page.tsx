'use client';

import React, { useState, useEffect } from "react";
import NavBar from '../components/ImageGenerator/NavBar2';
import { Canvas } from "@react-three/fiber";
import dynamic from "next/dynamic";
import { OrbitControls, Environment, PerspectiveCamera, ContactShadows } from "@react-three/drei";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";

const ModelComponent = dynamic(
  () => import("../components/3Dvisualization/ModelComponent"),
  { ssr: false }
);

const ModelsPage = () => {
  const [models, setModels] = useState<any[]>([]); // Models list
  const [selectedModel, setSelectedModel] = useState<any>(null); // Selected model state
  const [patterns, setPatterns] = useState<any[]>([]); // Patterns list
  const [selectedPattern, setSelectedPattern] = useState<string>(""); // Selected pattern URL
  const [showPatterns, setShowPatterns] = useState(false); // Toggle for patterns
  const [loading, setLoading] = useState<boolean>(true); // Loading state

  // Fetch models from the API
  useEffect(() => {
    const fetchModels = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/model-routes/3d-mockups");
        if (!response.ok) {
          throw new Error("Failed to fetch models");
        }
        const data = await response.json();
        setModels(data);
        setSelectedModel(data[0]); // Default to the first model
      } catch (error) {
        console.error("Error fetching models:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchModels();
  }, []);

  // Fetch patterns from the API
  useEffect(() => {
    const fetchPatterns = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/prompt-designs/retrieve");
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

  if (loading) return <p>Loading...</p>;

  return (
    < div className="bg-[#E7E4D8]">    
    <NavBar/>
    <div className="flex flex-col md:flex-row h-[100vh] mt-14">
      {/* Left side: 3D Model */}
      <div className="md:w-2/3 relative bg-[#E7E4D8] ">
        {selectedModel && (
          <Canvas style={{ width: "100%", height: "100%" }}>
            <color attach="background" args={['#E7E4D8']} />
            <Environment preset="sunset" />
            <PerspectiveCamera makeDefault position={[0, 1.5, 5]} fov={50} />
            <OrbitControls />
            <ContactShadows />
            <ModelComponent key={selectedModel._id} modelUrl={selectedModel.glbUrl} textureUrl={selectedPattern} />
          </Canvas>
        )}

        {/* Collapsible Patterns Section */}
        <div className="absolute bottom-0 left-0 w-full bg-[#e7b5bf] p-4 shadow-lg " style={{marginTop:"-30%"}}>
          <div
            className="flex justify-between items-center cursor-pointer hover:bg-[#e7b5bf] transition-all duration-300"
            onClick={() => setShowPatterns(!showPatterns)}
          >
            <h3 className="text-xl font-semibold text-[#333]">Available Patterns</h3>
            {showPatterns ? <FaChevronDown className="text-[#616852]" /> : <FaChevronUp className="text-[#616852]" />}
          </div>
          {showPatterns && (
            <div className="mt-4 grid grid-cols-3 gap-4">
              {patterns.map((pattern) => (
                <div
                  key={pattern.imageUrl}
                  className={`flex flex-col items-center p-4 rounded-lg cursor-pointer shadow-lg transition-all duration-300 transform hover:scale-105 ${
                    selectedPattern === pattern.imageUrl ? "ring-4 ring-[#616852]" : ""
                  }`}
                  onClick={() => {
                    setSelectedPattern(pattern.imageUrl); // Set texture for 3D model
                    setShowPatterns(false); // Auto-collapse patterns section
                  }}
                >
                  <img
                    src={pattern.imageUrl}
                    alt={pattern.title}
                    className="w-24 h-24 object-cover rounded-lg shadow-md"
                  />
                  <p className="mt-2 text-sm font-medium text-center text-[#333]">{pattern.title}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Right side: Model selection */}
      <div className="md:w-1/3 p-6 overflow-y-auto bg-[#E7E4D8] rounded-lg ">
        {/* <h2 className="text-2xl font-bold mb-6 text-center text-[#822538]">Choose a Model</h2> */}
        <div className="grid grid-cols-2 gap-6">
          {models.map((model) => (
            <div
              key={model._id}
              className={` bg-[ ] flex flex-col items-center p-4 rounded-lg cursor-pointer shadow-lg transition-all duration-300 transform hover:scale-105 ${
                selectedModel?._id === model._id ? "ring-4 ring-[#822538]" : ""
              }`}
              onClick={() => setSelectedModel(model)}
            >
              <img
                src={model.images[0]}
                alt={model.mockupName}
                className="w-24 h-24 object-cover rounded-full shadow-md"
              />
              <p className="mt-2 text-sm font-medium text-[#822538]">{model.mockupName}</p>
            </div>
          ))}
        </div>
      </div>
    </div>

    </div>
  );
};

export default ModelsPage;
