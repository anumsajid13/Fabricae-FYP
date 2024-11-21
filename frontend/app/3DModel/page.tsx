// pages/index.js
"use client"
import dynamic from 'next/dynamic';
import React from 'react';
import {
  ContactShadows,
  Environment,
  OrbitControls,
  PerspectiveCamera,
} from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Model1 } from "../components/3Dvisualization/model";

const Model = () => {
  return (
    <div className="h-[100vh] ">
      <Canvas
        style={{
          width: "100%",
          height: "100%",
        }}
      >
        <color attach="background" args={["#D3D3D3"]} />
        <Environment preset='studio' />
        <PerspectiveCamera makeDefault position={[2, 3.9, 4.1]} />
        <OrbitControls />
        <Model1 position={[0, 0.1, 0]} />
        <ContactShadows />
      </Canvas>
    </div>
  );
};

export default Model;
