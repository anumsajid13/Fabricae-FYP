import React, { useEffect, useState } from "react";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";

interface ModelComponentProps {
  modelUrl: string;
  textureUrl: string; 
}

const ModelComponent: React.FC<ModelComponentProps> = ({ modelUrl, textureUrl }) => {
  const { scene, nodes } = useGLTF(modelUrl);
  const [texture, setTexture] = useState<THREE.Texture | null>(null);

  useEffect(() => {
    const loader = new THREE.TextureLoader();
    loader.load(textureUrl, (loadedTexture) => {
      loadedTexture.wrapS = THREE.RepeatWrapping;
      loadedTexture.wrapT = THREE.RepeatWrapping;
      loadedTexture.repeat.set(3, 3); 

      setTexture(loadedTexture);
    });
  }, [textureUrl]);

  useEffect(() => {
    if (texture) {
     
      const clothNodeNames = ["Cloth_mesh_1", "Cloth_mesh_2"]; 

      clothNodeNames.forEach((nodeName) => {
        const node = nodes[nodeName];
        if (node instanceof THREE.Mesh) {
          if (node.material instanceof THREE.MeshStandardMaterial) {
            node.material.map = texture; 
            node.material.needsUpdate = true; 
            node.material.color = new THREE.Color(1.0, 1.0, 1.0),
            node.material.roughness = 0.4,
            node.material.metalness = 0.1
            
          } else {
           
            node.material = new THREE.MeshStandardMaterial({
              map: texture,
              side: THREE.DoubleSide,
            });
          }
        }
      });
    }
  }, [texture, nodes]);

  return (
    
    <group dispose={null}>
      <primitive object={scene} />
    </group>
  );
};

export default ModelComponent;
