import React from 'react'
import { motion } from 'framer-motion'
import { UserPlus, Upload, Brain, Download, Shield, Eye } from 'lucide-react'

const HowToUseSection = () => {
  const steps = [
    {
      icon: UserPlus,
      title: 'Create Account',
      description: 'Sign up as a doctor or admin with email verification for secure access.',
      details: ['Enter your professional details', 'Verify your email address', 'Complete profile setup']
    },
    {
      icon: Upload,
      title: 'Upload MRI Scan',
      description: 'Securely upload brain MRI images in DICOM, JPEG, or PNG format.',
      details: ['Drag & drop or browse files', 'Supports multiple formats', 'Automatic preprocessing']
    },
    {
      icon: Brain,
      title: 'AI Analysis',
      description: 'Our AI model analyzes the scan and provides detailed results with confidence scores.',
      details: ['Advanced CNN processing', 'Real-time analysis', 'Confidence scoring']
    },
    {
      icon: Eye,
      title: 'Review Results',
      description: 'View prediction results with attention heatmaps showing areas of interest.',
      details: ['Detailed predictions', 'Visual heatmaps', 'Confidence levels']
    },
    {
      icon: Download,
      title: 'Export Reports',
      description: 'Download comprehensive reports in PDF, CSV, or JSON format for records.',
      details: ['Multiple export formats', 'Detailed documentation', 'Easy sharing']
    },
    {
      icon: Shield,
      title: 'Secure Storage',
      description: 'All data is encrypted and stored securely with full HIPAA compliance.',
      details: ['End-to-end encryption', 'HIPAA compliant', 'Secure data management']
    }
  ]

  return (
    <section id="how-to-use" className="py-20 px-4 sm:px-6 lg:px-8 bg-white/5">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            How to Use <span className="text-yellow-400">Brain Scan AI</span>
          </h2>
          <p className="text-xl text-white/80 max-w-3xl mx-auto leading-relaxed">
            Get started with our AI-powered brain tumor detection in just a few simple steps. 
            Our platform is designed for ease of use while maintaining the highest medical standards.
          </p>
        </motion.div>

        {/* Steps */}
        <div className="space-y-8">
          {steps.map((step, index) => {
            const Icon = step.icon
            const isEven = index % 2 === 0
            
            return (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, x: isEven ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className={`flex flex-col lg:flex-row items-center gap-8 ${
                  isEven ? '' : 'lg:flex-row-reverse'
                }`}
              >
                {/* Content */}
                <div className="flex-1 glass-card p-8">
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="flex items-center justify-center w-12 h-12 bg-yellow-400 text-black rounded-full font-bold text-lg">
                      {index + 1}
                    </div>
                    <div className="w-16 h-16 bg-yellow-400/20 rounded-full flex items-center justify-center">
                      <Icon className="w-8 h-8 text-yellow-400" />
                    </div>
                    <h3 className="text-2xl font-bold text-white">{step.title}</h3>
                  </div>
                  
                  <p className="text-white/80 text-lg mb-6 leading-relaxed">
                    {step.description}
                  </p>
                  
                  <ul className="space-y-2">
                    {step.details.map((detail, idx) => (
                      <motion.li
                        key={idx}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: (index * 0.1) + (idx * 0.05) }}
                        className="flex items-center space-x-3 text-white/70"
                      >
                        <div className="w-2 h-2 bg-yellow-400 rounded-full flex-shrink-0"></div>
                        <span>{detail}</span>
                      </motion.li>
                    ))}
                  </ul>
                </div>

                {/* Visual */}
                <div className="flex-1 max-w-md">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="glass-card p-8 text-center"
                  >
                    <div className="w-24 h-24 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Icon className="w-12 h-12 text-black" />
                    </div>
                    <div className="text-white/60 text-sm">Step {index + 1}</div>
                    <div className="text-white font-medium">{step.title}</div>
                  </motion.div>
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <div className="glass-card p-8">
            <h3 className="text-2xl font-bold text-white mb-4">Ready to Get Started?</h3>
            <p className="text-white/80 mb-6">
              Join thousands of healthcare professionals using Brain Scan AI for faster, more accurate diagnoses.
            </p>
            <button
              onClick={() => document.getElementById('home')?.scrollIntoView({ behavior: 'smooth' })}
              className="glass-button px-8 py-3 text-lg"
            >
              Start Using Brain Scan AI
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default HowToUseSection