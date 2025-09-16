import React from 'react'

const LoadingSpinner = ({ size = 'md' }) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  }

  return (
    <div className={`${sizeClasses[size]} animate-spin rounded-full border-2 border-glass-yellow border-t-transparent`}>
    </div>
  )
}

export default LoadingSpinner