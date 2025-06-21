import React, { useState, useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useSnapshot } from 'valtio'

import config from '../config/config'
import state from '../store'
import { download } from '../assets'
import { downloadCanvasToImage, reader } from '../config/helpers'
import { EditorTabs, FilterTabs, DecalTypes } from '../config/constants'
import { fadeAnimation, slideAnimation } from '../config/motion'
import { AIPicker, ColorPicker, CustomButton, FilePicker, Tab } from '../components'

const Customizer = () => {
  const snap = useSnapshot(state)

  const [file, setFile] = useState('')
  const [prompt, setPrompt] = useState('')
  const [generatingImg, setGeneratingImg] = useState(false)
  const [activeEditorTab, setActiveEditorTab] = useState('')
  const [activeFilterTab, setActiveFilterTab] = useState({ logoShirt: true, stylishShirt: false })
  
  // New state variables for enhanced features
  const [materialTypeOpen, setMaterialTypeOpen] = useState(false)
  const [historyMenuOpen, setHistoryMenuOpen] = useState(false)
  const [zoomLevel, setZoomLevel] = useState(snap.zoom)
  const [showPatterns, setShowPatterns] = useState(false)
  
  // Keep local zoom state in sync with global state
  useEffect(() => {
    setZoomLevel(snap.zoom);
  }, [snap.zoom]);

  // Generate tab content based on active editor tab
  const generateTabContent = () => {
    switch (activeEditorTab) {
      case "colorpicker":
        return (
          <motion.div
            key="colorpicker"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="absolute left-full ml-3 bg-[#0a0a0a] border border-white/20 p-5 rounded-md shadow-lg w-[260px]"
          >
            <ColorPicker />
            
            {/* Material selector */}
            <div className="mt-5">
              <h4 className="text-xs uppercase tracking-widest text-white/80 mb-3">Material Type</h4>
              <div className="grid grid-cols-3 gap-2">
                {['standard', 'glossy', 'metallic'].map((material) => (
                  <button 
                    key={material}
                    type="button" // Good practice for buttons that don't submit a form
                    onClick={() => state.materialType = material}
                    className={`
                      flex items-center justify-center /* <-- FIX 1: Use Flexbox for perfect centering */
                      py-2 px-3 text-xs text-center cursor-pointer 
                      transition-all duration-300 ease-in-out /* <-- FIX 2: Smoother transition */
                      ${snap.materialType === material 
                        ? 'bg-white text-black font-medium' /* Active state */
                        : 'bg-[#171717] text-white/70 hover:bg-[#222] hover:text-white' /* Inactive state */
                      }
                    `}
                  >
                    {material.charAt(0).toUpperCase() + material.slice(1)}
                  </button>
                ))}
              </div>
            </div>
              {/* Toggle for dark mode */}
            <div className="mt-5 flex justify-between items-center">
              <span className="text-xs uppercase tracking-widest text-white/80">Dark Mode</span>
              <div 
                onClick={() => state.isDarkMode = !state.isDarkMode}
                className={`
                  w-12 h-6 rounded-full relative cursor-pointer transition-all duration-300
                  ${snap.isDarkMode ? 'bg-white' : 'bg-[#222]'}
                `}
              >
                <div 
                  className={`
                    w-4 h-4 rounded-full absolute top-1 transition-all duration-300
                    ${snap.isDarkMode ? 'bg-black left-7' : 'bg-white left-1'}
                  `}
                ></div>              </div>            </div>
          </motion.div>
        )
      case "filepicker":
        return (
          <motion.div
            key="filepicker"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="absolute left-full ml-3 bg-[#0a0a0a] border border-white/20 rounded-md p-5 shadow-lg w-[260px]"
          >
            <FilePicker
              file={file}
              setFile={setFile}
              readFile={readFile}
              setActiveEditorTab={setActiveEditorTab}
            />
          </motion.div>
        )
      case "aipicker":
        return (
          <motion.div
            key="aipicker"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="absolute left-full ml-3 bg-[#0a0a0a] border border-white/20 rounded-md p-5 shadow-lg w-[320px]"
          >
            <AIPicker
              prompt={prompt}
              setPrompt={setPrompt}
              generatingImg={generatingImg}
              handleSubmit={handleSubmit}
              setGeneratingImg={setGeneratingImg}
            />
          </motion.div>
        )
      default:
        return null
    }
  }

  // Handle decal type tab clicks
  const handleActiveFilterTab = (tabName) => {
    switch (tabName) {
      case "logoShirt":
        state.isLogoTexture = !activeFilterTab[tabName]
        break
      case "stylishShirt":
        state.isFullTexture = !activeFilterTab[tabName]
        break
      default:
        state.isLogoTexture = true
        state.isFullTexture = false
    }

    // Update active filter tab after state changes
    setActiveFilterTab((prevState) => {
      return {
        ...prevState,
        [tabName]: !prevState[tabName]
      }    })
  }
  
  const handleSubmit = async (type) => {
    if (!prompt) return alert('Please enter a prompt')

    try {
      // Set loading state
      setGeneratingImg(true)
      
      // Simulate a short delay to show the checking state
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Create custom modal instead of using alert
      const modalContainer = document.createElement('div');
      modalContainer.className = 'fixed inset-0 z-50 flex items-center justify-center bg-black/70';
      modalContainer.style.animation = 'fadeIn 0.3s ease';
      
      // Add keyframes for animation
      const style = document.createElement('style');
      style.innerHTML = `
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
      `;
      document.head.appendChild(style);
      
      // Create modal content
      modalContainer.innerHTML = `
        <div class="bg-[#0a0a0a] border border-white/20 p-5 rounded-lg shadow-xl max-w-md w-full" style="animation: slideUp 0.4s ease">
          <div class="flex items-center gap-3 mb-4">
            <div class="bg-amber-500/20 p-2 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-amber-400">
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                <line x1="12" y1="9" x2="12" y2="13"></line>
                <line x1="12" y1="17" x2="12.01" y2="17"></line>
              </svg>
            </div>
            <h3 class="text-lg font-medium text-white">AI Generation Unavailable</h3>
          </div>
          <p class="text-white/70 mb-4">
            The AI Image Generation feature is currently in development and will be available soon. 
            In the meantime, you can upload your own images using the File Picker.
          </p>
          <div class="flex justify-end">
            <button id="closeModalBtn" class="bg-white text-black px-4 py-2 rounded hover:bg-white/90 transition-colors">
              Got it
            </button>
          </div>
        </div>
      `;
      
      document.body.appendChild(modalContainer);
      
      // Add event listener to close button
      document.getElementById('closeModalBtn').addEventListener('click', () => {
        modalContainer.style.animation = 'fadeIn 0.3s ease reverse';
        setTimeout(() => {
          document.body.removeChild(modalContainer);
          document.head.removeChild(style);
        }, 250);
      });
      
      // No need to call the backend since AI is disabled
      /*
      // Call backend to generate an AI image
      const response = await fetch('http://localhost:8080/api/v1/dalle', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          prompt,
        })
      })

      const data = await response.json()

      // Update the appropriate texture with the AI generated image
      if (data.photo) {
        if (type === 'logo') {
          state.logoDecal = `data:image/png;base64,${data.photo}`
        } else {
          state.fullDecal = `data:image/png;base64,${data.photo}`
        }
      }
      */
    } catch (error) {
      console.error('Error in AI service:', error);
      alert('Error: AI service is currently unavailable.');    } finally {
      setTimeout(() => {
        setGeneratingImg(false);
        setActiveEditorTab("");
      }, 500); // Short delay to make the transition smoother
    }
  }
  
  const readFile = (type) => {
    reader(file)
      .then((result) => {
        if (type === 'logo') {
          state.logoDecal = result
          state.isLogoTexture = true
        } else if (type === 'full') {
          state.fullDecal = result
          state.isFullTexture = true
        }
      })
      .catch((error) => {
        console.error('Error reading file:', error)
      })
      .finally(() => {
        setActiveEditorTab('')
      })
  }
  // Handle zoom controls
  const handleZoom = (direction) => {
    let newZoom = state.zoom
    
    if (direction === 'in' && state.zoom < 2) {
      newZoom = Math.min(2.0, newZoom + 0.1)
    } else if (direction === 'out' && state.zoom > 0.5) {
      newZoom = Math.max(0.5, newZoom - 0.1)
    }
    
    // Fix precision to one decimal place
    newZoom = Number(newZoom.toFixed(1))
    
    // Update the store
    state.zoom = newZoom
    
    // Update component state for UI updates
    setZoomLevel(newZoom)
  }

  return (
    <AnimatePresence>
      {!snap.intro && (
        <>
          {/* Editor tabs on left side */}
          <motion.div
            key="editor"
            className="absolute left-0 top-0 z-10 h-full py-8"
            {...slideAnimation('left')}
          >
            <div className="flex flex-col items-center h-full">
              {/* Logo/branding */}
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="mb-12"
              >
                <h3 className="text-xs font-light tracking-wider text-white/70">FABRIC<span className="font-bold">OS</span></h3>
              </motion.div>
            
              {/* Tools tabs */}
              <div className="flex flex-col gap-8 py-4 px-2 border-2 border-white/5 rounded-full">
                {EditorTabs.map((tab) => (
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    key={tab.name}
                    onClick={() => activeEditorTab === tab.name ? setActiveEditorTab('') : setActiveEditorTab(tab.name)}
                    className={`${activeEditorTab === tab.name ? 'bg-white text-black' : 'bg-[#111] text-white/70'} 
                      w-10 h-10 rounded-full flex items-center justify-center cursor-pointer transition-all duration-200`}
                  >
                    <img 
                      src={tab.icon} 
                      alt={tab.name} 
                      className={`${activeEditorTab === tab.name ? 'filter invert' : ''} w-5 h-5 object-contain`} 
                    />
                  </motion.div>
                ))}
                  {/* Additional control buttons */}
                {/* Reset button */}
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => { 
                    state.color = "#FFFFFF"
                    state.isLogoTexture = true
                    state.isFullTexture = false
                    state.logoDecal = "./threejs.png"
                    state.fullDecal = "./threejs.png"
                    state.materialType = 'standard'
                    state.zoom = 1
                  }}
                  className="bg-[#111] text-white/70 w-10 h-10 rounded-full flex items-center justify-center cursor-pointer transition-all duration-200"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                    <polyline points="9 22 9 12 15 12 15 22"/>
                  </svg>
                </motion.div>
              </div>
              
              {/* Tab content */}
              {generateTabContent()}
            </div>
          </motion.div>
          
          {/* Bottom filter tabs */}
          <motion.div
            className="absolute bottom-5 right-0 left-0 z-10 flex justify-center"
            {...slideAnimation('up')}
          >
            <div className="flex gap-6 items-center">
              {/* Zoom controls */}
              <motion.div 
                className="flex items-center gap-2 bg-[#111] px-3 py-1.5 rounded-full"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
              >
                <button 
                  onClick={() => handleZoom('out')}
                  className={`text-white/70 hover:text-white transition-all ${state.zoom <= 0.5 ? 'opacity-50 cursor-not-allowed' : ''}`}
                  disabled={state.zoom <= 0.5}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="11" cy="11" r="8"/>
                    <line x1="21" x2="16.65" y1="21" y2="16.65"/>
                    <line x1="8" x2="14" y1="11" y2="11"/>
                  </svg>
                </button>
                <span className="text-xs text-white/80 w-6 text-center">{state.zoom.toFixed(1)}x</span>
                <button 
                  onClick={() => handleZoom('in')}
                  className={`text-white/70 hover:text-white transition-all ${state.zoom >= 2 ? 'opacity-50 cursor-not-allowed' : ''}`}
                  disabled={state.zoom >= 2}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="11" cy="11" r="8"/>
                    <line x1="21" x2="16.65" y1="21" y2="16.65"/>
                    <line x1="11" x2="11" y1="8" y2="14"/>
                    <line x1="8" x2="14" y1="11" y2="11"/>
                  </svg>
                </button>
              </motion.div>
              
              {/* Filter tabs */}
              {FilterTabs.map((tab) => (
                <div
                  key={tab.name}
                  onClick={() => handleActiveFilterTab(tab.name)}
                  className={`${activeFilterTab[tab.name] ? 'bg-white text-black' : 'bg-[#171717]'} 
                    px-6 py-2.5 rounded-full cursor-pointer flex items-center justify-center gap-2 transition-all duration-300`}
                >
                  <img 
                    src={tab.icon} 
                    alt={tab.name}
                    className={`${activeFilterTab[tab.name] ? 'filter invert' : ''} w-4 h-4 object-contain`}
                  />
                  <span className="text-xs font-light tracking-wider">
                    {tab.name === "logoShirt" ? "Logo" : "Pattern"}
                  </span>
                </div>
              ))}
              
              {/* Download button */}
              <motion.div
                whileTap={{ scale: 0.9 }}
                onClick={downloadCanvasToImage}
                className="bg-white text-black px-6 py-2.5 rounded-full flex items-center gap-2 cursor-pointer hover:bg-gray-200 transition-all duration-300"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.5 }}
              >
                <img src={download} alt="download" className="w-4 h-4 object-contain filter invert" />
                <span className="text-xs font-light tracking-wider">Export</span>
              </motion.div>
            </div>
          </motion.div>
          
          {/* Back button */}
          <motion.div
            className="absolute top-5 right-5 z-10"
            {...fadeAnimation}
          >
            <CustomButton 
              type="filled"
              title="← Back"
              handleClick={() => state.intro = true}
              customStyles="px-4 py-2.5 font-light text-xs tracking-widest border border-white hover:bg-white hover:text-black transition-all duration-200"
            />
          </motion.div>
        </>
      )}    </AnimatePresence>
  )
}

export default Customizer;