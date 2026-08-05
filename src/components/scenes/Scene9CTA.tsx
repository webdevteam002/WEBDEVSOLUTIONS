'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
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
    
    window.open(gmailUrl, '_blank', 'noopener,noreferrer')
  }

  return (
    <section id="contact" className="relative h-screen w-full flex items-center justify-center bg-brand-navy overflow-hidden">
      {/* PNG Logo Background */}
      <motion.div
        initial={{ y: 0 }}
        animate={{ y: -15 }}
        transition={{ type: "spring", stiffness: 100, damping: 20, repeat: Infinity, repeatType: "reverse" }}
        className="absolute inset-0 flex items-center justify-center opacity-20 pointer-events-none scale-150"
      >
        <div className="relative w-[300px] h-[300px] md:w-[600px] md:h-[600px]">
          <Image 
            src="/logo.png" 
            alt="WebDev Solutions" 
            fill 
            className="object-contain drop-shadow-[0_0_30px_rgba(34,211,238,0.5)]" 
          />
        </div>
      </motion.div>

      <div className="z-10 max-w-2xl text-center px-4">
        <h2 className="text-5xl md:text-7xl font-bold mb-8 text-white drop-shadow-xl">
          Let's Build Something That <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-cyan to-brand-blue">Scales</span>
        </h2>
        <p className="text-xl text-brand-silver mb-12">
          Ready to transform your digital presence? We're taking on new projects for Q3.
        </p>
        
        <div className="flex flex-col gap-4 max-w-md mx-auto relative glass-panel p-6 rounded-2xl border border-white/10">
          <div className="relative w-full">
            <input 
              type="email" 
              value={email}
              onChange={(e) => {
                setEmail(e.target.value)
                setError('')
              }}
              placeholder="Your email address" 
              className={`w-full bg-black/40 border ${error ? 'border-red-500' : 'border-white/10'} rounded-xl px-6 py-4 text-white focus:outline-none focus:border-brand-cyan transition-colors`}
            />
            {error && (
              <p className="text-red-400 text-sm mt-2 text-left px-2">{error}</p>
            )}
          </div>
          
          <button 
            onClick={handleGetInTouch}
            className="w-full text-center block bg-brand-blue hover:bg-brand-cyan text-white font-bold py-4 rounded-xl transition-colors shadow-[0_0_20px_rgba(37,99,235,0.4)] hover:shadow-[0_0_30px_rgba(34,211,238,0.6)]"
          >
            Get In Touch
          </button>
        </div>
      </div>
    </section>
  )
}
