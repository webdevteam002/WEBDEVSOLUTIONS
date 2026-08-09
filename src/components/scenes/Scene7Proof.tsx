'use client'

import { useRef } from 'react'
import { motion, useScroll, useTransform, useSpring, useReducedMotion } from 'framer-motion'

export function Scene7Proof() {
  const containerRef = useRef<HTMLElement>(null)
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  })

  const shouldReduceMotion = useReducedMotion()

  // Spring physics for smooth scroll-scrubbing
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  })

  // The Duo Reveal: 0.2 -> 0.5 (Scale up and fade in together)
  const duoScale = useTransform(smoothProgress, [0.2, 0.5], [0.85, 1])
  const duoOpacity = useTransform(smoothProgress, [0.2, 0.5], [0, 1])

  // The Supporting Copy Reveal: 0.5 -> 0.65
  const copyOpacity = useTransform(smoothProgress, [0.5, 0.65], [0, 1])

  // Hand-off into FAQ: 0.8 -> 1.0 (Fade to 0.15 depth-swap)
  const exitOpacity = useTransform(smoothProgress, [0.8, 1], [1, 0.15])
  const exitScale = useTransform(smoothProgress, [0.8, 1], [1, 0.95])

  return (
    <section ref={containerRef} className="h-[200vh] relative w-full bg-[#0A0E1A] flex flex-col justify-center overflow-hidden">
      <motion.div 
        className="sticky top-0 h-screen flex flex-col items-center justify-center w-full px-6"
        style={{ 
          opacity: shouldReduceMotion ? 1 : exitOpacity, 
          scale: shouldReduceMotion ? 1 : exitScale 
        }}
      >
        
        {/* Anchor Point (Conceptual hand-off from Portfolio) */}
        <motion.div 
          className="absolute left-1/2 top-0 -translate-x-1/2 w-[1px] h-32 bg-gradient-to-b from-brand-cyan to-transparent opacity-50"
          style={{
            opacity: useTransform(smoothProgress, [0.0, 0.2], [1, 0]),
            scaleY: useTransform(smoothProgress, [0.0, 0.2], [1, 0]),
            transformOrigin: "top"
          }}
        />

        {/* The Duo Stats Block */}
        <motion.div 
          className="flex flex-col md:flex-row items-center md:items-end justify-center gap-16 md:gap-32 relative z-10 w-full max-w-6xl"
          style={shouldReduceMotion ? {} : { scale: duoScale, opacity: duoOpacity }}
        >
          {/* Stat 1: Experience */}
          <div className="flex flex-col items-center">
            <div className="text-8xl md:text-[10rem] lg:text-[12rem] font-bold text-transparent bg-clip-text bg-gradient-to-br from-white to-white/50 leading-none tracking-tighter drop-shadow-2xl">
              2+
            </div>
            <span className="text-2xl md:text-3xl font-bold text-[#C9CDD6] mt-4 tracking-wide">
              Years Experience
            </span>
          </div>

          {/* Stat 2: Projects */}
          <div className="flex flex-col items-center">
            <div className="text-8xl md:text-[10rem] lg:text-[12rem] font-bold text-transparent bg-clip-text bg-gradient-to-br from-white to-white/50 leading-none tracking-tighter drop-shadow-2xl">
              10+
            </div>
            <span className="text-2xl md:text-3xl font-bold text-[#C9CDD6] mt-4 tracking-wide">
              Projects Delivered
            </span>
          </div>
        </motion.div>

        {/* Supporting Copy CTA */}
        <motion.div 
          className="mt-24 flex items-center justify-center gap-4 bg-white/5 backdrop-blur-sm border border-white/10 px-8 py-4 rounded-full shadow-2xl"
          style={shouldReduceMotion ? {} : { opacity: copyOpacity }}
        >
          <div className="w-2.5 h-2.5 rounded-full bg-brand-cyan animate-pulse shadow-[0_0_10px_rgba(34,211,238,0.8)]" />
          <span className="text-lg md:text-xl text-[#C9CDD6] font-mono tracking-tight">
            Currently taking on new projects.
          </span>
        </motion.div>

      </motion.div>
    </section>
  )
}
