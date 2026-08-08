'use client'

import { useRef } from 'react'
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion'

export function Scene7Proof() {
  const containerRef = useRef<HTMLElement>(null)
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  })

  const shouldReduceMotion = useReducedMotion()

  // Typography scale-up
  const scale2Plus = useTransform(scrollYProgress, [0.3, 0.5], [0.5, 1])
  const opacity2Plus = useTransform(scrollYProgress, [0.3, 0.5], [0, 1])

  // "Years Experience" reveal (opacity via scroll)
  const opacityYears = useTransform(scrollYProgress, [0.5, 0.7], [0, 1])
  const xYears = useTransform(scrollYProgress, [0.5, 0.7], [-20, 0])

  // Subtitle fade
  const opacitySub = useTransform(scrollYProgress, [0.7, 0.8], [0, 1])

  // Hand-off into FAQ: fade and scale down slightly
  const exitOpacity = useTransform(scrollYProgress, [0.9, 1], [1, 0.15])
  const exitScale = useTransform(scrollYProgress, [0.9, 1], [1, 0.95])

  return (
    <section ref={containerRef} className="h-[150vh] relative w-full bg-[#0A0E1A] flex flex-col justify-center overflow-hidden">
      <motion.div 
        className="sticky top-0 h-screen flex flex-col items-center justify-center w-full"
        style={{ 
          opacity: shouldReduceMotion ? 1 : exitOpacity, 
          scale: shouldReduceMotion ? 1 : exitScale 
        }}
      >
        
        {/* Anchor Point (Conceptual hand-off from Portfolio) */}
        <motion.div 
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-white/5 rounded-lg border border-white/10"
          style={{
            opacity: useTransform(scrollYProgress, [0.1, 0.3], [1, 0]),
            scale: useTransform(scrollYProgress, [0.1, 0.3], [1, 0.5])
          }}
        />

        <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
          <motion.div 
            className="text-8xl md:text-[12rem] lg:text-[16rem] font-bold text-transparent bg-clip-text bg-gradient-to-br from-white to-white/50 leading-none tracking-tighter"
            style={shouldReduceMotion ? {} : { scale: scale2Plus, opacity: opacity2Plus }}
          >
            2+
          </motion.div>
          
          <motion.div 
            className="flex flex-col"
            style={shouldReduceMotion ? {} : { opacity: opacityYears, x: xYears }}
          >
            <span className="text-4xl md:text-6xl lg:text-7xl font-bold text-white/90">Years</span>
            <span className="text-4xl md:text-6xl lg:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-brand-cyan to-brand-blue">Experience</span>
          </motion.div>
        </div>

        <motion.div 
          className="mt-16 flex items-center gap-4"
          style={shouldReduceMotion ? {} : { opacity: opacitySub }}
        >
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <span className="text-xl text-[#C9CDD6] font-mono">Currently taking on new projects.</span>
        </motion.div>

      </motion.div>
    </section>
  )
}
