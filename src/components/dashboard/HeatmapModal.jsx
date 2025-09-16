import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Download, ZoomIn, AlertTriangle, CheckCircle, Brain, Info } from 'lucide-react'

const HeatmapModal = ({ isOpen, onClose, heatmapUrl, fileName = "heatmap", result = null, confidence = null }) => {
  // Bulletproof tumor detection - handles any case variations  
  const isTumor = result && (result.toLowerCase() === 'tumor' || result === 'Tumor')
  
  console.log('DEBUG Modal - result:', result, 'isTumor:', isTumor) // Debug logging
  
  const handleDownload = () => {
    const link = document.createElement('a')
    link.href = heatmapUrl
    link.download = `${fileName}_${result || 'analysis'}_heatmap.jpg`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="glass-card max-w-5xl w-full max-h-[95vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header with CORRECT styling based on isTumor */}
            <div className={`flex items-center justify-between p-6 border-b ${
              result ? (isTumor ? 'border-red-500/30 bg-red-500/5' : 'border-green-500/30 bg-green-500/5') : 'border-white/20'
            }`}>
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-lg ${
                  result ? (isTumor ? 'bg-red-500/20' : 'bg-green-500/20') : 'bg-yellow-400/20'
                }`}>
                  <ZoomIn className={`w-5 h-5 ${
                    result ? (isTumor ? 'text-red-400' : 'text-green-400') : 'text-yellow-400'
                  }`} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white flex items-center space-x-2">
                    <span>AI Attention Heatmap</span>
                    {result && (
                      isTumor ? (
                        <AlertTriangle className="w-6 h-6 text-red-400" />
                      ) : (
                        <CheckCircle className="w-6 h-6 text-green-400" />
                      )
                    )}
                  </h3>
                  <p className={`text-sm font-medium ${
                    result ? (isTumor ? 'text-red-400' : 'text-green-400') : 'text-white/70'
                  }`}>
                    {result ? `${result} ${confidence ? `(${Math.round(confidence * 100)}% confidence)` : ''}` : 'Areas of interest identified by the model'}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <button
                  onClick={handleDownload}
                  className="glass-button-secondary p-2"
                  title="Download Analysis"
                >
                  <Download className="w-5 h-5" />
                </button>
                <button
                  onClick={onClose}
                  className="glass-button-secondary p-2"
                  title="Close"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto max-h-[calc(95vh-120px)]">
              <div className="grid lg:grid-cols-2 gap-8">
                {/* Heatmap Image */}
                <div className="text-center">
                  <h4 className="text-white font-medium mb-4">AI Attention Analysis</h4>
                  <div className={`border-2 rounded-lg overflow-hidden shadow-xl ${
                    result ? (isTumor ? 'border-red-400' : 'border-green-400') : 'border-white/30'
                  }`}>
                    <img
                      src={heatmapUrl}
                      alt="AI Attention Heatmap"
                      className="w-full h-auto"
                    />
                  </div>
                </div>

                {/* Analysis Explanation - CORRECTED BASED ON isTumor */}
                <div className="space-y-6">
                  <div>
                    <h4 className="text-white font-semibold mb-4 flex items-center space-x-2">
                      <Brain className={`w-5 h-5 ${result ? (isTumor ? 'text-red-400' : 'text-green-400') : 'text-white'}`} />
                      <span>Detailed Analysis</span>
                    </h4>
                  </div>

                  {/* Classification Summary */}
                  {result && (
                    <div className={`p-4 rounded-lg border ${
                      isTumor ? 'bg-red-500/10 border-red-500/30' : 'bg-green-500/10 border-green-500/30'
                    }`}>
                      <div className="flex items-center space-x-2 mb-2">
                        {isTumor ? (
                          <AlertTriangle className="w-5 h-5 text-red-400" />
                        ) : (
                          <CheckCircle className="w-5 h-5 text-green-400" />
                        )}
                        <h5 className={`font-semibold ${isTumor ? 'text-red-400' : 'text-green-400'}`}>
                          {result} Detection
                        </h5>
                      </div>
                      {confidence && (
                        <p className="text-white/80 text-sm">
                          Confidence: <strong>{Math.round(confidence * 100)}%</strong>
                        </p>
                      )}
                    </div>
                  )}

                  {/* Heatmap Interpretation - FIXED TO USE isTumor CORRECTLY */}
                  <div className="bg-white/5 border border-white/20 rounded-lg p-4">
                    <h5 className="text-white font-semibold mb-3">Heatmap Interpretation</h5>
                    <div className="space-y-3 text-sm text-white/80">
                      {isTumor ? (
                        <>
                          <div>
                            <p className="font-medium text-red-300 mb-1">🔴 Red/Yellow Regions (High Attention):</p>
                            <p>Areas where the AI detected abnormal tissue patterns, densities, or structural changes characteristic of tumors. Brighter colors indicate stronger influence on the tumor detection decision.</p>
                          </div>
                          <div>
                            <p className="font-medium text-blue-300 mb-1">🔵 Blue/Cool Regions:</p>
                            <p>Normal brain tissue areas that had little influence on the AI's tumor detection decision.</p>
                          </div>
                          <div>
                            <p className="font-medium text-yellow-300 mb-1">⚠️ Clinical Significance:</p>
                            <p>The concentrated hotspots suggest specific regions require immediate radiological attention and correlation with clinical findings.</p>
                          </div>
                        </>
                      ) : (
                        <>
                          <div>
                            <p className="font-medium text-green-300 mb-1">✅ Distributed Pattern:</p>
                            <p>The AI examined the entire scan without detecting concentrated abnormal patterns. Attention is spread across normal anatomical structures without suspicious hotspots.</p>
                          </div>
                          <div>
                            <p className="font-medium text-cyan-300 mb-1">🧠 Normal Structures:</p>
                            <p>Any light regions in the heatmap represent routine anatomical checking where the AI verified normal tissue patterns. These areas did not have enough abnormal characteristics to signal tumor presence.</p>
                          </div>
                          <div>
                            <p className="font-medium text-blue-300 mb-1">✓ High Confidence Normal:</p>
                            <p>The absence of bright concentrated hotspots indicates high confidence that no significant tumor-associated abnormalities were detected.</p>
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Color Legend */}
                  <div className="bg-white/5 border border-white/20 rounded-lg p-4">
                    <h5 className="text-white font-semibold mb-3">Color Guide</h5>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-4 bg-gradient-to-r from-red-600 via-red-400 to-yellow-400 rounded"></div>
                        <span className="text-white/80 text-sm">
                          {isTumor ? 'Suspected tumor regions (requires immediate review)' : 'Routine anatomical verification'}
                        </span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-4 bg-gradient-to-r from-blue-600 to-purple-500 rounded"></div>
                        <span className="text-white/80 text-sm">Normal tissue regions (low attention)</span>
                      </div>
                    </div>
                  </div>

                  {/* Medical Disclaimer */}
                  <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <Info className="w-4 h-4 text-blue-400" />
                      <h5 className="text-blue-400 font-semibold">Important Medical Note</h5>
                    </div>
                    <p className="text-white/80 text-sm">
                      This heatmap provides insight into the AI model's decision-making process and should be used as a diagnostic aid alongside professional medical judgment.
                      {isTumor ? ' Immediate radiological evaluation is strongly recommended.' : ' Continue standard clinical monitoring protocols.'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default HeatmapModal