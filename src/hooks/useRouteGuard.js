import { useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import toast from 'react-hot-toast'

export const useRouteGuard = (requiredRole = null) => {
  const { isAuthenticated, userRole, isInitialized, loading } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    // Don't run guard checks until auth is initialized
    if (!isInitialized || loading) return

    // Check authentication
    if (!isAuthenticated) {
      toast.error('Please login to access this page')
      navigate('/', { state: { from: location }, replace: true })
      return
    }

    // Check role-based access
    if (requiredRole && userRole !== requiredRole) {
      toast.error(`Access denied. ${requiredRole} privileges required.`)
      
      // Redirect to appropriate dashboard
      const correctPath = userRole === 'doctor' ? '/doctor-dashboard' : '/admin-dashboard'
      navigate(correctPath, { replace: true })
      return
    }
  }, [isAuthenticated, userRole, requiredRole, isInitialized, loading, navigate, location])

  return {
    isAuthorized: isAuthenticated && (!requiredRole || userRole === requiredRole),
    isLoading: loading || !isInitialized
  }
}