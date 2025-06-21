import React, { useState } from 'react'
import CustomButton from './CustomButton'
import { motion } from 'framer-motion'

const AIPicker = ({ prompt, setPrompt, generatingImg, handleSubmit, setGeneratingImg }) => {
  const [promptSuggestions] = useState([
    "A minimalist geometric pattern",
    "A futuristic cyberpunk logo",
    "Abstract black and white design",
    "A sleek modern tech logo",
    "Architectural line drawing pattern"
  ])
  
  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-xs uppercase tracking-widest text-white/80">AI Image Generator</h4>
        <span className="text-[10px] px-2 py-1 bg-amber-500/20 text-amber-400 rounded-full">Coming Soon</span>
      </div>
      
      {/* Input area */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {/* Notice banner */}
        <div className="bg-blue-500/10 border border-blue-500/30 rounded-md p-3 mb-4 flex items-start gap-3">
          <div className="text-blue-400 mt-0.5 flex-shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
          </div>
          <p className="text-xs text-blue-100">
            The AI Image Generator is currently in development and will be available soon. You can still try out the interface and prepare your prompts.
          </p>
        </div>
        
        <textarea 
          placeholder="Describe the design you want the AI to create..."
          rows={4}
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          className="w-full bg-[#171717] text-white border border-white/10 rounded-md p-3 text-sm focus:outline-none focus:ring-1 focus:ring-white/30 resize-none mb-3"
        />
        
        {/* Prompt suggestions */}
        <div className="mb-4">
          <p className="text-xs text-white/50 mb-2">Prompt suggestions:</p>
          <div className="flex flex-wrap gap-2">
            {promptSuggestions.map((suggestion, index) => (
              <button
                key={index}
                onClick={() => setPrompt(suggestion)}
                className="text-[10px] bg-[#171717] text-white/70 px-2 py-1 rounded cursor-pointer hover:bg-[#222] transition-all duration-200"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
        
        {/* Generation buttons */}
        <div className="flex gap-3">
          {generatingImg ? (
            <div className="w-full">
              <CustomButton 
                type="filled"
                title={
                  <div className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Checking status...
                  </div>
                }
                customStyles="w-full py-3 flex items-center justify-center"
              />
              <button
                onClick={() => setGeneratingImg(false)}
                className="text-xs text-white/50 mt-2 hover:text-white/80 w-full text-center"
              >
                Cancel
              </button>
            </div>
          ) : (
            <>
              <CustomButton 
                type="outline"
                title="Generate Logo"
                handleClick={() => handleSubmit('logo')}
                customStyles="flex-1 py-2.5"
              />
              <CustomButton 
                type="filled"
                title="Generate Full Design"
                handleClick={() => handleSubmit('full')}
                customStyles="flex-1 py-2.5"
              />
            </>
          )}
        </div>
      </motion.div>
      
      {/* AI Status indicator */}
      <div className="mt-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${generatingImg ? 'bg-amber-400 animate-pulse' : 'bg-white/30'}`}></div>
          <span className="text-xs text-white/50">AI {generatingImg ? 'Checking' : 'Demo Mode'}</span>
        </div>
        <span className="text-[10px] text-white/30">Powered by DALL-E</span>
      </div>
    </div>
  )
}

export default AIPicker