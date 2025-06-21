import React, { useEffect, useState, useRef } from 'react'
import { easing } from 'maath';
import { useSnapshot } from 'valtio';
import { useFrame } from '@react-three/fiber';
import { Decal, useGLTF, useTexture } from '@react-three/drei';
import { Vector3, MeshStandardMaterial } from 'three';
import * as THREE from 'three';
import state from '../store';

// Make sure to preload the shirt model to avoid loading issues
useGLTF.preload('/shirt_baked.glb');

const Shirt = () => {
  const snap = useSnapshot(state);
  
  // Properly load the model with error handling
  const { nodes, materials } = useGLTF('/shirt_baked.glb');
  
  // Add error handling for texture loading - simplify texture loading
  const logoTexture = useTexture(snap.logoDecal);
  const fullTexture = useTexture(snap.fullDecal);
  
  // Create a reference to the shirt group
  const shirtRef = useRef();
  
  const [hovered, setHovered] = useState(false);
  const [lastInteraction, setLastInteraction] = useState(Date.now());
    // Apply anisotropy after textures are loaded - with reduced values to save texture memory
  useEffect(() => {
    if (logoTexture && fullTexture) {
      logoTexture.anisotropy = 8; // Reduced from 16
      fullTexture.anisotropy = 8; // Reduced from 16
      
      // Dispose unused mipmap levels to save memory
      logoTexture.generateMipmaps = false;
      fullTexture.generateMipmaps = false;
    }
  }, [logoTexture, fullTexture]);
  // Make sure model is loaded properly
  useEffect(() => {
    // Log to check if the model is loaded correctly
    if (nodes && materials) {
      console.log("Shirt model loaded successfully:", nodes.T_Shirt_male);
    } else {
      console.error("Failed to load shirt model");
    }
  }, [nodes, materials]);
  
  // Create more distinct material types with proper opacity
  const materialProps = {
    roughness: snap.materialType === 'glossy' ? 0.1 : snap.materialType === 'metallic' ? 0.2 : 0.7,
    metalness: snap.materialType === 'metallic' ? 0.8 : snap.materialType === 'glossy' ? 0.2 : 0,
    envMapIntensity: snap.materialType === 'metallic' ? 1 : snap.materialType === 'glossy' ? 0.5 : 0.2,
    transparent: false, // Ensure shirt is not transparent
    opacity: 1.0, // Full opacity
  };
  
  // Material update function to ensure material properties are updated properly
  useEffect(() => {
    if (materials && materials.lambert1) {
      // Update the material properties immediately upon material type change
      materials.lambert1.roughness = materialProps.roughness;
      materials.lambert1.metalness = materialProps.metalness;
      materials.lambert1.envMapIntensity = materialProps.envMapIntensity;
      materials.lambert1.transparent = materialProps.transparent;
      materials.lambert1.opacity = materialProps.opacity;
    }
  }, [snap.materialType, materials, materialProps]);
    // Automatic gentle floating animation when not interacted with
  useFrame((state, delta) => {
    // Smoothly transition colors
    if (materials && materials.lambert1) {
      easing.dampC(materials.lambert1.color, snap.color, 0.25, delta);
      
      // Directly set material properties instead of using easing.damp on primitive values
      materials.lambert1.roughness = THREE.MathUtils.lerp(
        materials.lambert1.roughness,
        materialProps.roughness,
        delta * 5
      );
      materials.lambert1.metalness = THREE.MathUtils.lerp(
        materials.lambert1.metalness,
        materialProps.metalness,
        delta * 5
      );
      materials.lambert1.envMapIntensity = THREE.MathUtils.lerp(
        materials.lambert1.envMapIntensity,
        materialProps.envMapIntensity,
        delta * 5
      );
    }    // Use the reference instead of trying to find by name
    if (shirtRef.current) {
      // Apply gentle breathing animation
      const t = state.clock.getElapsedTime();
      const breathingScale = 1 + Math.sin(t * 0.5) * 0.01;
      shirtRef.current.scale.set(breathingScale, breathingScale, breathingScale);
      
      // No auto-rotation - the model movement is now handled by CameraRig
      
      // Apply hover effect
      if (hovered) {
        easing.damp3(
          shirtRef.current.scale,
          new Vector3(1.05, 1.05, 1.05),
          0.1,
          delta
        );
      } else {
        easing.damp3(
          shirtRef.current.scale,
          new Vector3(1, 1, 1),
          0.1,
          delta
        );
      }
    }
  });

  const handlePointerOver = () => {
    setHovered(true);
    setLastInteraction(Date.now());
    document.body.style.cursor = 'grab';
  }
  const handlePointerOut = () => {
    setHovered(false);
    document.body.style.cursor = 'auto';
  }  // Generate a key for React to track state changes - explicitly include materialType
  const stateString = `${snap.color}-${snap.materialType}-${snap.isFullTexture}-${snap.isLogoTexture}`;

  return (
    <group 
      ref={shirtRef}
      key={stateString}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
      onClick={() => setLastInteraction(Date.now())}
    >
      {nodes && materials ? (
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.T_Shirt_male.geometry}          material={materials.lambert1}
          material-roughness={materialProps.roughness}
          material-metalness={materialProps.metalness}
          material-envMapIntensity={materialProps.envMapIntensity}
          material-transparent={materialProps.transparent}
          material-opacity={materialProps.opacity}
          dispose={null}
        >
          {/* Apply texture decals */}          {/* Only render one decal at a time to reduce texture usage */}
          {snap.isFullTexture ? (
            <Decal 
              position={[0, 0, 0]}
              rotation={[0, 0, 0]}
              scale={1}
              map={fullTexture}
              depthTest={false}
              depthWrite={true}
            />
          ) : snap.isLogoTexture ? (
            <Decal 
              position={[0, 0.04, 0.15]}
              rotation={[0, 0, 0]}
              scale={0.15}
              map={logoTexture}
              anisotropy={8}
              depthTest={false}
              depthWrite={true}
            />
          ) : null}
        </mesh>
      ) : (
        // Fallback if model isn't loaded
        <mesh>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial color="red" />
        </mesh>
      )}
    </group>
  );
};

export default Shirt;