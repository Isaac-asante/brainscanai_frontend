import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { CheckCircle, XCircle, Loader2 } from 'lucide-react'
import { authAPI } from '../utils/api'

const EmailVerification = () => {
  const { token } = useParams()
  const navigate = useNavigate()
  const [verificationState, setVerificationState] = useState('verifying') // 'verifying', 'success', 'error'
  const [message, setMessage] = useState('')

  useEffect(() => {
    verifyEmail()
  }, [token])

  const verifyEmail = async () => {
    try {
      const response = await authAPI.verifyEmail(token)
      setVerificationState('success')
      setMessage(response.data.message || 'Email verified successfully!')
      
      // Redirect to login after 3 seconds
      setTimeout(() => {
        navigate('/')
      }, 3000)
    } catch (error) {
      setVerificationState('error')
      setMessage(error.response?.data?.error || 'Email verification failed')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-8 bg-gradient-to-br from-black via-gray-900 to-black">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-card p-8 w-full max-w-md text-center"
      >
        {verificationState === 'verifying' && (
          <>
            <Loader2 className="w-16 h-16 animate-spin text-yellow-400 mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-white mb-4">Verifying Email</h2>
            <p className="text-white/70">Please wait while we verify your email address...</p>
          </>
        )}

        {verificationState === 'success' && (
          <>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring' }}
              className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6"
            >
              <CheckCircle className="w-10 h-10 text-white" />
            </motion.div>
            <h2 className="text-2xl font-bold text-white mb-4">Email Verified!</h2>
            <p className="text-white/80 mb-6">{message}</p>
            <div className="bg-green-500/20 border border-green-500/30 rounded-lg p-4">
              <p className="text-green-400 text-sm">
                Redirecting to login in 3 seconds...
              </p>
            </div>
          </>
        )}

        {verificationState === 'error' && (
          <>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring' }}
              className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-6"
            >
              <XCircle className="w-10 h-10 text-white" />
            </motion.div>
            <h2 className="text-2xl font-bold text-white mb-4">Verification Failed</h2>
            <p className="text-white/80 mb-6">{message}</p>
            <button
              onClick={() => navigate('/')}
              className="glass-button w-full"
            >
              Go to Login
            </button>
          </>
        )}
      </motion.div>
    </div>
  )
}

export default EmailVerification