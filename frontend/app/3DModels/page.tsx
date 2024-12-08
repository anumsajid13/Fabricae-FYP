'use client';

import React, { useState, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import dynamic from "next/dynamic";
import { OrbitControls, Environment, PerspectiveCamera, ContactShadows } from "@react-three/drei";


const ModelComponent = dynamic(
  () => import("../components/3Dvisualization/ModelComponent"),
  { ssr: false }
);


const ModelsPage = () => {
  const [models, setModels] = useState<any[]>([]); // Models list
  const [selectedModel, setSelectedModel] = useState<any>(null); // Selected model state
  const [loading, setLoading] = useState<boolean>(true); // Loading state

  // Fetch models from the API when the page loads
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
        console.log("mama", models) // Default to the first model
      } catch (error) {
        console.error("Error fetching models:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchModels();
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <div className="flex h-[100vh]">
      {/* Left side: 3D Model */}
      <div className="w-2/3">
        {selectedModel && (
          <Canvas style={{ width: "100%", height: "100%" }}>
            <color attach="background" args={["#D3D3D3"]} />
            <Environment preset="sunset" />
            <PerspectiveCamera makeDefault position={[0, 1.5, 5]} fov={50} />
            <OrbitControls />
            <ContactShadows />
            {/* Pass the GLB URL to ModelComponent dynamically */}
            <ModelComponent key={selectedModel._id} modelUrl={selectedModel.glbUrl} textureUrl='pattern.jpg'/>
          </Canvas>
        )}
      </div>

      {/* Right side: Model selection and thumbnails */}
      <div className="w-1/3 bg-gray-200 p-4">
        <h2 className="text-xl font-bold mb-4">Choose a Model</h2>
        <div className="grid grid-cols-2 gap-4">
          {models.map((model) => (
            <div
              key={model._id}
              className="flex flex-col items-center bg-white p-2 rounded shadow cursor-pointer hover:bg-blue-100"
              onClick={() => setSelectedModel(model)} // Set the selected model when clicked
            >
              <div className="h-20 w-20 flex justify-center items-center bg-gray-300 rounded">
                {/* Use the first image as the thumbnail */}
                <img
                  src={model.images[0]}
                  alt={model.mockupName}
                  className="w-full h-full object-cover rounded"
                />
              </div>
              <p className="mt-2 text-sm font-medium">{model.mockupName}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ModelsPage;
