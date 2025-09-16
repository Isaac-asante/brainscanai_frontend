import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { CheckCircle, XCircle, Loader2 } from 'lucide-react'
import { testConnection } from '../../utils/api'

const ConnectionTest = () => {
  const [isTestingConnection, setIsTestingConnection] = useState(false)
  const [connectionStatus, setConnectionStatus] = useState(null)

  const handleTestConnection = async () => {
    setIsTestingConnection(true)
    setConnectionStatus(null)

    try {
      const response = await testConnection()
      setConnectionStatus({
        success: true,
        message: 'Backend connection successful!',
        details: response.data?.status || 'Connected'
      })
    } catch (error) {
      setConnectionStatus({
        success: false,
        message: 'Backend connection failed',
        details: error.response?.data?.error || error.message
      })
    } finally {
      setIsTestingConnection(false)
    }
  }

  return (
    <div className="glass-card p-6 m-4">
      <h3 className="text-lg font-semibold text-white mb-4">Backend Connection Test</h3>
      
      <div className="space-y-4">
        <div className="text-sm text-white/70">
          <p>Backend URL: <span className="text-yellow-400">http://127.0.0.1:5000</span></p>
        </div>

        <button
          onClick={handleTestConnection}
          disabled={isTestingConnection}
          className="glass-button flex items-center space-x-2"
        >
          {isTestingConnection ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Testing...</span>
            </>
          ) : (
            <span>Test Connection</span>
          )}
        </button>

        {connectionStatus && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex items-center space-x-2 p-3 rounded-lg ${
              connectionStatus.success 
                ? 'bg-green-500/20 border border-green-500/30' 
                : 'bg-red-500/20 border border-red-500/30'
            }`}
          >
            {connectionStatus.success ? (
              <CheckCircle className="w-5 h-5 text-green-400" />
            ) : (
              <XCircle className="w-5 h-5 text-red-400" />
            )}
            <div>
              <p className="text-white font-medium">{connectionStatus.message}</p>
              <p className="text-white/70 text-sm">{connectionStatus.details}</p>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}

export default ConnectionTest