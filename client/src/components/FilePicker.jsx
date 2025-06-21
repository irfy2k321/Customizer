import React, { useState } from 'react'
import CustomButton from './CustomButton'
import { motion } from 'framer-motion'

const FilePicker = ({ file, setFile, readFile, setActiveEditorTab }) => {
  const [dragActive, setDragActive] = useState(false)
  const [fileError, setFileError] = useState('')
  
  // Handle drag events
  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }
  
  // Handle file drop
  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0]
      validateAndSetFile(droppedFile)
    }
  }
  
  // Handle file selection from input
  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      validateAndSetFile(e.target.files[0])
    }
  }
  
  // Validate file type and size
  const validateAndSetFile = (file) => {
    setFileError('')
    
    // Check file type
    const validTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/svg+xml']
    if (!validTypes.includes(file.type)) {
      setFileError('Please select an image file (PNG, JPEG, SVG)')
      return
    }
    
    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setFileError('File size exceeds 5MB limit')
      return
    }
    
    setFile(file)
  }

  return (
    <div className="w-full">
      <h4 className="text-xs uppercase tracking-widest text-white/80 mb-3">Upload Texture</h4>
      
      {/* Drag & drop area */}
      <div 
        className={`
          w-full h-32 border border-dashed rounded-md flex flex-col items-center justify-center p-4 mb-4
          transition-all duration-300 relative overflow-hidden
          ${dragActive ? 'border-white bg-white/5' : 'border-white/20 hover:border-white/50'}
        `}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          id="file-upload"
          type="file"
          accept="image/png, image/jpeg, image/jpg, image/svg+xml"
          onChange={handleFileChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="text-white/50">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <polyline points="17 8 12 3 7 8" />
          <line x1="12" y1="3" x2="12" y2="15" />
        </svg>
        
        <p className="mt-2 text-sm text-center text-white/50">
          {dragActive ? 'Drop file here' : 'Drag & drop or click to browse'}
        </p>
      </div>
      
      {/* File info */}
      {fileError ? (
        <div className="text-red-400 text-xs mb-4">{fileError}</div>
      ) : file ? (
        <motion.div 
          className="flex items-center bg-[#171717] p-3 rounded-md mb-4"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="w-12 h-12 bg-[#222] rounded flex items-center justify-center mr-3">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-white/70">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <polyline points="21 15 16 10 5 21" />
            </svg>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white/90 text-sm font-medium truncate">{file.name}</p>
            <p className="text-white/50 text-xs">{(file.size / 1024).toFixed(1)} KB</p>
          </div>
          <button 
            onClick={() => setFile(null)} 
            className="ml-2 text-white/50 hover:text-white"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </motion.div>
      ) : null}
      
      {/* Action buttons */}
      <div className="flex gap-3">
        <CustomButton 
          type="outline"
          title="Apply as Logo"
          handleClick={() => {
            readFile('logo')
            setTimeout(() => setActiveEditorTab(''), 300)
          }}
          customStyles={`flex-1 py-2.5 ${!file ? 'opacity-50 cursor-not-allowed' : ''}`}
        />
        <CustomButton 
          type="filled"
          title="Apply as Texture"
          handleClick={() => {
            readFile('full')
            setTimeout(() => setActiveEditorTab(''), 300)
          }}
          customStyles={`flex-1 py-2.5 ${!file ? 'opacity-50 cursor-not-allowed' : ''}`}
        />
      </div>
      
      {/* Hint text */}
      <p className="text-[10px] text-white/40 mt-3 text-center">
        Supported formats: PNG, JPEG, SVG (max 5MB)
      </p>
    </div>
  )
}

export default FilePicker