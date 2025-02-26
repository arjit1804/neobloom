'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { FiMail, FiSend, FiCheck } from 'react-icons/fi'

export default function NewsletterSignup() {
  const [email, setEmail] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!email) {
      setError('Please enter your email address')
      return
    }
    
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setError('Please enter a valid email address')
      return
    }
    
    setError('')
    setIsSubmitting(true)
    
    // Simulate API call
    try {
      await new Promise(resolve => setTimeout(resolve, 1500))
      setIsSuccess(true)
      setEmail('')
    } catch (err) {
      setError('Something went wrong. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="glass-card relative overflow-hidden">
        {/* Background grid effect */}
        <div className="absolute inset-0 cyber-grid-bg opacity-20"></div>
        
        <div className="relative z-10">
          <div className="flex items-center justify-center mb-2">
            <div className="w-12 h-12 rounded-full bg-neon-blue/20 flex items-center justify-center">
              <FiMail className="text-2xl text-neon-blue" />
            </div>
          </div>
          
          <h3 className="text-2xl font-bold text-center mb-2 neon-text-blue">
            Stay in the Loop
          </h3>
          
          <p className="text-gray-300 text-center mb-6">
            Subscribe to our newsletter for the latest AI-generated content, trends, and updates.
          </p>
          
          {isSuccess ? (
            <motion.div 
              className="flex flex-col items-center justify-center py-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="w-16 h-16 rounded-full bg-neon-green/20 flex items-center justify-center mb-4">
                <FiCheck className="text-3xl text-neon-green" />
              </div>
              <p className="text-neon-green font-medium">
                Thank you for subscribing!
              </p>
              <p className="text-gray-400 text-sm mt-2">
                We've sent a confirmation email to your inbox.
              </p>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="relative">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-grow">
                  <input
                    type="email"
                    placeholder="Enter your email address"
                    className="w-full px-4 py-3 bg-cyber-light/20 border border-cyber-light/30 rounded-md focus:outline-none focus:ring-2 focus:ring-neon-blue/50 text-white placeholder-gray-500"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isSubmitting}
                  />
                  {error && (
                    <p className="absolute -bottom-6 left-0 text-xs text-red-500">
                      {error}
                    </p>
                  )}
                </div>
                <button
                  type="submit"
                  className="btn-primary flex items-center justify-center"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <div className="loading-dots">
                      <div></div>
                      <div></div>
                      <div></div>
                    </div>
                  ) : (
                    <>
                      Subscribe <FiSend className="ml-2" />
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
          
          <p className="text-gray-500 text-xs text-center mt-8">
            By subscribing, you agree to our <a href="/privacy" className="text-neon-blue hover:text-neon-pink">Privacy Policy</a> and consent to receive updates from NeoBloom.
          </p>
        </div>
      </div>
    </div>
  )
} 