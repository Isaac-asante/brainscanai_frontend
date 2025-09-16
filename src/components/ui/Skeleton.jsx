import React from 'react'
import { motion } from 'framer-motion'

export const SkeletonCard = ({ className = "" }) => (
  <div className={`glass-card p-6 ${className}`}>
    <div className="animate-pulse">
      <div className="flex items-center space-x-3 mb-4">
        <div className="w-10 h-10 bg-white/10 rounded-lg"></div>
        <div className="space-y-2 flex-1">
          <div className="h-4 bg-white/10 rounded w-1/3"></div>
          <div className="h-3 bg-white/5 rounded w-1/2"></div>
        </div>
      </div>
      <div className="space-y-3">
        <div className="h-3 bg-white/5 rounded"></div>
        <div className="h-3 bg-white/5 rounded w-3/4"></div>
      </div>
    </div>
  </div>
)

export const SkeletonTable = ({ rows = 5 }) => (
  <div className="glass-card p-6">
    <div className="animate-pulse">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-white/10 rounded-lg"></div>
          <div className="space-y-2">
            <div className="h-4 bg-white/10 rounded w-32"></div>
            <div className="h-3 bg-white/5 rounded w-24"></div>
          </div>
        </div>
        <div className="h-8 bg-white/10 rounded w-24"></div>
      </div>
      
      <div className="space-y-3">
        {Array.from({ length: rows }).map((_, index) => (
          <div key={index} className="bg-white/5 border border-white/10 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4 flex-1">
                <div className="w-6 h-6 bg-white/10 rounded-full"></div>
                <div className="space-y-2 flex-1">
                  <div className="h-3 bg-white/10 rounded w-1/4"></div>
                  <div className="h-2 bg-white/5 rounded w-1/3"></div>
                </div>
              </div>
              <div className="w-8 h-8 bg-white/10 rounded"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
)

export const SkeletonStats = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
    {Array.from({ length: 6 }).map((_, index) => (
      <motion.div
        key={index}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: index * 0.1 }}
        className="glass-card p-6"
      >
        <div className="animate-pulse">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-white/10 rounded-lg"></div>
            <div className="w-4 h-4 bg-white/5 rounded-full"></div>
          </div>
          <div className="space-y-2">
            <div className="h-8 bg-white/10 rounded w-16"></div>
            <div className="h-4 bg-white/5 rounded w-24"></div>
            <div className="h-3 bg-white/5 rounded w-20"></div>
          </div>
        </div>
      </motion.div>
    ))}
  </div>
)