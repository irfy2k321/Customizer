import React from 'react'
import { useSnapshot } from 'valtio'
import state from '../store'
import { getContrastingColor } from '../config/helpers'
import { motion } from 'framer-motion'

const CustomButton = ({ type, title, customStyles, handleClick }) => {
  const snap = useSnapshot(state)
  
  // Generate appropriate styles based on button type
  const generateStyle = (type) => {
    if (type === 'filled') {
      return {
        backgroundColor: snap.color,
        color: getContrastingColor(snap.color),
      }
    } else if (type === 'outline') {
      return {
        backgroundColor: 'transparent',
        borderWidth: '1px',
        borderColor: snap.color,
        color: snap.color,
      }
    } else if (type === 'ghost') {
      return {
        backgroundColor: 'transparent',
        color: snap.isDarkMode ? '#FFFFFF' : '#000000',
      }
    }
  }

  return (
    <motion.button 
      className={`relative group px-4 py-2 text-xs rounded-md ${customStyles}`}
      style={generateStyle(type)}
      onClick={handleClick}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.2, ease: 'easeInOut' }}
    >
      {/* Button text with animated underline for ghost buttons */}
      {type === 'ghost' ? (
        <span className="relative">
          {title}
          <span className="absolute bottom-0 left-0 w-0 h-px bg-current group-hover:w-full transition-all duration-300"></span>
        </span>
      ) : (
        title
      )}
      
      {/* Add subtle hover effect for filled buttons */}
      {type === 'filled' && (
        <span className="absolute inset-0 w-full h-full bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-md pointer-events-none"></span>
      )}
    </motion.button>
  )
}

export default CustomButton