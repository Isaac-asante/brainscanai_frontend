import React, { forwardRef, useState } from 'react'
import { Eye, EyeOff, AlertCircle, CheckCircle } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const Input = forwardRef(({
  type = 'text',
  label,
  placeholder,
  error,
  success,
  icon: Icon,
  className = '',
  disabled = false,
  required = false,
  hint,
  showPasswordToggle = false,
  ...props
}, ref) => {
  const [showPassword, setShowPassword] = useState(false)
  const [isFocused, setIsFocused] = useState(false)

  const inputType = showPasswordToggle && showPassword ? 'text' : type

  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-white/80">
          {label}
          {required && <span className="text-red-400 ml-1">*</span>}
        </label>
      )}
      
      <div className="relative">
        {Icon && (
          <Icon className={`absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 transition-colors ${
            error ? 'text-red-400' :
            success ? 'text-green-400' :
            isFocused ? 'text-yellow-400' : 'text-white/50'
          }`} />
        )}
        
        <input
          ref={ref}
          type={inputType}
          placeholder={placeholder}
          disabled={disabled}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className={`
            glass-input w-full text-base transition-all duration-300
            ${Icon ? 'pl-12' : 'pl-4'}
            ${showPasswordToggle || error || success ? 'pr-12' : 'pr-4'}
            ${error ? 'border-red-500/50 focus:ring-red-500' : ''}
            ${success ? 'border-green-500/50 focus:ring-green-500' : ''}
            ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
          `}
          {...props}
        />
        
        {/* Password Toggle */}
        {showPasswordToggle && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white/50 hover:text-white transition-colors"
            tabIndex={-1}
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        )}
        
        {/* Status Icons */}
        {(error || success) && !showPasswordToggle && (
          <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
            {error ? (
              <AlertCircle className="w-4 h-4 text-red-400" />
            ) : success ? (
              <CheckCircle className="w-4 h-4 text-green-400" />
            ) : null}
          </div>
        )}
      </div>
      
      {/* Error/Success/Hint Messages */}
      <AnimatePresence mode="wait">
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="text-red-400 text-sm flex items-center space-x-1"
          >
            <AlertCircle className="w-3 h-3" />
            <span>{error}</span>
          </motion.p>
        )}
        
        {success && !error && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="text-green-400 text-sm flex items-center space-x-1"
          >
            <CheckCircle className="w-3 h-3" />
            <span>{success}</span>
          </motion.p>
        )}
        
        {hint && !error && !success && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="text-white/50 text-xs"
          >
            {hint}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  )
})

Input.displayName = 'Input'

export default Input