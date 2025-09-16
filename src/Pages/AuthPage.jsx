import React, { useEffect } from 'react'
import { motion } from 'framer-motion'
import { useAuth } from '../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'

// Components
import Navbar from '../components/navigation/Navbar'
import AuthForm from '../components/auth/AuthForm'
import AboutSection from '../components/sections/AboutSection'
import HowToUseSection from '../components/sections/HowToUseSection'
import FAQSection from '../components/sections/FAQSection'

const AuthPage = () => {
  const { isAuthenticated, isDoctor, isAdmin, loading } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!loading && isAuthenticated) {
      if (isDoctor) {
        navigate('/doctor-dashboard')
      } else if (isAdmin) {
        navigate('/admin-dashboard')
      }
    }
  }, [isAuthenticated, isDoctor, isAdmin, loading, navigate])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white/70">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      
      {/* Hero Section with Auth Form */}
      <section id="home" className="min-h-screen flex pt-16">
        {/* Left side - Desktop illustration, Mobile background */}
        <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/20 via-transparent to-yellow-400/10"></div>
          
          {/* Floating brain illustration */}
          <motion.div
            animate={{ y: [0, -20, 0] }}
            transition={{ duration: 6, repeat: Infinity }}
            className="flex items-center justify-center w-full"
          >
            <div className="text-center">
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ duration: 1, type: 'spring' }}
                className="w-64 h-64 mx-auto mb-8 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-full flex items-center justify-center shadow-2xl"
              >
                <div className="w-48 h-48 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                  <span className="text-6xl">🧠</span>
                </div>
              </motion.div>
              
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="text-4xl font-bold text-white mb-4"
              >
                Brain Scan AI
              </motion.h1>
              
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="text-xl text-white/80 max-w-md mx-auto"
              >
                Advanced AI-powered brain tumor detection and analysis platform
              </motion.p>

              {/* Key Features */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 }}
                className="mt-8 space-y-3 text-left max-w-sm mx-auto"
              >
                {[
                  "95%+ Accuracy Rate",
                  "Instant AI Analysis",
                  "HIPAA Compliant",
                  "Clinical Grade Security"
                ].map((feature, index) => (
                  <motion.div
                    key={feature}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1 + (index * 0.1) }}
                    className="flex items-center space-x-3 text-white/80"
                  >
                    <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                    <span>{feature}</span>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </motion.div>

          {/* Floating particles */}
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-yellow-400/30 rounded-full"
              animate={{
                x: [0, Math.random() * 100 - 50],
                y: [0, Math.random() * 100 - 50],
                opacity: [0, 1, 0]
              }}
              transition={{
                duration: Math.random() * 3 + 2,
                repeat: Infinity,
                delay: Math.random() * 2
              }}
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`
              }}
            />
          ))}
        </div>

        {/* Right side - Auth form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-8 relative">
          {/* Mobile background overlay */}
          <div className="lg:hidden absolute inset-0 bg-gradient-to-br from-yellow-400/10 via-transparent to-yellow-400/5"></div>
          
          <div className="w-full max-w-md relative z-10">
            <AuthForm />
          </div>
        </div>
      </section>

      {/* About Section */}
      <AboutSection />

      {/* How to Use Section */}
      <HowToUseSection />

      {/* FAQ Section */}
      <FAQSection />

      {/* Footer */}
      <footer className="py-12 px-4 sm:px-6 lg:px-8 border-t border-white/20">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="p-2 bg-yellow-400 rounded-lg">
              <span className="text-black text-xl">🧠</span>
            </div>
            <h3 className="text-xl font-bold text-white">Brain Scan AI</h3>
          </div>
          <p className="text-white/60 mb-4">
            Advancing healthcare through artificial intelligence
          </p>
          <div className="flex flex-wrap justify-center gap-6 text-sm text-white/50">
            <span>© 2024 Brain Scan AI. All rights reserved.</span>
            <span>•</span>
            <button className="hover:text-white transition-colors">Privacy Policy</button>
            <span>•</span>
            <button className="hover:text-white transition-colors">Terms of Service</button>
            <span>•</span>
            <button className="hover:text-white transition-colors">Contact Us</button>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default AuthPage