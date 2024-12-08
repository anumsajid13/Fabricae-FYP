'use client';

import React, { useState, useEffect } from "react";
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
    <div className="flex h-[100vh] bg-gray-100">
      {/* Left side: 3D Model */}
      <div className="w-2/3 relative">
        {selectedModel && (
          <Canvas style={{ width: "100%", height: "100%" }}>
            <color attach="background" args={["#D3D3D3"]} />
            <Environment preset="sunset" />
            <PerspectiveCamera makeDefault position={[0, 1.5, 5]} fov={50} />
            <OrbitControls />
            <ContactShadows />
            <ModelComponent key={selectedModel._id} modelUrl={selectedModel.glbUrl} textureUrl={selectedPattern} />
          </Canvas>
        )}
        {/* Collapsible Patterns Section */}
        <div className="absolute bottom-0 left-0 w-full bg-white shadow-md p-4">
          <div
            className="flex justify-between items-center cursor-pointer"
            onClick={() => setShowPatterns(!showPatterns)}
          >
            <h3 className="text-lg font-bold">Available Patterns</h3>
            {showPatterns ? <FaChevronDown /> : <FaChevronUp />}
          </div>
          {showPatterns && (
            <div className="mt-4 grid grid-cols-3 gap-4">
              {patterns.map((pattern) => (
                <div
                  key={pattern.imageUrl}
                  className={`flex flex-col items-center p-2 rounded-lg cursor-pointer shadow-md transition-all duration-300 ${
                    selectedPattern === pattern.imageUrl ? "ring-4 ring-blue-500" : ""
                  }`}
                  onClick={() => {
                    setSelectedPattern(pattern.imageUrl); // Set texture for 3D model
                    setShowPatterns(false); // Auto-collapse patterns section
                  }}
                >
                  <img
                    src={pattern.imageUrl}
                    alt={pattern.title}
                    className="w-24 h-24 object-cover rounded-lg shadow"
                  />
                  <p className="mt-2 text-sm font-medium text-center">{pattern.title}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Right side: Model selection */}
      <div className="w-1/3 bg-gray-200 p-6 overflow-y-auto">
        <h2 className="text-xl font-bold mb-4 text-center">Choose a Model</h2>
        <div className="grid grid-cols-2 gap-4">
          {models.map((model) => (
            <div
              key={model._id}
              className={`flex flex-col items-center p-2 rounded-lg cursor-pointer shadow-lg transition-all duration-300 ${
                selectedModel?._id === model._id ? "ring-4 ring-blue-500" : ""
              }`}
              onClick={() => setSelectedModel(model)}
            >
              <img
                src={model.images[0]}
                alt={model.mockupName}
                className="w-24 h-24 object-cover rounded-full"
              />
              <p className="mt-2 text-sm font-medium">{model.mockupName}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ModelsPage;
