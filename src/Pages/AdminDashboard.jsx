import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useAuth } from '../contexts/AuthContext'
import { adminAPI } from '../utils/api'
import { 
  LogOut, 
  Shield, 
  BarChart3, 
  Users, 
  Database,
  Settings,
  Brain
} from 'lucide-react'
import toast from 'react-hot-toast'

// Components
import SystemOverview from '../components/admin/SystemOverview'
import DoctorManagement from '../components/admin/DoctorManagement'
import AllPredictions from '../components/admin/AllPredictions'
import ProfileUpdate from '../components/dashboard/ProfileUpdate'

const AdminDashboard = () => {
  const { user, logout } = useAuth()
  const [activeTab, setActiveTab] = useState('overview')
  const [doctors, setDoctors] = useState([])
  const [predictions, setPredictions] = useState([])
  const [loadingDoctors, setLoadingDoctors] = useState(false)
  const [loadingPredictions, setLoadingPredictions] = useState(false)
  const [profileModal, setProfileModal] = useState(false)

  useEffect(() => {
    loadDoctors()
    loadPredictions()
  }, [])

  const loadDoctors = async () => {
    setLoadingDoctors(true)
    try {
      const response = await adminAPI.getAllDoctors()
      setDoctors(response.data.doctors || [])
    } catch (error) {
      console.error('Failed to load doctors:', error)
    } finally {
      setLoadingDoctors(false)
    }
  }

  const loadPredictions = async () => {
    setLoadingPredictions(true)
    try {
      const response = await adminAPI.getAllPredictions()
      setPredictions(response.data.logs || [])
    } catch (error) {
      console.error('Failed to load predictions:', error)
    } finally {
      setLoadingPredictions(false)
    }
  }

  const handleDeleteDoctor = async (email) => {
    try {
      await adminAPI.deleteDoctor(email)
      toast.success('Doctor deleted successfully')
      loadDoctors()
      // Refresh predictions as well since they might be affected
      loadPredictions()
    } catch (error) {
      console.error('Failed to delete doctor:', error)
    }
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'doctors', label: 'Doctors', icon: Users },
    { id: 'predictions', label: 'All Predictions', icon: Database },
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
                <p className="text-white/60 text-sm">Admin Dashboard</p>
              </div>
            </div>

            {/* User Menu */}
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-white font-medium">{user?.name}</p>
                <p className="text-white/60 text-sm flex items-center space-x-1">
                  <Shield className="w-3 h-3" />
                  <span>Administrator</span>
                </p>
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
                {tab.id === 'doctors' && doctors.length > 0 && (
                  <span className={`px-2 py-0.5 rounded-full text-xs ${
                    activeTab === tab.id ? 'bg-black/20 text-black' : 'bg-white/20 text-white'
                  }`}>
                    {doctors.length}
                  </span>
                )}
                {tab.id === 'predictions' && predictions.length > 0 && (
                  <span className={`px-2 py-0.5 rounded-full text-xs ${
                    activeTab === tab.id ? 'bg-black/20 text-black' : 'bg-white/20 text-white'
                  }`}>
                    {predictions.length}
                  </span>
                )}
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
          {activeTab === 'overview' && (
            <SystemOverview
              doctors={doctors}
              predictions={predictions}
              loading={loadingDoctors || loadingPredictions}
            />
          )}

          {activeTab === 'doctors' && (
            <DoctorManagement
              doctors={doctors}
              onDeleteDoctor={handleDeleteDoctor}
              loading={loadingDoctors}
            />
          )}

          {activeTab === 'predictions' && (
            <AllPredictions
              predictions={predictions}
              loading={loadingPredictions}
            />
          )}
        </motion.div>
      </div>

      {/* Profile Modal */}
      <ProfileUpdate
        isOpen={profileModal}
        onClose={() => setProfileModal(false)}
      />
    </div>
  )
}

export default AdminDashboard