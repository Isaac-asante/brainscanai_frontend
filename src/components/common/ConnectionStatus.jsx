import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Wifi, WifiOff, ServerCrash, RefreshCw } from 'lucide-react'
import { useConnectionStatus } from '../../hooks/useConnectionStatus'

const ConnectionStatus = () => {
  const { isOnline, isBackendConnected, isFullyConnected, checkConnection } = useConnectionStatus()

  if (isFullyConnected) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -50 }}
        className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50"
      >
        <div className={`glass-card px-4 py-3 flex items-center space-x-3 ${
          !isOnline ? 'border-red-500/50' : 'border-yellow-500/50'
        }`}>
          {!isOnline ? (
            <>
              <WifiOff className="w-5 h-5 text-red-400" />
              <span className="text-red-400 font-medium text-sm">No Internet Connection</span>
            </>
          ) : !isBackendConnected ? (
            <>
              <ServerCrash className="w-5 h-5 text-yellow-400" />
              <span className="text-yellow-400 font-medium text-sm">Server Disconnected</span>
              <button
                onClick={checkConnection}
                className="p-1 hover:bg-white/10 rounded transition-colors"
                title="Retry Connection"
              >
                <RefreshCw className="w-4 h-4 text-yellow-400" />
              </button>
            </>
          ) : null}
        </div>
      </motion.div>
    </AnimatePresence>
  )
}

export default ConnectionStatus