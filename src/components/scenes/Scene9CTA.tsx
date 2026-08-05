'use client'

import { motion } from 'framer-motion'

export function Scene9CTA() {
  return (
    <section className="relative h-screen w-full flex items-center justify-center bg-brand-navy overflow-hidden">
      {/* Glowing fully assembled hexagon placeholder */}
      <motion.div
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] opacity-10 pointer-events-none"
        animate={{ rotate: 360 }}
        transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
      >
        <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_0_30px_rgba(34,211,238,0.8)]">
          <polygon points="50 1 95 25 95 75 50 99 5 75 5 25" fill="rgba(37,99,235,0.1)" stroke="#22D3EE" strokeWidth="1" />
        </svg>
      </motion.div>

      <div className="z-10 max-w-2xl text-center px-4">
        <h2 className="text-5xl md:text-7xl font-bold mb-8">
          Let's Build Something That <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-cyan to-brand-blue">Scales</span>
        </h2>
        <p className="text-xl text-brand-silver mb-12">
          Ready to transform your digital presence? We're taking on new projects for Q3.
        </p>
        
        <form className="flex flex-col gap-4 max-w-md mx-auto">
          <input 
            type="email" 
            placeholder="Your email address" 
            className="w-full bg-white/5 border border-white/10 rounded-lg px-6 py-4 text-white focus:outline-none focus:border-brand-cyan transition-colors"
          />
          <button 
            type="button"
            className="w-full bg-brand-blue hover:bg-brand-cyan text-white font-bold py-4 rounded-lg transition-colors neon-glow"
          >
            Get In Touch
          </button>
        </form>
      </div>
    </section>
  )
}
