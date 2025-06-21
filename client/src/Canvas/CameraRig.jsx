// src/canvas/CameraRig.jsx

import { useRef, useState, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { easing } from 'maath';
import { useSnapshot } from 'valtio';
import state from '../store';

const CameraRig = ({ children }) => {
  const group = useRef();
  const snap = useSnapshot(state);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const { gl, camera } = useThree();
  // Handle mouse wheel for zoom
  useEffect(() => {
    const handleWheel = (e) => {
      // Allow zooming on both home and customizer screens
      
      // Prevent default behavior (page scrolling)
      e.preventDefault();
      
      // Calculate new zoom level
      // Negative delta means zoom in, positive means zoom out
      const zoomSpeed = 0.1;
      const newZoom = Math.max(0.5, Math.min(2.0, snap.zoom + (e.deltaY > 0 ? -zoomSpeed : zoomSpeed)));
      
      // Update the zoom state
      state.zoom = newZoom;
    };

    // Add wheel event listener to the canvas element
    const canvas = gl.domElement;
    canvas.addEventListener('wheel', handleWheel, { passive: false });
    
    return () => {
      canvas.removeEventListener('wheel', handleWheel);
    };
  }, [gl, snap.intro, snap.zoom]);

  // Get mouse position from CSS variables for subtle movement
  useEffect(() => {
    const updateMousePosition = () => {
      const x = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--mouse-x') || '0.5');
      const y = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--mouse-y') || '0.5');
      setMousePosition({ x, y });
    };

    // Update immediately and then on mousemove
    updateMousePosition();
    window.addEventListener('mousemove', updateMousePosition);
    return () => window.removeEventListener('mousemove', updateMousePosition);
  }, []);

  useFrame((state, delta) => {
    const isMobile = window.innerWidth <= 600;
      // Define target position and scale
    let targetPosition = [0, 0, 2];
    let targetScale = [1, 1, 1];
    
    // Apply zoom to both home and customizer screens
    const zoomScale = snap.zoom;

    if (snap.intro) {
      // Home page: Move camera left, make shirt bigger
      // Apply zoom level to z position (closer/further), but maintain left offset
      targetPosition = [-0.4, 0, 2 / snap.zoom];
      
      // Base scale is larger on home screen, but also affected by zoom
      targetScale = [1.25 * zoomScale, 1.25 * zoomScale, 1.25 * zoomScale];
    } else {
      // Customizer page: Center camera, normal size
      // Apply zoom level to z position (closer/further)
      targetPosition = [0, 0, 2 / snap.zoom];
      
      // Apply zoom to model scale
      targetScale = [zoomScale, zoomScale, zoomScale];
    }

    // Set model camera position
    easing.damp3(state.camera.position, targetPosition, 0.25, delta);
      // Set model scale
    if(group.current) {
      easing.damp3(group.current.scale, targetScale, 0.25, delta);
        
      // Apply mouse-based movement on both home and customizer screens
      // Adjust intensity based on which screen we're on
      const intensityFactor = snap.intro ? 0.3 : 1.0; // Subtler movement on home screen
      
      // Convert from 0-1 range to rotational values, scaled by intensity factor
      const rotX = (mousePosition.y - 0.5) * -0.52 * intensityFactor; 
      const rotY = (mousePosition.x - 0.5) * 0.52 * intensityFactor;  
      
      // Apply rotation based on mouse position
      group.current.rotation.x += (rotX - group.current.rotation.x) * 0.05; // Slowed down response for smoother movement
      group.current.rotation.y += (rotY - group.current.rotation.y) * 0.05;
    }
  });

  return <group ref={group}>{children}</group>;
};

export default CameraRig;