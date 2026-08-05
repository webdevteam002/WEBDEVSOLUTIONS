'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'

export function Scene1Hero() {
  return (
    <section className="relative h-screen w-full flex flex-col items-center justify-center overflow-hidden">
      <div className="absolute top-8 left-8 z-50">
        <Image src="/logo.png" alt="WebDev Solutions Logo" width={64} height={64} className="drop-shadow-lg" />
      </div>
      
      <div className="z-10 text-center max-w-4xl px-4">
        <motion.h1
          className="text-5xl md:text-7xl font-bold mb-6 tracking-tight text-transparent bg-clip-text bg-gradient-to-br from-brand-silver to-white"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        >
          We Engineer Digital Experiences That Scale.
        </motion.h1>
        <motion.p
          className="text-xl md:text-2xl text-brand-cyan mb-10"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        >
          From SaaS platforms to AI-powered systems...
        </motion.p>
        <motion.button
          className="glass-panel px-8 py-4 rounded-full text-lg font-medium text-white hover:bg-brand-blue/20 transition-all neon-glow"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.4, type: 'spring' }}
        >
          Start Your Project
        </motion.button>
      </div>
    </section>
  )
}
