import { useState, useEffect } from 'react'
import { testConnection } from '../utils/api'

export const useConnectionStatus = (checkInterval = 30000) => {
  const [isOnline, setIsOnline] = useState(navigator.onLine)
  const [isBackendConnected, setIsBackendConnected] = useState(true)
  const [lastChecked, setLastChecked] = useState(null)

  useEffect(() => {
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  const checkBackendConnection = async () => {
    if (!isOnline) {
      setIsBackendConnected(false)
      return
    }

    try {
      await testConnection()
      setIsBackendConnected(true)
      setLastChecked(new Date())
    } catch (error) {
      setIsBackendConnected(false)
      setLastChecked(new Date())
    }
  }

  useEffect(() => {
    checkBackendConnection()
    
    const interval = setInterval(checkBackendConnection, checkInterval)
    
    return () => clearInterval(interval)
  }, [isOnline, checkInterval])

  return {
    isOnline,
    isBackendConnected,
    lastChecked,
    checkConnection: checkBackendConnection,
    isFullyConnected: isOnline && isBackendConnected
  }
}