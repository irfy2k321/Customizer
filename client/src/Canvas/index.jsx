import { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { Environment, Center, Html } from '@react-three/drei'
import { useSnapshot } from 'valtio'
import state from '../store'
import Shirt from './Shirt'
import Backdrop from './Backdrop'
import CameraRig from './CameraRig'
import * as THREE from 'three'

// Your Loader component is great, no changes needed.
const Loader = () => <Html center>Loading...</Html>;

// PlaceholderModel when loading fails
const PlaceholderModel = () => {
  return (
    <mesh position={[0, 0, 0]}>
      <boxGeometry args={[1, 1.5, 0.5]} />
      <meshStandardMaterial color="#666666" />
      <Html position={[0, 0, 0.3]}>
        <p style={{ color: 'white', fontSize: '8px', textAlign: 'center', width: '100px' }}>
          Model loading...
        </p>
      </Html>
    </mesh>
  )
}

const CanvasModel = () => {
  const snap = useSnapshot(state)

  return (    <Canvas
      shadows
      camera={{ position: [0, 0, 3], fov: 25 }}
      gl={{ preserveDrawingBuffer: true }}
      className="w-full h-full transition-all ease-in-out duration-500"
      title="Scroll to zoom in/out or use the zoom controls below"
      onCreated={({ gl }) => gl.setClearColor(0x000000, 0)} // Set transparent background
    >      <Suspense fallback={<Loader />}>        {/* --- Centralized, High-Quality Lighting --- */}        <ambientLight intensity={0.5} />
        <Environment preset="city" />        
        {/* Zoom hint for users on both screens */}
        <Html position={[0, -1.5, 0]} center>
          <div className="text-xs text-white/40 absolute select-none pointer-events-none animate-bounce" 
              style={{width: '180px', textAlign: 'center'}}>
            ↑ Use mouse wheel to zoom ↑
          </div>
        </Html>
        
        <CameraRig>
          {/* Backdrop is now just for shadows and background color */}
          <Backdrop />
          <Center>
            <Shirt />
          </Center>
        </CameraRig>
      </Suspense>
    </Canvas>
  )
}

export default CanvasModel