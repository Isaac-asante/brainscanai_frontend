import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Database, 
  Search, 
  Filter, 
  Calendar, 
  User, 
  Brain,
  AlertTriangle,
  CheckCircle,
  Eye,
  Download,
  ChevronDown
} from 'lucide-react'
import { format } from 'date-fns'

const AllPredictions = ({ predictions, loading }) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterResult, setFilterResult] = useState('all') // 'all', 'tumor', 'no-tumor'
  const [sortBy, setSortBy] = useState('newest') // 'newest', 'oldest', 'confidence'
  const [showFilterMenu, setShowFilterMenu] = useState(false)
  const [showSortMenu, setShowSortMenu] = useState(false)

  // Helper functions for tumor detection (same as doctor dashboard)
  const isTumorResult = (result) => {
    if (!result) return false
    const lowerResult = result.toLowerCase()
    return lowerResult === 'tumor' || lowerResult === 'tumour'
  }

  const isNonTumorResult = (result) => {
    if (!result) return false
    const lowerResult = result.toLowerCase()
    return lowerResult === 'non-tumor' || lowerResult === 'non-tumour' || 
           lowerResult === 'no tumor' || lowerResult === 'normal'
  }

  const formatResultDisplay = (result) => {
    if (!result) return 'Unknown'
    const lowerResult = result.toLowerCase()
    if (lowerResult === 'tumor' || lowerResult === 'tumour') return 'Tumor'
    if (lowerResult === 'non-tumor' || lowerResult === 'non-tumour' || lowerResult === 'no tumor') return 'Non-Tumor'
    return result
  }

  const filteredAndSortedPredictions = predictions
    .filter(prediction => {
      // Enhanced search - check multiple possible field names
      const searchFields = [
        prediction.filename,
        prediction.user_email,
        prediction.email, // alternative field name
        prediction.doctor_email, // another possible field name
        prediction.user?.email, // nested email field
        prediction.doctor?.email // nested doctor email field
      ].filter(Boolean) // remove undefined/null values

      const matchesSearch = searchTerm === '' || searchFields.some(field => 
        field && field.toLowerCase().includes(searchTerm.toLowerCase())
      )
      
      const matchesFilter = 
        filterResult === 'all' ||
        (filterResult === 'tumor' && isTumorResult(prediction.result)) ||
        (filterResult === 'no-tumor' && isNonTumorResult(prediction.result))
      
      return matchesSearch && matchesFilter
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'oldest':
          return new Date(a.timestamp) - new Date(b.timestamp)
        case 'confidence':
          return (b.confidence || 0) - (a.confidence || 0)
        case 'newest':
        default:
          return new Date(b.timestamp) - new Date(a.timestamp)
      }
    })

  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), 'MMM dd, yyyy HH:mm')
    } catch {
      return dateString
    }
  }

  const exportData = () => {
    const csv = [
      ['Date', 'Doctor Email', 'Filename', 'Result', 'Confidence'],
      ...filteredAndSortedPredictions.map(p => [
        formatDate(p.timestamp),
        p.user_email || p.email || p.doctor_email || p.user?.email || p.doctor?.email || 'Unknown',
        p.filename,
        formatResultDisplay(p.result),
        `${Math.round((p.confidence || 0) * 100)}%`
      ])
    ].map(row => row.join(',')).join('\n')

    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'all_predictions.csv'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  // Filter options
  const filterOptions = [
    { value: 'all', label: 'All Results', icon: '🔍' },
    { value: 'tumor', label: 'Tumor Detected', icon: '🔴' },
    { value: 'no-tumor', label: 'No Tumor', icon: '🟢' }
  ]

  // Sort options
  const sortOptions = [
    { value: 'newest', label: 'Newest First', icon: '📅' },
    { value: 'oldest', label: 'Oldest First', icon: '📅' },
    { value: 'confidence', label: 'Highest Confidence', icon: '📊' }
  ]

  const handleFilterSelect = (value) => {
    setFilterResult(value)
    setShowFilterMenu(false)
  }

  const handleSortSelect = (value) => {
    setSortBy(value)
    setShowSortMenu(false)
  }

  const getDisplayEmail = (prediction) => {
    return prediction.user_email || 
           prediction.email || 
           prediction.doctor_email || 
           prediction.user?.email || 
           prediction.doctor?.email || 
           'Unknown'
  }

  console.log('DEBUG - Sample prediction:', predictions[0]) // Debug log to see data structure

  return (
    <div className="glass-card p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 space-y-4 sm:space-y-0">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-purple-500/20 rounded-lg">
            <Database className="w-5 h-5 text-purple-400" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">All Predictions</h3>
            <p className="text-white/70 text-sm">
              {filteredAndSortedPredictions.length} of {predictions.length} predictions
            </p>
          </div>
        </div>

        <button
          onClick={exportData}
          className="glass-button flex items-center space-x-2"
          disabled={filteredAndSortedPredictions.length === 0}
        >
          <Download className="w-4 h-4" />
          <span>Export CSV</span>
        </button>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/50" />
          <input
            type="text"
            placeholder="Search by filename or doctor email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="glass-input pl-10 pr-4 py-2 text-sm w-full"
          />
        </div>

        {/* Filter by result - CUSTOM DROPDOWN */}
        <div className="relative">
          <button
            onClick={() => setShowFilterMenu(!showFilterMenu)}
            className="glass-input pl-10 pr-4 py-2 text-sm w-full text-left flex items-center justify-between"
          >
            <div className="flex items-center">
              <Filter className="absolute left-3 w-4 h-4 text-white/50" />
              <span className="ml-7">
                {filterOptions.find(opt => opt.value === filterResult)?.label || 'All Results'}
              </span>
            </div>
            <ChevronDown className={`w-4 h-4 text-white/50 transition-transform ${showFilterMenu ? 'rotate-180' : ''}`} />
          </button>

          <AnimatePresence>
            {showFilterMenu && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: -10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -10 }}
                className="absolute top-full mt-2 left-0 right-0 bg-gray-800 border border-white/20 rounded-lg shadow-xl z-20 overflow-hidden"
              >
                {filterOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => handleFilterSelect(option.value)}
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

        {/* Sort - CUSTOM DROPDOWN */}
        <div className="relative">
          <button
            onClick={() => setShowSortMenu(!showSortMenu)}
            className="glass-input pl-10 pr-4 py-2 text-sm w-full text-left flex items-center justify-between"
          >
            <div className="flex items-center">
              <Calendar className="absolute left-3 w-4 h-4 text-white/50" />
              <span className="ml-7">
                {sortOptions.find(opt => opt.value === sortBy)?.label || 'Newest First'}
              </span>
            </div>
            <ChevronDown className={`w-4 h-4 text-white/50 transition-transform ${showSortMenu ? 'rotate-180' : ''}`} />
          </button>

          <AnimatePresence>
            {showSortMenu && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: -10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -10 }}
                className="absolute top-full mt-2 left-0 right-0 bg-gray-800 border border-white/20 rounded-lg shadow-xl z-20 overflow-hidden"
              >
                {sortOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => handleSortSelect(option.value)}
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
      </div>

      {/* Click outside to close dropdowns */}
      {(showFilterMenu || showSortMenu) && (
        <div 
          className="fixed inset-0 z-10" 
          onClick={() => {
            setShowFilterMenu(false)
            setShowSortMenu(false)
          }}
        />
      )}

      {loading ? (
        <div className="text-center py-12">
          <div className="w-8 h-8 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white/70">Loading predictions...</p>
        </div>
      ) : filteredAndSortedPredictions.length === 0 ? (
        <div className="text-center py-12">
          <Database className="w-16 h-16 text-white/20 mx-auto mb-4" />
          <h4 className="text-lg font-medium text-white/60 mb-2">
            {searchTerm || filterResult !== 'all' ? 'No predictions found' : 'No Predictions Yet'}
          </h4>
          <p className="text-white/40">
            {searchTerm || filterResult !== 'all' 
              ? 'Try adjusting your search or filter criteria' 
              : 'Predictions will appear here as doctors use the system'
            }
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredAndSortedPredictions.map((prediction, index) => {
            const isTumor = isTumorResult(prediction.result)
            const displayResult = formatResultDisplay(prediction.result)
            
            return (
              <motion.div
                key={`${getDisplayEmail(prediction)}-${prediction.timestamp}-${index}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
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

                    {/* Prediction Info */}
                    <div className="flex-1">
                      <div className="flex items-center space-x-4 mb-1">
                        <h4 className="text-white font-medium text-sm">
                          {prediction.filename}
                        </h4>
                        <div className="flex items-center space-x-1 text-white/60">
                          <Brain className="w-3 h-3" />
                          <span className="text-xs">
                            {Math.round((prediction.confidence || 0) * 100)}% confidence
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-4 text-xs text-white/60">
                        <div className="flex items-center space-x-1">
                          <User className="w-3 h-3" />
                          <span>{getDisplayEmail(prediction)}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-3 h-3" />
                          <span>{formatDate(prediction.timestamp)}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center space-x-2">
                    {prediction.heatmap && (
                      <button
                        onClick={() => window.open(`http://127.0.0.1:5000/static/${prediction.heatmap}`, '_blank')}
                        className="p-2 text-white/60 hover:text-yellow-400 hover:bg-white/10 rounded-lg transition-colors"
                        title="View Heatmap"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default AllPredictions