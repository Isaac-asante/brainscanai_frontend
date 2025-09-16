import React, { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { motion } from 'framer-motion'
import { Upload, X, FileImage, AlertCircle } from 'lucide-react'

const FileUpload = ({ onFileSelect, disabled = false }) => {
  const [previewUrl, setPreviewUrl] = useState(null)
  const [fileName, setFileName] = useState('')

  const onDrop = useCallback((acceptedFiles, rejectedFiles) => {
    if (rejectedFiles.length > 0) {
      return
    }

    const file = acceptedFiles[0]
    if (file) {
      setFileName(file.name)
      
      // Create preview
      const reader = new FileReader()
      reader.onload = (e) => {
        setPreviewUrl(e.target.result)
      }
      reader.readAsDataURL(file)
      
      // Pass file to parent
      onFileSelect(file)
    }
  }, [onFileSelect])

  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.bmp', '.tiff']
    },
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024, // 10MB
    disabled
  })

  const clearFile = () => {
    setPreviewUrl(null)
    setFileName('')
    onFileSelect(null)
  }

  return (
    <div className="space-y-4">
      <motion.div
        {...getRootProps()}
        className={`
          relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-300
          ${isDragActive && !isDragReject ? 'border-yellow-400 bg-yellow-400/10' : ''}
          ${isDragReject ? 'border-red-400 bg-red-400/10' : ''}
          ${!isDragActive && !isDragReject ? 'border-white/30 hover:border-yellow-400/50 hover:bg-white/5' : ''}
          ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        `}
        whileHover={!disabled ? { scale: 1.02 } : {}}
        whileTap={!disabled ? { scale: 0.98 } : {}}
      >
        <input {...getInputProps()} />
        
        {!previewUrl ? (
          <div className="space-y-4">
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Upload className="w-12 h-12 text-yellow-400 mx-auto" />
            </motion.div>
            
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">
                {isDragActive ? 'Drop your MRI image here' : 'Upload MRI Image'}
              </h3>
              <p className="text-white/70 text-sm">
                Drag & drop an MRI scan or click to browse
              </p>
              <p className="text-white/50 text-xs mt-2">
                Supports: JPEG, PNG, BMP, TIFF (Max 10MB)
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="relative">
              <img
                src={previewUrl}
                alt="MRI Preview"
                className="max-h-48 mx-auto rounded-lg shadow-lg"
              />
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  clearFile()
                }}
                className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 shadow-lg transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <div className="flex items-center justify-center space-x-2">
              <FileImage className="w-4 h-4 text-yellow-400" />
              <span className="text-white font-medium text-sm">{fileName}</span>
            </div>
          </div>
        )}

        {isDragReject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 flex items-center justify-center bg-red-500/20 rounded-xl"
          >
            <div className="text-center">
              <AlertCircle className="w-8 h-8 text-red-400 mx-auto mb-2" />
              <p className="text-red-400 text-sm">Invalid file type or size</p>
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  )
}

export default FileUpload