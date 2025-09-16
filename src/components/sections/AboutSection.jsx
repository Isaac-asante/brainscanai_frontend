import React from 'react'
import { motion } from 'framer-motion'
import { Brain, Users, Award, Shield, Zap, Target } from 'lucide-react'

const AboutSection = () => {
  const features = [
    {
      icon: Brain,
      title: 'AI-Powered Analysis',
      description: 'Advanced deep learning models trained on thousands of MRI scans for accurate tumor detection.'
    },
    {
      icon: Shield,
      title: 'HIPAA Compliant',
      description: 'Your medical data is protected with enterprise-grade security and privacy measures.'
    },
    {
      icon: Zap,
      title: 'Instant Results',
      description: 'Get AI analysis results in seconds, not hours, accelerating diagnosis and treatment.'
    },
    {
      icon: Target,
      title: 'High Accuracy',
      description: 'Our model achieves over 95% accuracy in detecting brain tumors from MRI images.'
    },
    {
      icon: Users,
      title: 'Doctor Friendly',
      description: 'Designed by medical professionals for medical professionals with intuitive workflows.'
    },
    {
      icon: Award,
      title: 'Clinically Validated',
      description: 'Validated through extensive clinical trials and peer-reviewed research studies.'
    }
  ]

  return (
    <section id="about" className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            About <span className="text-yellow-400">Brain Scan AI</span>
          </h2>
          <p className="text-xl text-white/80 max-w-3xl mx-auto leading-relaxed">
            Revolutionizing brain tumor detection with cutting-edge artificial intelligence. 
            Our platform empowers healthcare professionals with fast, accurate, and reliable 
            AI-assisted diagnosis tools.
          </p>
        </motion.div>

        {/* Mission Statement */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="glass-card p-8 mb-16 text-center"
        >
          <div className="max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold text-white mb-4">Our Mission</h3>
            <p className="text-white/80 text-lg leading-relaxed">
              To democratize access to advanced medical AI technology, making early detection 
              of brain tumors faster, more accurate, and more accessible to healthcare providers 
              worldwide. We believe that every patient deserves the best possible care, and AI 
              can help doctors provide that care more effectively.
            </p>
          </div>
        </motion.div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                className="glass-card p-6 text-center group hover:bg-white/15 transition-all duration-300"
              >
                <div className="w-16 h-16 bg-yellow-400/20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-yellow-400/30 transition-colors">
                  <Icon className="w-8 h-8 text-yellow-400" />
                </div>
                <h4 className="text-xl font-bold text-white mb-3">{feature.title}</h4>
                <p className="text-white/70 leading-relaxed">{feature.description}</p>
              </motion.div>
            )
          })}
        </div>

        {/* Statistics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 glass-card p-8"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl md:text-4xl font-bold text-yellow-400 mb-2">95%+</div>
              <div className="text-white/70">Accuracy Rate</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-yellow-400 mb-2">10K+</div>
              <div className="text-white/70">Scans Analyzed</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-yellow-400 mb-2">500+</div>
              <div className="text-white/70">Healthcare Partners</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-yellow-400 mb-2">24/7</div>
              <div className="text-white/70">Available</div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default AboutSection