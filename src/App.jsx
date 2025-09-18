import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { useConfirmDialog } from './hooks/useConfirmDialog'
import ErrorBoundary from './components/common/ErrorBoundary'
import ConnectionStatus from './components/common/ConnectionStatus'
import ProtectedRoute from './components/auth/ProtectedRoute'
import PublicRoute from './components/auth/PublicRoute'
import AuthPage from './pages/AuthPage'
import EmailVerification from './pages/EmailVerification'
import DoctorDashboard from './pages/DoctorDashboard'
import AdminDashboard from './pages/AdminDashboard'
import NotFound from './pages/NotFound'

function App() {
  const { ConfirmDialog } = useConfirmDialog()

  return (
    <ErrorBoundary>
      <AuthProvider>
        <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black">
          <ConnectionStatus />
          
          <Routes>
            {/* Public route - redirects to dashboard if authenticated */}
            <Route 
              path="/" 
              element={
                <PublicRoute>
                  <AuthPage />
                </PublicRoute>
              } 
            />
            
            {/* Email verification route */}
            <Route 
              path="/verify-email/:token" 
              element={<EmailVerification />} 
            />
            
            {/* Protected doctor route */}
            <Route 
              path="/doctor-dashboard" 
              element={
                <ProtectedRoute requiredRole="doctor">
                  <DoctorDashboard />
                </ProtectedRoute>
              } 
            />
            
            {/* Protected admin route */}
            <Route 
              path="/admin-dashboard" 
              element={
                <ProtectedRoute requiredRole="admin">
                  <AdminDashboard />
                </ProtectedRoute>
              } 
            />
            
            {/* 404 page */}
            <Route path="*" element={<NotFound />} />
          </Routes>
          
          <ConfirmDialog />
        </div>
      </AuthProvider>
    </ErrorBoundary>
  )
}

export default App