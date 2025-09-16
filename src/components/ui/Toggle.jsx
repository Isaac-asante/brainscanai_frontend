import React from 'react'
import { motion } from 'framer-motion'

const Toggle = ({ isOn, onToggle, leftLabel, rightLabel }) => {
  return (
    <div className="flex items-center justify-center">
      <div className="relative inline-flex items-center bg-white/10 backdrop-blur-sm rounded-full p-1 border border-white/20">
        {/* Background slider */}
        <motion.div
          className="absolute top-1 bottom-1 bg-yellow-400 rounded-full shadow-lg"
          initial={false}
          animate={{
            left: isOn ? '50%' : '4px',
            right: isOn ? '4px' : '50%',
          }}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        />
        
        {/* Left option */}
        <button
          type="button"
          onClick={() => !isOn && onToggle()}
          className={`relative z-10 px-6 py-2 text-sm font-medium rounded-full transition-all duration-200 ${
            !isOn 
              ? 'text-black' 
              : 'text-white/70 hover:text-white'
          }`}
        >
          {leftLabel}
        </button>
        
        {/* Right option */}
        <button
          type="button"
          onClick={() => isOn && onToggle()}
          className={`relative z-10 px-6 py-2 text-sm font-medium rounded-full transition-all duration-200 ${
            isOn 
              ? 'text-black' 
              : 'text-white/70 hover:text-white'
          }`}
        >
          {rightLabel}
        </button>
      </div>
    </div>
  )
}

export default Toggle