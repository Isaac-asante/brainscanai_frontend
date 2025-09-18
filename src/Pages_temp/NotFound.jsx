import React from 'react'
import { motion } from 'framer-motion'
import { Home, ArrowLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

const NotFound = () => {
  const navigate = useNavigate()
  const { isAuthenticated, userRole } = useAuth()

  const handleGoHome = () => {
    if (isAuthenticated) {
      const dashboardPath = userRole === 'doctor' ? '/doctor-dashboard' : '/admin-dashboard'
      navigate(dashboardPath)
    } else {
      navigate('/')
    }
  }

  const handleGoBack = () => {
    navigate(-1)
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-8">
      <div className="text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, type: 'spring' }}
          className="mb-8"
        >
          <div className="text-9xl font-bold text-yellow-400 mb-4">404</div>
          <h1 className="text-4xl font-bold text-white mb-4">Page Not Found</h1>
          <p className="text-white/70 text-lg max-w-md mx-auto mb-8">
            The page you're looking for doesn't exist or has been moved.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="space-y-4"
        >
          <button
            onClick={handleGoHome}
            className="glass-button inline-flex items-center space-x-2 px-6 py-3 mr-4"
          >
            <Home className="w-5 h-5" />
            <span>Go {isAuthenticated ? 'to Dashboard' : 'Home'}</span>
          </button>

          <button
            onClick={handleGoBack}
            className="glass-button-secondary inline-flex items-center space-x-2 px-6 py-3"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Go Back</span>
          </button>
        </motion.div>
      </div>
    </div>
  )
}

export default NotFound