'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'

export function Scene9CTA() {
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')

  const handleGetInTouch = () => {
    if (!email.trim()) {
      setError('Please enter your email address first.')
      return
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address.')
      return
    }
    
    setError('')
    
    const subject = encodeURIComponent("Project Inquiry - WebDev Solutions")
    const body = encodeURIComponent(`Hello WebDev Solutions team,

I am interested in your development services and would like to discuss a potential project.

My contact email is: ${email}
WhatsApp: 
Any other social media: 

Project Type (e.g., Custom Web App, SaaS, E-Commerce): 
Budget Range: 
Timeline: 

Brief Description:


Thanks,
[Your Name]`)

    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=webdev.team002@gmail.com&su=${subject}&body=${body}`
    const mailtoUrl = `mailto:webdev.team002@gmail.com?subject=${subject}&body=${body}`
    
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)
    
    if (isMobile) {
      window.location.href = mailtoUrl
    } else {
      window.open(gmailUrl, '_blank', 'noopener,noreferrer')
    }
  }

  return (
    <section id="contact" className="relative h-screen w-full flex items-center bg-[#0A0E1A] overflow-hidden">
      
      {/* Centralized completed Hexagon Mark (all 6 shards converged) */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
        <motion.div 
          className="relative w-[500px] h-[500px] md:w-[700px] md:h-[700px] opacity-40 md:opacity-60 md:translate-x-32"
          initial={{ scale: 0.8, filter: 'blur(10px)' }}
          whileInView={{ scale: 1, filter: 'blur(0px)' }}
          transition={{ duration: 1, ease: "easeOut" }}
          viewport={{ once: true }}
        >
          <img 
            src="/contact-graphic.png" 
            alt="WebDev Solutions Contact Graphic" 
            className="w-full h-full object-contain"
          />
        </motion.div>
      </div>

      <div className="z-10 w-full max-w-7xl mx-auto px-4 pl-8 md:pl-32 flex flex-col justify-center h-full">
        <div className="max-w-xl text-left">
          <h2 className="text-5xl md:text-7xl font-bold mb-8 text-white drop-shadow-xl">
            Let's Build Something That <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-cyan to-brand-blue">Scales</span>
          </h2>
          <p className="text-xl text-[#C9CDD6] mb-12">
            Ready to transform your digital presence? We're taking on new projects for Q3.
          </p>
          
          <motion.div 
            layoutId="faq-cta-handoff"
            className="flex flex-col gap-4 relative bg-[#0A0E1A]/60 backdrop-blur-xl p-8 rounded-3xl border border-brand-cyan/50 shadow-[0_0_40px_rgba(34,211,238,0.2)]"
          >
            <div className="relative w-full">
              <input 
                type="email" 
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value)
                  setError('')
                }}
                placeholder="Your email address" 
                className={`w-full bg-white/5 border ${error ? 'border-red-500' : 'border-white/20'} rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-brand-cyan transition-colors text-lg`}
              />
              {error && (
                <p className="text-red-400 text-sm mt-2 text-left px-2">{error}</p>
              )}
            </div>
            
            <button 
              onClick={handleGetInTouch}
              className="w-full text-center block bg-brand-cyan hover:bg-[#1E40AF] hover:text-white text-[#0A0E1A] font-bold py-4 rounded-2xl transition-all duration-300 shadow-[0_0_20px_rgba(34,211,238,0.3)] text-lg"
            >
              Get In Touch
            </button>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
