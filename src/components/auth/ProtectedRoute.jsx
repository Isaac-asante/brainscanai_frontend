import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import LoadingSpinner from '../ui/LoadingSpinner'

const ProtectedRoute = ({ children, requiredRole = null, redirectTo = '/' }) => {
  const { isAuthenticated, userRole, loading, isInitialized } = useAuth()
  const location = useLocation()

  // Show loading while auth is being initialized
  if (loading || !isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-gray-900 to-black">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="text-white/70 mt-4">Verifying authentication...</p>
        </div>
      </div>
    )
  }

  // Check if user is authenticated
  if (!isAuthenticated) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />
  }

  // Check role-based access
  if (requiredRole && userRole !== requiredRole) {
    const correctRedirect = userRole === 'doctor' ? '/doctor-dashboard' : '/admin-dashboard'
    return <Navigate to={correctRedirect} replace />
  }

  return children
}

export default ProtectedRoute