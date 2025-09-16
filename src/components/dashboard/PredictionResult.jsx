import React from 'react'
import { motion } from 'framer-motion'
import { Brain, TrendingUp, Eye, AlertTriangle, CheckCircle, Info } from 'lucide-react'

const PredictionResult = ({ result, confidence, heatmapUrl, onViewHeatmap }) => {
  // Bulletproof tumor detection - handles any case variations
  const isTumor = result && (result.toLowerCase() === 'tumor' || result === 'Tumor')
  const confidencePercentage = Math.round(confidence * 100)
  
  console.log('DEBUG - result:', result, 'isTumor:', isTumor) // Debug logging

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`glass-card p-6 border-2 ${
        isTumor ? 'border-red-500/40 shadow-red-500/20' : 'border-green-500/40 shadow-green-500/20'
      } shadow-2xl`}
    >
      <div className="flex items-center space-x-3 mb-6">
        <div className={`p-3 rounded-full ${isTumor ? 'bg-red-500/20' : 'bg-green-500/20'}`}>
          <Brain className={`w-6 h-6 ${isTumor ? 'text-red-400' : 'text-green-400'}`} />
        </div>
        <div>
          <h3 className="text-xl font-bold text-white">Analysis Complete</h3>
          <p className="text-white/70">AI prediction results</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Result */}
        <div className="space-y-4">
          <div>
            <label className="text-white/70 text-sm font-medium">Classification Result</label>
            <div className={`text-2xl font-bold ${isTumor ? 'text-red-400' : 'text-green-400'} flex items-center space-x-2`}>
              {isTumor ? (
                <AlertTriangle className="w-8 h-8 text-red-400" />
              ) : (
                <CheckCircle className="w-8 h-8 text-green-400" />
              )}
              <span>{result}</span>
            </div>
          </div>

          <div>
            <label className="text-white/70 text-sm font-medium">Confidence Level</label>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-white font-medium">{confidencePercentage}%</span>
                <TrendingUp className="w-4 h-4 text-yellow-400" />
              </div>
              <div className="w-full bg-white/10 rounded-full h-3">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${confidencePercentage}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className={`h-3 rounded-full ${
                    confidencePercentage >= 80 ? (isTumor ? 'bg-red-400' : 'bg-green-400') :
                    confidencePercentage >= 60 ? 'bg-yellow-400' : 'bg-orange-400'
                  }`}
                />
              </div>
            </div>
          </div>

          {/* Clinical Interpretation - FIXED CONDITION */}
          <div className={`p-4 rounded-lg border ${
            isTumor ? 'bg-red-500/10 border-red-500/30' : 'bg-green-500/10 border-green-500/30'
          }`}>
            <h4 className={`font-semibold mb-2 ${isTumor ? 'text-red-400' : 'text-green-400'}`}>
              Clinical Interpretation
            </h4>
            <p className="text-white/80 text-sm">
              {isTumor 
                ? 'The AI model has detected abnormal tissue patterns and densities characteristic of tumor presence. Immediate radiological review and further diagnostic workup are recommended.'
                : 'The AI model found no abnormal tissue patterns strongly associated with tumors. The scan appears consistent with normal brain tissue patterns. Continue with standard monitoring protocols as clinically indicated.'
              }
            </p>
            
            {confidencePercentage < 75 && (
              <div className="flex items-start space-x-2 mt-3 p-2 bg-yellow-500/10 border border-yellow-500/30 rounded">
                <Info className="w-4 h-4 text-yellow-400 mt-0.5 flex-shrink-0" />
                <p className="text-yellow-400 text-xs">
                  <strong>Note:</strong> Confidence level below 75%. Consider additional imaging sequences or expert radiological consultation for definitive diagnosis.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Heatmap */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-white/70 text-sm font-medium">AI Attention Heatmap</label>
            <div className={`px-3 py-1 rounded-full text-xs font-bold border ${
              isTumor 
                ? 'bg-red-500/20 text-red-400 border-red-500/40' 
                : 'bg-green-500/20 text-green-400 border-green-500/40'
            }`}>
              {isTumor ? 'TUMOR DETECTED' : 'NORMAL SCAN'}
            </div>
          </div>
          
          {heatmapUrl ? (
            <div className="relative">
              <div className={`border-2 rounded-lg overflow-hidden ${
                isTumor ? 'border-red-400 shadow-red-400/30' : 'border-green-400 shadow-green-400/30'
              } shadow-lg`}>
                <img
                  src={`http://127.0.0.1:5000/static/${heatmapUrl}`}
                  alt="AI Attention Heatmap"
                  className="w-full rounded-lg"
                />
                <div className={`absolute inset-0 ${
                  isTumor ? 'bg-gradient-to-t from-red-500/15 to-transparent' : 'bg-gradient-to-t from-green-500/15 to-transparent'
                } rounded-lg pointer-events-none`} />
                
                <button
                  onClick={() => onViewHeatmap && onViewHeatmap()}
                  className="absolute bottom-3 right-3 glass-button-secondary p-2 hover:scale-110 transition-transform"
                  title="View Detailed Analysis"
                >
                  <Eye className="w-4 h-4" />
                </button>
              </div>

              {/* Heatmap Explanation - CORRECTED CONDITION */}
              <div className={`mt-4 p-4 rounded-lg border ${
                isTumor ? 'bg-red-500/10 border-red-500/30' : 'bg-green-500/10 border-green-500/30'
              }`}>
                <h5 className={`${isTumor ? 'text-red-400' : 'text-green-400'} font-semibold mb-2`}>
                  Heatmap Analysis
                </h5>
                <p className="text-white/80 text-sm">
                  {isTumor 
                    ? 'Red/warm areas show regions where the AI detected abnormal tissue patterns or densities characteristic of tumors. These areas had the strongest influence on the tumor detection decision.'
                    : 'The AI examined the entire scan without detecting concentrated abnormal patterns. Attention is distributed across normal anatomical structures without suspicious hotspots.'
                  }
                </p>
              </div>
            </div>
          ) : (
            <div className="bg-white/5 border border-white/20 rounded-lg p-8 text-center">
              <Brain className="w-12 h-12 text-white/30 mx-auto mb-3" />
              <p className="text-white/50">Heatmap not available</p>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )
}

export default PredictionResult