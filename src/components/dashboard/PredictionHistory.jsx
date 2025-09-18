import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { History, Download, Trash2, Eye, Calendar, Percent, AlertTriangle, CheckCircle, MoreHorizontal, ChevronDown } from 'lucide-react'
import { format } from 'date-fns'

const PredictionHistory = ({ predictions, onDelete, onDeleteAll, onDownload, onViewHeatmap }) => {
  const [deleteConfirm, setDeleteConfirm] = useState(null)
  const [showOptions, setShowOptions] = useState(null)
  const [showDownloadMenu, setShowDownloadMenu] = useState(false)

  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), 'MMM dd, yyyy HH:mm')
    } catch {
      return dateString
    }
  }

  const handleDeleteClick = (predictionId) => {
    setDeleteConfirm(predictionId)
    setShowOptions(null)
  }

  const confirmDelete = (predictionId) => {
    onDelete(predictionId)
    setDeleteConfirm(null)
  }

  const handleDeleteAll = () => {
    if (window.confirm('Are you sure you want to delete all predictions? This action cannot be undone.')) {
      onDeleteAll()
    }
  }

  const handleDownloadSelect = (format) => {
    onDownload(format)
    setShowDownloadMenu(false)
  }

  // Helper function to determine if result is tumor (case-insensitive)
  const isTumorResult = (result) => {
    if (!result) return false
    const lowerResult = result.toLowerCase()
    return lowerResult === 'tumor' || lowerResult === 'tumour'
  }

  // Helper function to format result display
  const formatResult = (result) => {
    if (!result) return 'Unknown'
    const lowerResult = result.toLowerCase()
    if (lowerResult === 'tumor' || lowerResult === 'tumour') return 'Tumor'
    if (lowerResult === 'non-tumor' || lowerResult === 'non-tumour' || lowerResult === 'no tumor') return 'Non-Tumor'
    return result
  }

  const downloadOptions = [
    { value: 'csv', label: 'CSV Format', icon: '📊' },
    { value: 'pdf', label: 'PDF Report', icon: '📄' },
    { value: 'json', label: 'JSON Data', icon: '📋' }
  ]

  return (
    <div className="glass-card p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-blue-500/20 rounded-lg">
            <History className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">Prediction History</h3>
            <p className="text-white/70 text-sm">
              {predictions.length} prediction{predictions.length !== 1 ? 's' : ''} total
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {/* Custom Download Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowDownloadMenu(!showDownloadMenu)}
              className="glass-button-secondary px-4 py-2 text-sm flex items-center space-x-2"
              disabled={predictions.length === 0}
            >
              <Download className="w-4 h-4" />
              <span>Download</span>
              <ChevronDown className={`w-4 h-4 transition-transform ${showDownloadMenu ? 'rotate-180' : ''}`} />
            </button>

            <AnimatePresence>
              {showDownloadMenu && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: -10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -10 }}
                  className="absolute right-0 top-full mt-2 bg-gray-800 border border-white/20 rounded-lg shadow-xl z-20 min-w-[160px] overflow-hidden"
                >
                  {downloadOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => handleDownloadSelect(option.value)}
                      className="w-full px-4 py-3 text-left text-white hover:bg-white/10 transition-colors flex items-center space-x-3 border-b border-white/10 last:border-b-0"
                    >
                      <span className="text-lg">{option.icon}</span>
                      <span className="text-sm font-medium">{option.label}</span>
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {predictions.length > 0 && (
            <button
              onClick={handleDeleteAll}
              className="glass-button-secondary p-2 text-red-400 hover:bg-red-500/20"
              title="Delete All"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Click outside to close dropdown */}
      {showDownloadMenu && (
        <div 
          className="fixed inset-0 z-10" 
          onClick={() => setShowDownloadMenu(false)}
        />
      )}

      {predictions.length === 0 ? (
        <div className="text-center py-12">
          <History className="w-16 h-16 text-white/20 mx-auto mb-4" />
          <h4 className="text-lg font-medium text-white/60 mb-2">No Predictions Yet</h4>
          <p className="text-white/40">Your prediction history will appear here after you analyze MRI images</p>
        </div>
      ) : (
        <div className="space-y-3">
          <AnimatePresence>
            {predictions.map((prediction, index) => {
              const isTumor = isTumorResult(prediction.result)
              const displayResult = formatResult(prediction.result)
              
              return (
                <motion.div
                  key={prediction.timestamp || index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white/5 border border-white/10 rounded-lg p-4 hover:bg-white/10 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 flex-1">
                      {/* Result Badge - FIXED COLOR LOGIC */}
                      <div className={`flex items-center space-x-2 px-3 py-1 rounded-full text-sm font-medium ${
                        isTumor
                          ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                          : 'bg-green-500/20 text-green-400 border border-green-500/30'
                      }`}>
                        {isTumor ? (
                          <AlertTriangle className="w-3 h-3" />
                        ) : (
                          <CheckCircle className="w-3 h-3" />
                        )}
                        <span>{displayResult}</span>
                      </div>

                      {/* File Info */}
                      <div className="flex-1">
                        <h4 className="text-white font-medium text-sm truncate">
                          {prediction.filename}
                        </h4>
                        <div className="flex items-center space-x-4 text-xs text-white/60 mt-1">
                          <div className="flex items-center space-x-1">
                            <Calendar className="w-3 h-3" />
                            <span>{formatDate(prediction.timestamp)}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Percent className="w-3 h-3" />
                            <span>{Math.round(prediction.confidence * 100)}% confidence</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center space-x-2">
                      {prediction.heatmap && (
                        <button
                          onClick={() => onViewHeatmap(`http://127.0.0.1:5000/static/${prediction.heatmap}`)}
                          className="p-2 text-white/60 hover:text-yellow-400 hover:bg-white/10 rounded-lg transition-colors"
                          title="View Heatmap"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      )}

                      <div className="relative">
                        <button
                          onClick={() => setShowOptions(showOptions === index ? null : index)}
                          className="p-2 text-white/60 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                        >
                          <MoreHorizontal className="w-4 h-4" />
                        </button>

                        <AnimatePresence>
                          {showOptions === index && (
                            <motion.div
                              initial={{ opacity: 0, scale: 0.95, y: -10 }}
                              animate={{ opacity: 1, scale: 1, y: 0 }}
                              exit={{ opacity: 0, scale: 0.95, y: -10 }}
                              className="absolute right-0 top-full mt-1 bg-gray-800 border border-white/20 rounded-lg shadow-xl z-10 min-w-[120px]"
                            >
                              <button
                                onClick={() => handleDeleteClick(prediction._id || index)}
                                className="w-full px-3 py-2 text-left text-red-400 hover:bg-red-500/20 rounded-lg transition-colors flex items-center space-x-2"
                              >
                                <Trash2 className="w-3 h-3" />
                                <span className="text-sm">Delete</span>
                              </button>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </AnimatePresence>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deleteConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
            onClick={() => setDeleteConfirm(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="glass-card p-6 max-w-sm mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-center">
                <div className="w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <AlertTriangle className="w-6 h-6 text-red-400" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Delete Prediction</h3>
                <p className="text-white/70 mb-6">
                  Are you sure you want to delete this prediction? This action cannot be undone.
                </p>
                <div className="flex space-x-3">
                  <button
                    onClick={() => setDeleteConfirm(null)}
                    className="glass-button-secondary flex-1"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => confirmDelete(deleteConfirm)}
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-medium transition-colors flex-1"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default PredictionHistory