import React, { useState, useEffect } from 'react'
import { SketchPicker } from 'react-color'
import { useSnapshot } from 'valtio'
import state from '../store'

const ColorPicker = () => {
  const snap = useSnapshot(state)
  const [displayColorPicker, setDisplayColorPicker] = useState(true)
  const [presetColors, setPresetColors] = useState([
    '#FFFFFF', // White
    '#000000', // Black
    '#333333', // Dark gray
    '#CCCCCC', // Light gray
    '#0A0A0A', // Near black
    '#F5F5F5', // Near white
    '#616161', // Medium gray
    '#919191', // Silver
    '#D8D8D8', // Light silver
  ])
  
  // Recently used colors section
  const [recentColors, setRecentColors] = useState([])
  
  // When color changes, add to recent colors
  useEffect(() => {
    if (snap.color && snap.color !== '#FFFFFF') {
      // Only add if it's not already the most recent color
      if (recentColors[0] !== snap.color) {
        const updatedRecents = [snap.color, ...recentColors.filter(c => c !== snap.color)].slice(0, 5)
        setRecentColors(updatedRecents)
      }
    }
  }, [snap.color])

  return (
    <div className="w-full">
      {/* Color swatches */}
      <div className="mb-4">
        <h4 className="text-xs uppercase tracking-widest text-white/80 mb-3">Preset Colors</h4>
        <div className="grid grid-cols-5 gap-2">
          {presetColors.map((color, i) => (
            <div
              key={i}
              onClick={() => state.color = color}
              className={`
                w-full aspect-square rounded-sm cursor-pointer transition-all duration-200 relative
                ${snap.color === color ? 'ring-2 ring-white scale-110 z-10' : 'hover:scale-105'}
              `}
              style={{ backgroundColor: color }}
            />
          ))}
        </div>
      </div>
      
      {/* Recent colors */}
      {recentColors.length > 0 && (
        <div className="mb-5">
          <h4 className="text-xs uppercase tracking-widest text-white/80 mb-3">Recent Colors</h4>
          <div className="flex gap-2">
            {recentColors.map((color, i) => (
              <div
                key={i}
                onClick={() => state.color = color}
                className={`
                  w-8 h-8 rounded-sm cursor-pointer transition-all duration-200
                  ${snap.color === color ? 'ring-2 ring-white scale-110' : 'hover:scale-105'}
                `}
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
        </div>
      )}
      
      {/* Advanced color picker */}
      <div className="relative">
        <h4 className="text-xs uppercase tracking-widest text-white/80 mb-3 flex justify-between items-center">
          <span>Custom Color</span>
          <button 
            onClick={() => setDisplayColorPicker(!displayColorPicker)}
            className="text-white/50 hover:text-white text-xs"
          >
            {displayColorPicker ? 'Hide' : 'Show'}
          </button>
        </h4>
        
        {displayColorPicker && (
          <div className="mt-2">
            <SketchPicker
              color={snap.color}
              onChange={(color) => state.color = color.hex}
              disableAlpha
              presetColors={[]}
              width="100%"
              styles={{
                default: {
                  picker: {
                    background: '#0F0F0F',
                    boxShadow: 'none',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '4px',
                    width: '100%'
                  },
                  saturation: {
                    borderRadius: '2px',
                    height: '120px'
                  },
                  hue: {
                    height: '12px',
                    borderRadius: '2px',
                    marginTop: '8px',
                  },
                  input: {
                    border: '1px solid rgba(255,255,255,0.1)',
                    boxShadow: 'none',
                    fontSize: '12px',
                    height: '26px',
                    color: 'white',
                    background: '#171717'
                  },
                  hash: {
                    color: 'rgba(255,255,255,0.5)'
                  },
                  swatch: {
                    borderRadius: '2px'
                  },
                  label: {
                    color: 'rgba(255,255,255,0.6)',
                    fontSize: '11px',
                    textTransform: 'uppercase',
                    letterSpacing: '1px'
                  }
                }
              }}
            />
          </div>
        )}
      </div>
      
      {/* Current color display */}
      <div className="mt-4 flex items-center gap-3">
        <div 
          className="w-10 h-10 rounded-full border-2 border-white/20"
          style={{ backgroundColor: snap.color }}
        ></div>
        <div>
          <div className="font-mono text-sm text-white/90">{snap.color.toUpperCase()}</div>
          <div className="text-xs text-white/50">Current selection</div>
        </div>
      </div>
    </div>
  )
}

export default ColorPicker