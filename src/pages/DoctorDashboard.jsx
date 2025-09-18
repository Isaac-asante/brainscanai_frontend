import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useAuth } from '../contexts/AuthContext'
import { doctorAPI } from '../utils/api'
import { 
  LogOut, 
  Brain, 
  Upload, 
  History, 
  User, 
  Settings,
  BarChart3,
  FileText,
  AlertCircle
} from 'lucide-react'
import toast from 'react-hot-toast'

// Components
import FileUpload from '../components/dashboard/FileUpload'
import PredictionResult from '../components/dashboard/PredictionResult'
import PredictionHistory from '../components/dashboard/PredictionHistory'
import HeatmapModal from '../components/dashboard/HeatmapModal'
import ProfileUpdate from '../components/dashboard/ProfileUpdate'
import LoadingSpinner from '../components/ui/LoadingSpinner'

const DoctorDashboard = () => {
  const { user, logout } = useAuth()
  const [activeTab, setActiveTab] = useState('predict')
  const [selectedFile, setSelectedFile] = useState(null)
  const [predicting, setPredicting] = useState(false)
  const [currentPrediction, setCurrentPrediction] = useState(null)
  const [predictions, setPredictions] = useState([])
  const [loadingHistory, setLoadingHistory] = useState(false)
  const [heatmapModal, setHeatmapModal] = useState({ 
    isOpen: false, 
    url: '', 
    result: null, 
    confidence: null, 
    fileName: '' 
  })
  const [profileModal, setProfileModal] = useState(false)

  // Helper functions for result classification
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

  // Load prediction history
  useEffect(() => {
    if (activeTab === 'history') {
      loadPredictionHistory()
    }
  }, [activeTab])

  // Load predictions for statistics tab
  useEffect(() => {
    if (activeTab === 'stats') {
      loadPredictionHistory()
    }
  }, [activeTab])

  const loadPredictionHistory = async () => {
    setLoadingHistory(true)
    try {
      const response = await doctorAPI.getPredictions()
      setPredictions(response.data.logs || [])
      console.log('DEBUG - Loaded predictions:', response.data.logs) // Debug log
    } catch (error) {
      console.error('Failed to load history:', error)
    } finally {
      setLoadingHistory(false)
    }
  }

  const handleFileUpload = async () => {
    if (!selectedFile) {
      toast.error('Please select an MRI image first')
      return
    }

    setPredicting(true)
    setCurrentPrediction(null)

    try {
      const formData = new FormData()
      formData.append('image', selectedFile)

      const response = await doctorAPI.uploadPrediction(formData)
      
      setCurrentPrediction({
        result: response.data.result,
        confidence: response.data.confidence,
        heatmap: response.data.heatmap,
        filename: selectedFile.name
      })

      toast.success('Analysis complete!')
      setSelectedFile(null)
      
      // Refresh history if on history tab
      if (activeTab === 'history') {
        loadPredictionHistory()
      }
    } catch (error) {
      console.error('Prediction failed:', error)
    } finally {
      setPredicting(false)
    }
  }

  const handleDeletePrediction = async (predictionId) => {
    try {
      await doctorAPI.deletePrediction(predictionId)
      toast.success('Prediction deleted successfully')
      loadPredictionHistory()
    } catch (error) {
      console.error('Delete failed:', error)
    }
  }

  const handleDeleteAllPredictions = async () => {
    try {
      await doctorAPI.deleteAllPredictions()
      toast.success('All predictions deleted successfully')
      loadPredictionHistory()
    } catch (error) {
      console.error('Delete all failed:', error)
    }
  }

  const handleDownloadLogs = async (format) => {
    try {
      const response = await doctorAPI.downloadLogs(format)
      
      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', `prediction_logs.${format}`)
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.URL.revokeObjectURL(url)
      
      toast.success(`Logs downloaded as ${format.toUpperCase()}`)
    } catch (error) {
      console.error('Download failed:', error)
    }
  }

  // Enhanced heatmap viewing with prediction context
  const handleViewHeatmap = (heatmapUrl, result = null, confidence = null, fileName = '') => {
    // Use current prediction data if available
    const predictionResult = result || currentPrediction?.result
    const predictionConfidence = confidence || currentPrediction?.confidence
    const predictionFileName = fileName || currentPrediction?.filename || 'analysis'

    setHeatmapModal({ 
      isOpen: true, 
      url: heatmapUrl,
      result: predictionResult,
      confidence: predictionConfidence,
      fileName: predictionFileName
    })
  }

  // Handle history heatmap viewing
  const handleViewHistoryHeatmap = (heatmapUrl, prediction) => {
    setHeatmapModal({
      isOpen: true,
      url: heatmapUrl,
      result: prediction.result,
      confidence: prediction.confidence,
      fileName: prediction.filename || 'history_scan'
    })
  }

  // Calculate statistics with robust filtering
  const totalPredictions = predictions.length
  const tumorCount = predictions.filter(p => isTumorResult(p.result)).length
  const nonTumorCount = predictions.filter(p => isNonTumorResult(p.result)).length

  console.log('DEBUG - Statistics:', { 
    total: totalPredictions, 
    tumor: tumorCount, 
    nonTumor: nonTumorCount,
    rawResults: predictions.map(p => p.result)
  })

  const tabs = [
    { id: 'predict', label: 'New Prediction', icon: Upload },
    { id: 'history', label: 'History', icon: History },
    { id: 'stats', label: 'Statistics', icon: BarChart3 },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black">
      {/* Header */}
      <header className="bg-white/5 backdrop-blur-sm border-b border-white/20 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-yellow-400 rounded-lg">
                <Brain className="w-6 h-6 text-black" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">Brain Scan AI</h1>
                <p className="text-white/60 text-sm">Doctor Dashboard</p>
              </div>
            </div>

            {/* User Menu */}
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-white font-medium">Dr. {user?.name}</p>
                <p className="text-white/60 text-sm">{user?.email}</p>
              </div>
              
              <button
                onClick={() => setProfileModal(true)}
                className="glass-button-secondary p-2"
                title="Profile Settings"
              >
                <Settings className="w-5 h-5" />
              </button>
              
              <button
                onClick={logout}
                className="glass-button-secondary p-2 text-red-400 hover:bg-red-500/20"
                title="Logout"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation Tabs */}
        <div className="flex space-x-1 mb-8 bg-white/5 p-1 rounded-lg backdrop-blur-sm">
          {tabs.map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${
                  activeTab === tab.id
                    ? 'bg-yellow-400 text-black font-medium'
                    : 'text-white/70 hover:text-white hover:bg-white/10'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            )
          })}
        </div>

        {/* Tab Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Prediction Tab */}
          {activeTab === 'predict' && (
            <div className="space-y-8">
              {/* Upload Section */}
              <div className="glass-card p-6">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="p-2 bg-yellow-400/20 rounded-lg">
                    <Upload className="w-5 h-5 text-yellow-400" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">MRI Analysis</h2>
                    <p className="text-white/70">Upload an MRI image for brain tumor detection</p>
                  </div>
                </div>

                <FileUpload 
                  onFileSelect={setSelectedFile}
                  disabled={predicting}
                />

                {selectedFile && (
                  <div className="mt-6 flex justify-center">
                    <button
                      onClick={handleFileUpload}
                      disabled={predicting}
                      className="glass-button flex items-center space-x-2 px-8 py-3"
                    >
                      {predicting ? (
                        <>
                          <LoadingSpinner size="sm" />
                          <span>Analyzing...</span>
                        </>
                      ) : (
                        <>
                          <Brain className="w-5 h-5" />
                          <span>Analyze Image</span>
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>

              {/* Results Section */}
              {currentPrediction && (
                <PredictionResult
                  result={currentPrediction.result}
                  confidence={currentPrediction.confidence}
                  heatmapUrl={currentPrediction.heatmap}
                  onViewHeatmap={() => handleViewHeatmap(
                    `http://127.0.0.1:5000/static/${currentPrediction.heatmap}`,
                    currentPrediction.result,
                    currentPrediction.confidence,
                    currentPrediction.filename
                  )}
                />
              )}
            </div>
          )}

          {/* History Tab */}
          {activeTab === 'history' && (
            <div>
              {loadingHistory ? (
                <div className="glass-card p-12 text-center">
                  <LoadingSpinner size="lg" />
                  <p className="text-white/70 mt-4">Loading prediction history...</p>
                </div>
              ) : (
                <PredictionHistory
                  predictions={predictions}
                  onDelete={handleDeletePrediction}
                  onDeleteAll={handleDeleteAllPredictions}
                  onDownload={handleDownloadLogs}
                  onViewHeatmap={(heatmapUrl) => {
                    // Find the prediction that matches this heatmap
                    const matchingPrediction = predictions.find(p => 
                      p.heatmap && heatmapUrl.includes(p.heatmap)
                    )
                    if (matchingPrediction) {
                      handleViewHistoryHeatmap(heatmapUrl, matchingPrediction)
                    } else {
                      // Fallback to basic modal
                      setHeatmapModal({ isOpen: true, url: heatmapUrl, result: null, confidence: null, fileName: 'scan' })
                    }
                  }}
                />
              )}
            </div>
          )}

          {/* Statistics Tab - FIXED FILTERING */}
          {activeTab === 'stats' && (
            <div className="glass-card p-6">
              <div className="flex items-center space-x-3 mb-6">
                <div className="p-2 bg-green-500/20 rounded-lg">
                  <BarChart3 className="w-5 h-5 text-green-400" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">Statistics</h2>
                  <p className="text-white/70">Your prediction analytics and insights</p>
                </div>
              </div>

              {loadingHistory ? (
                <div className="text-center py-12">
                  <LoadingSpinner size="lg" />
                  <p className="text-white/70 mt-4">Loading statistics...</p>
                </div>
              ) : (
                <>
                  <div className="grid md:grid-cols-3 gap-6">
                    <div className="bg-white/5 border border-white/20 rounded-lg p-6 text-center">
                      <FileText className="w-8 h-8 text-blue-400 mx-auto mb-3" />
                      <h3 className="text-2xl font-bold text-white">{totalPredictions}</h3>
                      <p className="text-white/70">Total Predictions</p>
                    </div>

                    <div className="bg-white/5 border border-white/20 rounded-lg p-6 text-center">
                      <AlertCircle className="w-8 h-8 text-red-400 mx-auto mb-3" />
                      <h3 className="text-2xl font-bold text-white">{tumorCount}</h3>
                      <p className="text-white/70">Tumor Detected</p>
                    </div>

                    <div className="bg-white/5 border border-white/20 rounded-lg p-6 text-center">
                      <Brain className="w-8 h-8 text-green-400 mx-auto mb-3" />
                      <h3 className="text-2xl font-bold text-white">{nonTumorCount}</h3>
                      <p className="text-white/70">No Tumor</p>
                    </div>
                  </div>

                  {/* Additional Statistics */}
                  {totalPredictions > 0 && (
                    <div className="mt-8 grid md:grid-cols-2 gap-6">
                      <div className="bg-white/5 border border-white/20 rounded-lg p-6">
                        <h4 className="text-lg font-semibold text-white mb-4">Detection Rate</h4>
                        <div className="space-y-3">
                          <div className="flex justify-between items-center">
                            <span className="text-red-400">Tumor Detection Rate</span>
                            <span className="text-white font-bold">
                              {((tumorCount / totalPredictions) * 100).toFixed(1)}%
                            </span>
                          </div>
                          <div className="w-full bg-white/10 rounded-full h-2">
                            <div 
                              className="bg-red-400 h-2 rounded-full" 
                              style={{ width: `${(tumorCount / totalPredictions) * 100}%` }}
                            />
                          </div>
                        </div>
                      </div>

                      <div className="bg-white/5 border border-white/20 rounded-lg p-6">
                        <h4 className="text-lg font-semibold text-white mb-4">Normal Rate</h4>
                        <div className="space-y-3">
                          <div className="flex justify-between items-center">
                            <span className="text-green-400">Normal Scan Rate</span>
                            <span className="text-white font-bold">
                              {((nonTumorCount / totalPredictions) * 100).toFixed(1)}%
                            </span>
                          </div>
                          <div className="w-full bg-white/10 rounded-full h-2">
                            <div 
                              className="bg-green-400 h-2 rounded-full" 
                              style={{ width: `${(nonTumorCount / totalPredictions) * 100}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )}

              {totalPredictions === 0 && !loadingHistory && (
                <div className="text-center py-12">
                  <BarChart3 className="w-16 h-16 text-white/20 mx-auto mb-4" />
                  <h4 className="text-lg font-medium text-white/60 mb-2">No Data Available</h4>
                  <p className="text-white/40">Make some predictions to see your statistics</p>
                </div>
              )}
            </div>
          )}
        </motion.div>
      </div>

      {/* Modals */}
      <HeatmapModal
        isOpen={heatmapModal.isOpen}
        onClose={() => setHeatmapModal({ isOpen: false, url: '', result: null, confidence: null, fileName: '' })}
        heatmapUrl={heatmapModal.url}
        result={heatmapModal.result}
        confidence={heatmapModal.confidence}
        fileName={heatmapModal.fileName}
      />

      <ProfileUpdate
        isOpen={profileModal}
        onClose={() => setProfileModal(false)}
      />
    </div>
  )
}

export default DoctorDashboard