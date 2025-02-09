import React, { useEffect, useState } from "react";
import { useGLTF } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";

interface ModelComponentProps {
  modelUrl: string;
  textureUrl: string;
  sliderValue: number;
}

const ModelComponent: React.FC<ModelComponentProps> = ({ modelUrl, textureUrl, sliderValue }) => {
  const { scene, nodes } = useGLTF(modelUrl);
  const { camera, gl } = useThree();
  const [texture, setTexture] = useState<THREE.Texture | null>(null);
  const [selectedPart, setSelectedPart] = useState<string | null>(null);
  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2();

  // Load texture
  useEffect(() => {
    if (!textureUrl) return;
    const loader = new THREE.TextureLoader();
    loader.load(textureUrl, (loadedTexture) => {
      loadedTexture.flipY = false;
      loadedTexture.wrapS = THREE.RepeatWrapping;
      loadedTexture.wrapT = THREE.RepeatWrapping;
      loadedTexture.repeat.set(sliderValue, sliderValue);
      setTexture(loadedTexture);
    });
  }, [textureUrl,sliderValue]);

  // Handle click detection
  const handleClick = (event: MouseEvent) => {
    const rect = gl.domElement.getBoundingClientRect();
    mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObject(scene, true);

    if (intersects.length > 0) {
      const clickedPart = intersects[0].object.name;
      setSelectedPart(clickedPart);
      console.log(`Clicked on: ${clickedPart}`);
    }
  };

  useEffect(() => {
    gl.domElement.addEventListener("click", handleClick);
    return () => {
      gl.domElement.removeEventListener("click", handleClick);
    };
  }, []);

  // Apply texture only to the selected part
  useEffect(() => {
    if (texture && selectedPart) {
      scene.traverse((child) => {
        if (child instanceof THREE.Mesh && child.name === selectedPart) {
          if (Array.isArray(child.material)) {
            // Handle multi-material meshes
            child.material.forEach((mat) => {
              if (mat instanceof THREE.MeshStandardMaterial) {
                mat.map = texture;
                mat.needsUpdate = true;
              }
            });
          } else if (child.material instanceof THREE.MeshStandardMaterial) {
            // Clone the material so it doesn’t affect other meshes
            child.material = child.material.clone();
            child.material.map = texture;
            child.material.needsUpdate = true;
          }
        }
      });
    }
  }, [texture, selectedPart, scene]);
  
  

  return (
    <group dispose={null}>
      <primitive object={scene} />
    </group>
  );
};

export default ModelComponent;
