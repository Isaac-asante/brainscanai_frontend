import toast from 'react-hot-toast'
import { CheckCircle, XCircle, AlertTriangle, Info } from 'lucide-react'
import React from 'react'

const createToast = (type, message, options = {}) => {
  const icons = {
    success: CheckCircle,
    error: XCircle,
    warning: AlertTriangle,
    info: Info
  }

  const colors = {
    success: 'text-green-400',
    error: 'text-red-400',
    warning: 'text-yellow-400',
    info: 'text-blue-400'
  }

  const Icon = icons[type]

  return toast.custom(
    (t) => (
      <div
        className={`${
          t.visible ? 'animate-enter' : 'animate-leave'
        } glass-card p-4 flex items-center space-x-3 max-w-md`}
      >
        <Icon className={`w-5 h-5 ${colors[type]} flex-shrink-0`} />
        <p className="text-white text-sm font-medium">{message}</p>
        <button
          onClick={() => toast.dismiss(t.id)}
          className="text-white/60 hover:text-white ml-auto"
        >
          <XCircle className="w-4 h-4" />
        </button>
      </div>
    ),
    {
      duration: options.duration || 4000,
      position: 'top-right',
      ...options
    }
  )
}

export const showToast = {
  success: (message, options) => createToast('success', message, options),
  error: (message, options) => createToast('error', message, options),
  warning: (message, options) => createToast('warning', message, options),
  info: (message, options) => createToast('info', message, options),
  promise: (promise, messages) => {
    return toast.promise(
      promise,
      {
        loading: messages.loading || 'Loading...',
        success: messages.success || 'Success!',
        error: messages.error || 'Error occurred',
      },
      {
        style: {
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          color: '#fff',
        },
      }
    )
  }
}