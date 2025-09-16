import React, { createContext, useContext, useState, useEffect } from 'react'
import { jwtDecode } from 'jwt-decode'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(localStorage.getItem('token'))
  const [loading, setLoading] = useState(true)
  const [isInitialized, setIsInitialized] = useState(false)

  useEffect(() => {
    initializeAuth()
  }, [])

  const initializeAuth = () => {
    const storedToken = localStorage.getItem('token')
    
    if (storedToken) {
      try {
        const decoded = jwtDecode(storedToken)
        
        // Check if token is expired
        if (decoded.exp * 1000 > Date.now()) {
          setUser(decoded)
          setToken(storedToken)
        } else {
          // Token expired, clear it
          localStorage.removeItem('token')
          setToken(null)
          setUser(null)
          toast.error('Session expired. Please login again.')
        }
      } catch (error) {
        console.error('Token decode error:', error)
        localStorage.removeItem('token')
        setToken(null)
        setUser(null)
      }
    }
    
    setLoading(false)
    setIsInitialized(true)
  }

  const login = (newToken) => {
    try {
      const decoded = jwtDecode(newToken)
      
      // Validate token structure
      if (!decoded.role || !decoded.email) {
        throw new Error('Invalid token structure')
      }
      
      localStorage.setItem('token', newToken)
      setToken(newToken)
      setUser(decoded)
      
      return { success: true, role: decoded.role }
    } catch (error) {
      console.error('Login error:', error)
      toast.error('Invalid authentication token')
      return { success: false }
    }
  }

  const logout = () => {
    localStorage.removeItem('token')
    setToken(null)
    setUser(null)
    toast.success('Logged out successfully')
  }

  const checkAuthAndRedirect = (requiredRole = null) => {
    if (!isInitialized || loading) return false
    
    if (!user || !token) {
      return false
    }
    
    if (requiredRole && user.role !== requiredRole) {
      toast.error(`Access denied. ${requiredRole} role required.`)
      return false
    }
    
    return true
  }

  const value = {
    user,
    token,
    loading,
    isInitialized,
    login,
    logout,
    checkAuthAndRedirect,
    isAuthenticated: !!user && !!token,
    isDoctor: user?.role === 'doctor',
    isAdmin: user?.role === 'admin',
    userRole: user?.role,
    userName: user?.name,
    userEmail: user?.email
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}