import { useEffect } from 'react'
import { useSnapshot } from 'valtio'
import { motion } from 'framer-motion' 

import Canvas from './Canvas/index.jsx'
import Customizer from './pages/Customizer'
import Home from './pages/Home'

import state from './store'

function App() {
  const snap = useSnapshot(state)
  
  // Track cursor for effects
  useEffect(() => {
    const handleMouseMove = (e) => {
      const x = e.clientX / window.innerWidth;
      const y = e.clientY / window.innerHeight;
      
      document.documentElement.style.setProperty('--mouse-x', x.toString());
      document.documentElement.style.setProperty('--mouse-y', y.toString());
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);
  
  return (
    <main 
      className={`app transition-all ease-in-out duration-700 ${snap.isDarkMode ? 'bg-[#0a0a0a]' : 'bg-[#f5f5f5]'}`}
    >
      {/* Background with radial gradient */}
      <div 
        className="fixed inset-0 transition-all ease-in-out duration-700 z-[-1]"
        style={{
          background: snap.isDarkMode 
            ? 'radial-gradient(circle at calc(var(--mouse-x, 0.5) * 100%) calc(var(--mouse-y, 0.5) * 100%), #101010 0%, #050505 50%)' 
            : 'radial-gradient(circle at calc(var(--mouse-x, 0.5) * 100%) calc(var(--mouse-y, 0.5) * 100%), #ffffff 0%, #f0f0f0 50%)'
        }}
      />

      {/* Conditionally render Home or Customizer */}
      {snap.intro ? <Home /> : <Customizer />}
      <div className={`${snap.intro ? 'canvas-container-home' : ''}`}>
        <Canvas />
      </div>
      
      {/* Grid overlay */}
      <div 
        className="fixed inset-0 pointer-events-none z-0 opacity-5"
        style={{ 
          backgroundImage: 'linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)',
          backgroundSize: '40px 40px'
        }} 
      />
    </main>
  )
}

export default App