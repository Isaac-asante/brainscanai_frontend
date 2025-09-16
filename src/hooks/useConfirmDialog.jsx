import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { AlertTriangle, CheckCircle, Info, XCircle } from 'lucide-react'
import React from 'react'

export const useConfirmDialog = () => {
  const [dialog, setDialog] = useState(null)

  const showConfirm = ({
    title,
    message,
    type = 'warning', // 'warning', 'danger', 'info', 'success'
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    onConfirm,
    onCancel
  }) => {
    setDialog({
      title,
      message,
      type,
      confirmText,
      cancelText,
      onConfirm,
      onCancel
    })
  }

  const hideConfirm = () => {
    setDialog(null)
  }

  const handleConfirm = () => {
    if (dialog?.onConfirm) {
      dialog.onConfirm()
    }
    hideConfirm()
  }

  const handleCancel = () => {
    if (dialog?.onCancel) {
      dialog.onCancel()
    }
    hideConfirm()
  }

  const ConfirmDialog = () => {
    if (!dialog) return null

    const icons = {
      warning: AlertTriangle,
      danger: XCircle,
      info: Info,
      success: CheckCircle
    }

    const colors = {
      warning: 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30',
      danger: 'text-red-400 bg-red-500/20 border-red-500/30',
      info: 'text-blue-400 bg-blue-500/20 border-blue-500/30',
      success: 'text-green-400 bg-green-500/20 border-green-500/30'
    }

    const buttonColors = {
      warning: 'bg-yellow-500 hover:bg-yellow-600',
      danger: 'bg-red-500 hover:bg-red-600',
      info: 'bg-blue-500 hover:bg-blue-600',
      success: 'bg-green-500 hover:bg-green-600'
    }

    const Icon = icons[dialog.type]

    return (
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
          onClick={handleCancel}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="glass-card p-6 max-w-sm mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-center">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 border ${colors[dialog.type]}`}>
                <Icon className="w-6 h-6" />
              </div>
              
              <h3 className="text-lg font-bold text-white mb-2">{dialog.title}</h3>
              <p className="text-white/70 mb-6">{dialog.message}</p>
              
              <div className="flex space-x-3">
                <button
                  onClick={handleCancel}
                  className="glass-button-secondary flex-1"
                >
                  {dialog.cancelText}
                </button>
                <button
                  onClick={handleConfirm}
                  className={`${buttonColors[dialog.type]} text-white px-4 py-2 rounded-lg font-medium transition-colors flex-1`}
                >
                  {dialog.confirmText}
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    )
  }

  return {
    showConfirm,
    hideConfirm,
    ConfirmDialog
  }
}