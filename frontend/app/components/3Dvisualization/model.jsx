

import React, { useRef } from 'react'
import { useGLTF } from '@react-three/drei'

export function Model1(props) {
  const { nodes, materials } = useGLTF('/model1.glb')
  return (
    <group {...props} dispose={null}>
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Cloth_mesh.geometry}
        material={materials['FABRIC 1_2509']}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Cloth_mesh_1.geometry}
        material={materials['FABRIC 1_2509']}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Cloth_mesh_2.geometry}
        material={materials['FABRIC 1_2509']}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Cloth_mesh_3.geometry}
        material={materials['FABRIC 1_2509']}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Cloth_mesh_4.geometry}
        material={materials['FABRIC 1_2509']}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Cloth_mesh_5.geometry}
        material={materials['FABRIC 1_2509']}
      />
      <primitive object={nodes.Joint} />
      <skinnedMesh
        geometry={nodes.body_2.geometry}
        material={materials['Mara:face2']}
        skeleton={nodes.body_2.skeleton}
      />
      <skinnedMesh
        geometry={nodes.body_3.geometry}
        material={materials['Mara:body3']}
        skeleton={nodes.body_3.skeleton}
      />
      <skinnedMesh
        geometry={nodes.body_4.geometry}
        material={materials['Mara:arm2']}
        skeleton={nodes.body_4.skeleton}
      />
      <skinnedMesh
        geometry={nodes.body_5.geometry}
        material={materials['Mara:leg2']}
        skeleton={nodes.body_5.skeleton}
      />
      <skinnedMesh
        geometry={nodes.eye_L_1.geometry}
        material={materials['Mara:eye2']}
        skeleton={nodes.eye_L_1.skeleton}
      />
      <skinnedMesh
        geometry={nodes.eye_R_1.geometry}
        material={materials['Mara:eye2']}
        skeleton={nodes.eye_R_1.skeleton}
      />
      <skinnedMesh
        geometry={nodes.eyelash_L_1.geometry}
        material={materials['Mara:skin_14:skin_13:skin_11:skin_10:pose:pose:eyelash1']}
        skeleton={nodes.eyelash_L_1.skeleton}
      />
      <skinnedMesh
        geometry={nodes.eyelash_R_1.geometry}
        material={materials['Mara:skin_14:skin_13:skin_11:skin_10:pose:pose:eyelash1']}
        skeleton={nodes.eyelash_R_1.skeleton}
      />
      <skinnedMesh
        geometry={nodes.tooth_.geometry}
        material={materials['Mara:tooth2']}
        skeleton={nodes.tooth_.skeleton}
      />
    </group>
  )
}

useGLTF.preload('/model1.glb')