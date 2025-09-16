import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import LoadingSpinner from '../ui/LoadingSpinner'

const PublicRoute = ({ children }) => {
  const { isAuthenticated, userRole, loading, isInitialized } = useAuth()

  // Show loading while auth is being initialized
  if (loading || !isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-gray-900 to-black">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="text-white/70 mt-4">Loading...</p>
        </div>
      </div>
    )
  }

  // Redirect authenticated users to their respective dashboards
  if (isAuthenticated) {
    const redirectTo = userRole === 'doctor' ? '/doctor-dashboard' : '/admin-dashboard'
    return <Navigate to={redirectTo} replace />
  }

  return children
}

export default PublicRoute