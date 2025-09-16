import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, HelpCircle } from 'lucide-react'

const FAQSection = () => {
  const [openFAQ, setOpenFAQ] = useState(null)

  const faqs = [
    {
      question: "What types of medical images does Brain Scan AI support?",
      answer: "Brain Scan AI supports various MRI image formats including DICOM, JPEG, PNG, BMP, and TIFF. The AI model is specifically trained on brain MRI scans and works best with T1-weighted, T2-weighted, and FLAIR sequences. Images should be in axial, sagittal, or coronal orientations."
    },
    {
      question: "How accurate is the AI tumor detection?",
      answer: "Our AI model achieves over 95% accuracy in detecting brain tumors from MRI scans. The model has been trained on thousands of validated medical images and undergoes continuous improvement. However, AI results should always be used as a diagnostic aid alongside professional medical judgment."
    },
    {
      question: "Is my patient data secure and HIPAA compliant?",
      answer: "Yes, Brain Scan AI is fully HIPAA compliant. All data is encrypted both in transit and at rest using industry-standard encryption protocols. We follow strict data governance policies, and patient information is never shared with third parties. Images are automatically deleted after analysis unless you choose to save them."
    },
    {
      question: "Who can use Brain Scan AI?",
      answer: "Brain Scan AI is designed for licensed healthcare professionals including radiologists, neurologists, neurosurgeons, and other doctors involved in brain tumor diagnosis. Users must verify their medical credentials during registration. We also provide admin accounts for healthcare institutions."
    },
    {
      question: "How long does it take to get results?",
      answer: "AI analysis typically takes 30-60 seconds depending on image size and quality. Results include the tumor detection prediction, confidence score, and a visual heatmap showing areas of interest identified by the AI model."
    },
    {
      question: "Can I integrate Brain Scan AI with my existing systems?",
      answer: "Yes, we offer API integration options for healthcare institutions. Our platform can be integrated with existing PACS systems, EHRs, and other medical software. Please contact our enterprise team for custom integration solutions."
    },
    {
      question: "What happens if the AI detects a potential tumor?",
      answer: "If the AI detects patterns consistent with tumor presence, it will provide a detailed report including confidence levels and a heatmap highlighting areas of concern. This information should be used to guide further investigation and professional radiological review, not as a definitive diagnosis."
    },
    {
      question: "Do you provide training for using the platform?",
      answer: "Yes, we provide comprehensive training materials including video tutorials, documentation, and webinar sessions. New users receive onboarding support, and we offer continuing education credits for healthcare professionals."
    },
    {
      question: "What are the system requirements?",
      answer: "Brain Scan AI is a web-based platform that works on any modern browser (Chrome, Firefox, Safari, Edge). No special software installation is required. For optimal performance, we recommend a stable internet connection and modern hardware for uploading large medical images."
    },
    {
      question: "How much does Brain Scan AI cost?",
      answer: "We offer flexible pricing plans for individual practitioners and healthcare institutions. Pricing is based on usage volume and features required. Contact our sales team for detailed pricing information and enterprise discounts."
    }
  ]

  const toggleFAQ = (index) => {
    setOpenFAQ(openFAQ === index ? null : index)
  }

  return (
    <section id="faqs" className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <HelpCircle className="w-8 h-8 text-blue-400" />
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Frequently Asked <span className="text-yellow-400">Questions</span>
          </h2>
          <p className="text-xl text-white/80 leading-relaxed">
            Find answers to common questions about Brain Scan AI. 
            Can't find what you're looking for? Contact our support team.
          </p>
        </motion.div>

        {/* FAQ Items */}
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              className="glass-card overflow-hidden"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full text-left p-6 flex items-center justify-between hover:bg-white/5 transition-colors"
              >
                <h3 className="text-lg font-semibold text-white pr-4">
                  {faq.question}
                </h3>
                <motion.div
                  animate={{ rotate: openFAQ === index ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                  className="flex-shrink-0"
                >
                  <ChevronDown className="w-5 h-5 text-white/60" />
                </motion.div>
              </button>
              
              <AnimatePresence>
                {openFAQ === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 pb-6">
                      <div className="border-t border-white/10 pt-4">
                        <p className="text-white/80 leading-relaxed">
                          {faq.answer}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

        {/* Contact Support */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <div className="glass-card p-8">
            <h3 className="text-2xl font-bold text-white mb-4">Still Have Questions?</h3>
            <p className="text-white/80 mb-6">
              Our support team is here to help you get the most out of Brain Scan AI.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="glass-button px-6 py-3">
                Contact Support
              </button>
              <button className="glass-button-secondary px-6 py-3">
                View Documentation
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default FAQSection