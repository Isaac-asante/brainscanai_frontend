import React from 'react'
import { motion } from 'framer-motion'
import { 
  Users, 
  Brain, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle, 
  Clock,
  BarChart3,
  Activity
} from 'lucide-react'

const SystemOverview = ({ doctors, predictions, loading }) => {
  const totalDoctors = doctors.length
  const verifiedDoctors = doctors.filter(d => d.verified).length
  const unverifiedDoctors = totalDoctors - verifiedDoctors
  
  const totalPredictions = predictions.length
  const tumorDetected = predictions.filter(p => p.result === 'Tumor').length
  const noTumor = totalPredictions - tumorDetected
  
  const todayPredictions = predictions.filter(p => {
    const today = new Date().toISOString().split('T')[0]
    return p.timestamp?.startsWith(today)
  }).length

  const averageConfidence = predictions.length > 0 
    ? (predictions.reduce((sum, p) => sum + (p.confidence || 0), 0) / predictions.length * 100).toFixed(1)
    : 0

  const stats = [
    {
      title: 'Total Doctors',
      value: totalDoctors,
      icon: Users,
      color: 'blue',
      subtitle: `${verifiedDoctors} verified, ${unverifiedDoctors} pending`
    },
    {
      title: 'Total Predictions',
      value: totalPredictions,
      icon: Brain,
      color: 'purple',
      subtitle: `${todayPredictions} today`
    },
    {
      title: 'Tumor Detected',
      value: tumorDetected,
      icon: AlertTriangle,
      color: 'red',
      subtitle: `${totalPredictions > 0 ? ((tumorDetected / totalPredictions) * 100).toFixed(1) : 0}% of cases`
    },
    {
      title: 'No Tumor',
      value: noTumor,
      icon: CheckCircle,
      color: 'green',
      subtitle: `${totalPredictions > 0 ? ((noTumor / totalPredictions) * 100).toFixed(1) : 0}% of cases`
    },
    {
      title: 'Avg. Confidence',
      value: `${averageConfidence}%`,
      icon: TrendingUp,
      color: 'yellow',
      subtitle: 'Model confidence level'
    },
    {
      title: 'System Status',
      value: 'Online',
      icon: Activity,
      color: 'green',
      subtitle: 'All systems operational'
    }
  ]

  const colorClasses = {
    blue: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    purple: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
    red: 'bg-red-500/20 text-red-400 border-red-500/30',
    green: 'bg-green-500/20 text-green-400 border-green-500/30',
    yellow: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-3">
        <div className="p-2 bg-green-500/20 rounded-lg">
          <BarChart3 className="w-5 h-5 text-green-400" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-white">System Overview</h3>
          <p className="text-white/70 text-sm">Real-time platform statistics and metrics</p>
        </div>
      </div>

      {loading ? (
        <div className="glass-card p-12 text-center">
          <div className="w-8 h-8 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white/70">Loading system data...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {stats.map((stat, index) => {
            const Icon = stat.icon
            return (
              <motion.div
                key={stat.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="glass-card p-6 hover:bg-white/10 transition-colors"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-lg border ${colorClasses[stat.color]}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  {stat.title === 'System Status' && (
                    <div className="flex items-center space-x-1">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                      <span className="text-green-400 text-xs font-medium">Live</span>
                    </div>
                  )}
                </div>

                <div>
                  <h4 className="text-2xl font-bold text-white mb-1">{stat.value}</h4>
                  <p className="text-white/70 text-sm font-medium mb-2">{stat.title}</p>
                  <p className="text-white/50 text-xs">{stat.subtitle}</p>
                </div>
              </motion.div>
            )
          })}
        </div>
      )}

      {/* Quick Actions */}
      <div className="glass-card p-6">
        <h4 className="text-lg font-bold text-white mb-4">Quick Actions</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <button className="glass-button-secondary p-4 text-left hover:bg-white/10">
            <Users className="w-5 h-5 text-blue-400 mb-2" />
            <div className="text-sm font-medium text-white">Manage Doctors</div>
            <div className="text-xs text-white/60">View and manage accounts</div>
          </button>
          
          <button className="glass-button-secondary p-4 text-left hover:bg-white/10">
            <Brain className="w-5 h-5 text-purple-400 mb-2" />
            <div className="text-sm font-medium text-white">View Predictions</div>
            <div className="text-xs text-white/60">All system predictions</div>
          </button>
          
          <button className="glass-button-secondary p-4 text-left hover:bg-white/10">
            <BarChart3 className="w-5 h-5 text-green-400 mb-2" />
            <div className="text-sm font-medium text-white">Analytics</div>
            <div className="text-xs text-white/60">Detailed reports</div>
          </button>
          
          <button className="glass-button-secondary p-4 text-left hover:bg-white/10">
            <Activity className="w-5 h-5 text-yellow-400 mb-2" />
            <div className="text-sm font-medium text-white">System Health</div>
            <div className="text-xs text-white/60">Monitor performance</div>
          </button>
        </div>
      </div>
    </div>
  )
}

export default SystemOverview