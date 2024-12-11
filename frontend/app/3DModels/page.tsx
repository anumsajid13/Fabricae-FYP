'use client';
import React, { useState, useEffect } from "react";
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

  if (loading) return <p>Loading...</p>;

  return (
    <div className="bg-[#E7E4D8]">
      <NavBar />
      <div className="flex flex-col md:flex-row h-[100vh] mt-14">
        {/* Left side: Patterns */}
        <div
          className="md:w-1/4 bg-[#E7E4D8] p-6 overflow-y-auto rounded-lg"
          style={{
            scrollbarWidth: "thin",
            scrollbarColor: "transparent transparent",
          }}
        >
          <h3 className="text-xl font-semibold mb-4 text-[#822538] text-center">Your Patterns</h3>
          <div className="grid grid-cols-2 gap-4">
            {patterns.map((pattern) => (
              <div
                key={pattern.imageUrl}
                className={`flex flex-col items-center p-4 rounded-lg cursor-pointer shadow-lg transition-all duration-300 transform hover:scale-105 ${
                  selectedPattern === pattern.imageUrl ? "ring-4 ring-[#822538]" : ""
                }`}
                onClick={() => setSelectedPattern(pattern.imageUrl)}
              >
                <img
                  src={pattern.imageUrl}
                  alt={pattern.title}
                  className="w-24 h-24 object-cover rounded-full shadow-md"
                />
                <p className="mt-2 text-sm font-medium text-center text-[#333]">{pattern.title}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Middle: 3D Model */}
        <div className="pt-16 md:w-2/4 relative bg-[#E7E4D8]">
          {selectedModel && (
            <Canvas style={{ width: "100%", height: "100%" }}>
              <color attach="background" args={['#E7E4D8']} />
              <Environment preset="sunset" />
              <PerspectiveCamera makeDefault position={[0, 1.5, 5]} fov={50} />
              <OrbitControls />
              <ContactShadows />

              {/* Studio Background */}
              <mesh position={[0, -0.5, -5]} rotation={[-Math.PI / 2, 0, 0]}>
                <planeGeometry args={[10, 10]} />
                <meshStandardMaterial color="#d9d9d9" />
              </mesh>
              <mesh position={[0, 2, -5]}>
                <boxGeometry args={[10, 8, 0.1]} />
                <meshStandardMaterial color="#d9d9d9" />
              </mesh>
              <ModelComponent key={selectedModel._id} modelUrl={selectedModel.glbUrl} textureUrl={selectedPattern} />
            </Canvas>
          )}
        </div>

        {/* Right side: Model selection */}
        <div className="md:w-1/4 p-6 overflow-y-auto bg-[#E7E4D8] rounded-lg">
          <h3 className="text-xl font-semibold mb-6 text-center text-[#822538]">Choose a Model</h3>
          <div className="grid grid-cols-2 gap-6">
            {models.map((model) => (
              <div
                key={model._id}
                className={`flex flex-col items-center p-4 rounded-lg cursor-pointer shadow-lg transition-all duration-300 transform hover:scale-105 ${
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
