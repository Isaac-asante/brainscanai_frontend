import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Users, Trash2, Search, UserX, Calendar, Mail, MoreHorizontal, AlertTriangle } from 'lucide-react'
import { format } from 'date-fns'

const DoctorManagement = ({ doctors, onDeleteDoctor, loading }) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [deleteConfirm, setDeleteConfirm] = useState(null)
  const [showOptions, setShowOptions] = useState(null)

  const filteredDoctors = doctors.filter(doctor =>
    doctor.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doctor.email?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), 'MMM dd, yyyy')
    } catch {
      return dateString
    }
  }

  const handleDeleteClick = (doctor) => {
    setDeleteConfirm(doctor)
    setShowOptions(null)
  }

  const confirmDelete = () => {
    if (deleteConfirm) {
      onDeleteDoctor(deleteConfirm.email)
      setDeleteConfirm(null)
    }
  }

  return (
    <div className="glass-card p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-blue-500/20 rounded-lg">
            <Users className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">Doctor Management</h3>
            <p className="text-white/70 text-sm">
              {doctors.length} doctor{doctors.length !== 1 ? 's' : ''} registered
            </p>
          </div>
        </div>

        {/* Search */}
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/50" />
          <input
            type="text"
            placeholder="Search doctors..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="glass-input pl-10 pr-4 py-2 text-sm w-full"
          />
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="w-8 h-8 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white/70">Loading doctors...</p>
        </div>
      ) : filteredDoctors.length === 0 ? (
        <div className="text-center py-12">
          <UserX className="w-16 h-16 text-white/20 mx-auto mb-4" />
          <h4 className="text-lg font-medium text-white/60 mb-2">
            {searchTerm ? 'No doctors found' : 'No Doctors Registered'}
          </h4>
          <p className="text-white/40">
            {searchTerm ? 'Try adjusting your search terms' : 'No doctors have registered yet'}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          <AnimatePresence>
            {filteredDoctors.map((doctor, index) => (
              <motion.div
                key={doctor.email}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white/5 border border-white/10 rounded-lg p-4 hover:bg-white/10 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4 flex-1">
                    {/* Avatar */}
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-lg">
                        {doctor.name?.charAt(0)?.toUpperCase() || 'D'}
                      </span>
                    </div>

                    {/* Info */}
                    <div className="flex-1">
                      <h4 className="text-white font-medium">Dr. {doctor.name}</h4>
                      <div className="flex items-center space-x-4 text-sm text-white/60 mt-1">
                        <div className="flex items-center space-x-1">
                          <Mail className="w-3 h-3" />
                          <span>{doctor.email}</span>
                        </div>
                        {doctor.created_at && (
                          <div className="flex items-center space-x-1">
                            <Calendar className="w-3 h-3" />
                            <span>Joined {formatDate(doctor.created_at)}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Status */}
                    <div className="flex items-center space-x-2">
                      <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                        doctor.verified 
                          ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                          : 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                      }`}>
                        {doctor.verified ? 'Verified' : 'Unverified'}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
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
                          className="absolute right-0 top-full mt-1 bg-gray-800 border border-white/20 rounded-lg shadow-xl z-10 min-w-[140px]"
                        >
                          <button
                            onClick={() => handleDeleteClick(doctor)}
                            className="w-full px-3 py-2 text-left text-red-400 hover:bg-red-500/20 rounded-lg transition-colors flex items-center space-x-2"
                          >
                            <Trash2 className="w-3 h-3" />
                            <span className="text-sm">Delete Doctor</span>
                          </button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </motion.div>
            ))}
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
                <h3 className="text-lg font-bold text-white mb-2">Delete Doctor</h3>
                <p className="text-white/70 mb-2">
                  Are you sure you want to delete Dr. <strong>{deleteConfirm.name}</strong>?
                </p>
                <p className="text-white/60 text-sm mb-6">
                  Email: {deleteConfirm.email}
                </p>
                <p className="text-red-400 text-sm mb-6">
                  This action cannot be undone and will delete all their prediction history.
                </p>
                <div className="flex space-x-3">
                  <button
                    onClick={() => setDeleteConfirm(null)}
                    className="glass-button-secondary flex-1"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={confirmDelete}
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

export default DoctorManagement