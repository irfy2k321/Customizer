import React from 'react'
import { useSnapshot } from 'valtio'
import state from '../store'
import { motion } from 'framer-motion'

const Tab = ({ tab, isFilterTab, isActiveTab, handleClick }) => {
  const snap = useSnapshot(state)

  // Generate dynamic styles based on tab state and type
  const generateStyles = () => {
    if (isFilterTab && isActiveTab) {
      return { 
        backgroundColor: snap.isDarkMode ? '#FFFFFF' : snap.color,
        color: snap.isDarkMode ? '#000000' : '#FFFFFF',
      }
    }
    
    return { 
      backgroundColor: snap.isDarkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)',
      color: snap.isDarkMode ? '#FFFFFF' : '#000000',
    }
  }

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={handleClick}
      className={`
        cursor-pointer flex items-center justify-center transition-all duration-200
        ${isFilterTab ? 
          'rounded-full w-14 h-14 shadow-sm' : 
          'rounded-lg w-12 h-12'}
      `}
      style={generateStyles()}
    >
      <motion.img 
        src={tab.icon}
        alt={tab.name}
        className={`
          ${isActiveTab ? 'scale-110' : 'scale-100'}
          ${(isFilterTab && isActiveTab && snap.isDarkMode) ? 'filter invert' : ''}
          w-1/2 h-1/2 object-contain transition-all duration-200
        `}
        animate={{ rotate: isActiveTab ? 360 : 0 }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
      />
      
      {/* Add a subtle animated ring for active tabs */}
      {isActiveTab && (
        <motion.div 
          className={`absolute inset-0 rounded-full border-2 ${isFilterTab ? 'rounded-full' : 'rounded-lg'}`}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          style={{ 
            borderColor: snap.isDarkMode ? '#FFFFFF' : snap.color,
          }}
        />
      )}
    </motion.div>
  )
}

export default Tab