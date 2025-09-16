import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { User, Mail, Lock, Eye, EyeOff, Save, X } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { useAuth } from '../../contexts/AuthContext'
import { doctorAPI } from '../../utils/api'
import LoadingSpinner from '../ui/LoadingSpinner'
import toast from 'react-hot-toast'

const ProfileUpdate = ({ isOpen, onClose }) => {
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [showOldPassword, setShowOldPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  
  const { register, handleSubmit, formState: { errors }, reset, watch } = useForm({
    defaultValues: {
      name: user?.name || '',
      email: user?.email || ''
    }
  })

  const watchOldPassword = watch('old_password')
  const watchNewPassword = watch('new_password')

  const onSubmit = async (data) => {
    setLoading(true)
    try {
      const updateData = {
        name: data.name
      }

      // Only include password if both old and new are provided
      if (data.old_password && data.new_password) {
        updateData.old_password = data.old_password
        updateData.new_password = data.new_password
      }

      await doctorAPI.updateProfile(updateData)
      toast.success('Profile updated successfully!')
      onClose()
      reset()
    } catch (error) {
      // Error handling is done in API interceptor
      console.error('Profile update error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    reset()
    onClose()
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={handleClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="glass-card w-full max-w-md"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-white/20">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-500/20 rounded-lg">
                  <User className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">Update Profile</h3>
                  <p className="text-white/70 text-sm">Modify your account information</p>
                </div>
              </div>
              
              <button
                onClick={handleClose}
                className="glass-button-secondary p-2"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
              {/* Name */}
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
                <p className="text-red-400 text-sm">{errors.name.message}</p>
              )}

              {/* Email (Read-only) */}
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/50" />
                <input
                  value={user?.email || ''}
                  type="email"
                  placeholder="Email Address"
                  className="glass-input w-full pl-12 pr-4 py-3 text-base opacity-60 cursor-not-allowed"
                  disabled
                />
              </div>
              <p className="text-white/50 text-xs">Email cannot be changed</p>

              {/* Password Section */}
              <div className="border-t border-white/20 pt-4">
                <h4 className="text-white font-medium mb-3">Change Password (Optional)</h4>
                
                {/* Old Password */}
                <div className="relative mb-3">
                  <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/50" />
                  <input
                    {...register('old_password', {
                      validate: (value) => {
                        if (watchNewPassword && !value) {
                          return 'Current password is required to change password'
                        }
                        return true
                      }
                    })}
                    type={showOldPassword ? 'text' : 'password'}
                    placeholder="Current Password"
                    className="glass-input w-full pl-12 pr-12 py-3 text-base"
                  />
                  <button
                    type="button"
                    onClick={() => setShowOldPassword(!showOldPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white/50 hover:text-white"
                  >
                    {showOldPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.old_password && (
                  <p className="text-red-400 text-sm mb-3">{errors.old_password.message}</p>
                )}

                {/* New Password */}
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/50" />
                  <input
                    {...register('new_password', {
                      validate: (value) => {
                        if (watchOldPassword && !value) {
                          return 'New password is required'
                        }
                        if (value && value.length < 6) {
                          return 'New password must be at least 6 characters'
                        }
                        return true
                      }
                    })}
                    type={showNewPassword ? 'text' : 'password'}
                    placeholder="New Password"
                    className="glass-input w-full pl-12 pr-12 py-3 text-base"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white/50 hover:text-white"
                  >
                    {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.new_password && (
                  <p className="text-red-400 text-sm mt-1">{errors.new_password.message}</p>
                )}
              </div>

              {/* Actions */}
              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={handleClose}
                  className="glass-button-secondary flex-1"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="glass-button flex-1 flex items-center justify-center space-x-2"
                >
                  {loading ? (
                    <LoadingSpinner size="sm" />
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      <span>Save Changes</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default ProfileUpdate