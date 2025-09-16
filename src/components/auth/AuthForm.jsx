import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Eye, EyeOff, User, Mail, Lock, Stethoscope, Shield, Key, CheckCircle, Clock, RefreshCw } from 'lucide-react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { authAPI } from '../../utils/api'
import { useAuth } from '../../contexts/AuthContext'
import LoadingSpinner from '../ui/LoadingSpinner'
import Toggle from '../ui/Toggle'

const AuthForm = () => {
  const [isLogin, setIsLogin] = useState(true)
  const [isDoctor, setIsDoctor] = useState(true)
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [registrationState, setRegistrationState] = useState('form') // 'form', 'doctor-waiting', 'admin-success'
  const [registeredEmail, setRegisteredEmail] = useState('')
  
  const { login } = useAuth()
  
  const { register, handleSubmit, formState: { errors }, reset } = useForm()

  const onSubmit = async (data) => {
    setLoading(true)
    try {
      let response
      
      if (isLogin) {
        // Login logic
        if (isDoctor) {
          response = await authAPI.login({
            email: data.email,
            password: data.password
          })
        } else {
          response = await authAPI.adminLogin({
            email: data.email,
            password: data.password,
            admin_token: data.admin_token
          })
        }
        
        const loginResult = login(response.data.token)
        
        if (loginResult.success) {
          toast.success(`Welcome back, ${isDoctor ? 'Doctor' : 'Admin'}!`)
        }
      } else {
        // Registration logic
        if (isDoctor) {
          response = await authAPI.register({
            name: data.name,
            email: data.email,
            password: data.password
          })
          
          toast.success('Registration successful! Please check your email to verify your account.')
          setRegisteredEmail(data.email)
          setRegistrationState('doctor-waiting')
          reset()
        } else {
          response = await authAPI.adminRegister({
            name: data.name,
            email: data.email,
            password: data.password,
            admin_token: data.admin_token
          })
          
          toast.success('Admin registration successful! You can now login.')
          setRegistrationState('admin-success')
          // Auto switch to login mode after 3 seconds
          setTimeout(() => {
            setIsLogin(true)
            setRegistrationState('form')
            reset()
          }, 3000)
        }
      }
    } catch (error) {
      // Error handling is done in API interceptor
      console.error('Auth error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleBackToForm = () => {
    setRegistrationState('form')
    setIsLogin(true)
    reset()
  }

  const handleResendVerification = async () => {
    if (!registeredEmail) return
    
    setLoading(true)
    try {
      await authAPI.register({
        email: registeredEmail,
        // This will resend verification (assuming backend supports it)
      })
      toast.success('Verification email resent!')
    } catch (error) {
      toast.error('Failed to resend verification email')
    } finally {
      setLoading(false)
    }
  }

  // Doctor Email Verification Waiting Screen
  if (registrationState === 'doctor-waiting') {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-card p-8 w-full max-w-md mx-auto text-center"
      >
        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="mx-auto w-16 h-16 bg-yellow-400 rounded-full flex items-center justify-center mb-6"
        >
          <Mail className="w-8 h-8 text-black" />
        </motion.div>

        <h2 className="text-2xl font-bold text-white mb-4">Check Your Email</h2>
        <p className="text-white/80 mb-2">
          We've sent a verification link to:
        </p>
        <p className="text-yellow-400 font-medium mb-6">{registeredEmail}</p>
        
        <div className="bg-blue-500/20 border border-blue-500/30 rounded-lg p-4 mb-6">
          <div className="flex items-center space-x-2 mb-2">
            <Clock className="w-5 h-5 text-blue-400" />
            <span className="text-blue-400 font-medium">Next Steps:</span>
          </div>
          <ol className="text-white/80 text-sm space-y-1 text-left">
            <li>1. Check your email inbox</li>
            <li>2. Click the verification link</li>
            <li>3. Return here to login</li>
          </ol>
        </div>

        <div className="space-y-3">
          <button
            onClick={handleResendVerification}
            disabled={loading}
            className="glass-button-secondary w-full flex items-center justify-center space-x-2"
          >
            {loading ? (
              <LoadingSpinner size="sm" />
            ) : (
              <>
                <RefreshCw className="w-4 h-4" />
                <span>Resend Email</span>
              </>
            )}
          </button>

          <button
            onClick={handleBackToForm}
            className="text-yellow-400 hover:text-yellow-300 transition-colors text-sm"
          >
            Back to Login
          </button>
        </div>
      </motion.div>
    )
  }

  // Admin Registration Success Screen
  if (registrationState === 'admin-success') {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-card p-8 w-full max-w-md mx-auto text-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring' }}
          className="mx-auto w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mb-6"
        >
          <CheckCircle className="w-8 h-8 text-white" />
        </motion.div>

        <h2 className="text-2xl font-bold text-white mb-4">Registration Successful!</h2>
        <p className="text-white/80 mb-6">
          Your admin account has been created successfully. You can now login with your credentials.
        </p>

        <div className="bg-green-500/20 border border-green-500/30 rounded-lg p-4 mb-6">
          <p className="text-green-400 text-sm">
            Redirecting to login in 3 seconds...
          </p>
        </div>

        <button
          onClick={handleBackToForm}
          className="glass-button w-full"
        >
          Continue to Login
        </button>
      </motion.div>
    )
  }

  // Main Auth Form
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="glass-card p-8 w-full max-w-md mx-auto"
    >
      {/* Header */}
      <div className="text-center mb-8">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring' }}
          className="mx-auto w-16 h-16 bg-yellow-400 rounded-full flex items-center justify-center mb-4"
        >
          {isDoctor ? (
            <Stethoscope className="w-8 h-8 text-black" />
          ) : (
            <Shield className="w-8 h-8 text-black" />
          )}
        </motion.div>
        
        <h2 className="text-2xl font-bold text-white mb-2">
          {isLogin ? 'Welcome Back' : 'Create Account'}
        </h2>
        
        <p className="text-white/70">
          {isLogin 
            ? `Sign in to your ${isDoctor ? 'doctor' : 'admin'} account`
            : `Register as a ${isDoctor ? 'doctor' : 'admin'}`
          }
        </p>
      </div>

      {/* Role Toggle */}
      <div className="flex justify-center mb-6">
        <Toggle
          isOn={!isDoctor}
          onToggle={() => setIsDoctor(!isDoctor)}
          leftLabel="Doctor"
          rightLabel="Admin"
        />
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Name field (only for registration) */}
        <AnimatePresence>
          {!isLogin && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
            >
              <div className="relative">
                <User className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/50" />
                <input
                  {...register('name', { 
                    required: 'Name is required',
                    minLength: { value: 2, message: 'Name must be at least 2 characters' }
                  })}
                  type="text"
                  placeholder="Full Name"
                  className="glass-input w-full pl-12 pr-4 py-3 text-base"
                />
              </div>
              {errors.name && (
                <p className="text-red-400 text-sm mt-1">{errors.name.message}</p>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Email field */}
        <div className="relative">
          <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/50" />
          <input
            {...register('email', { 
              required: 'Email is required',
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'Invalid email address'
              }
            })}
            type="email"
            placeholder="Email Address"
            className="glass-input w-full pl-12 pr-4 py-3 text-base"
          />
        </div>
        {errors.email && (
          <p className="text-red-400 text-sm mt-1">{errors.email.message}</p>
        )}

        {/* Password field */}
        <div className="relative">
          <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/50" />
          <input
            {...register('password', { 
              required: 'Password is required',
              minLength: { value: 6, message: 'Password must be at least 6 characters' }
            })}
            type={showPassword ? 'text' : 'password'}
            placeholder="Password"
            className="glass-input w-full pl-12 pr-12 py-3 text-base"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white/50 hover:text-white transition-colors"
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
        {errors.password && (
          <p className="text-red-400 text-sm mt-1">{errors.password.message}</p>
        )}

        {/* Admin Token field (only for admin) */}
        <AnimatePresence>
          {!isDoctor && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
            >
              <div className="relative">
                <Key className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/50" />
                <input
                  {...register('admin_token', { 
                    required: 'Admin token is required for admin access'
                  })}
                  type="password"
                  placeholder="Admin Token"
                  className="glass-input w-full pl-12 pr-4 py-3 text-base"
                />
              </div>
              {errors.admin_token && (
                <p className="text-red-400 text-sm mt-1">{errors.admin_token.message}</p>
              )}
              <p className="text-yellow-400/70 text-xs mt-1">
                Enter the admin access token provided by your organization
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Submit Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          disabled={loading}
          className="glass-button w-full flex items-center justify-center space-x-2 text-base py-3 mt-6"
        >
          {loading ? (
            <LoadingSpinner size="sm" />
          ) : (
            <span>{isLogin ? 'Sign In' : 'Create Account'}</span>
          )}
        </motion.button>
      </form>

      {/* Toggle between login/register */}
      <div className="text-center mt-6">
        <button
          onClick={() => {
            setIsLogin(!isLogin)
            setRegistrationState('form')
            reset()
          }}
          className="text-yellow-400 hover:text-yellow-300 transition-colors text-sm"
        >
          {isLogin ? "Don't have an account? Register here" : "Already have an account? Sign in"}
        </button>
      </div>
    </motion.div>
  )
}

export default AuthForm