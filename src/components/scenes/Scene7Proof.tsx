'use client'

import { useRef, useState, useEffect } from 'react'
import { motion, useScroll, useTransform, useSpring, useReducedMotion, useInView } from 'framer-motion'

export function Scene7Proof() {
  const containerRef = useRef<HTMLElement>(null)
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  })

  const isInView = useInView(containerRef)
  
  const systemReduceMotion = useReducedMotion()
  const shouldReduceMotion = false // Forced for cinematic mobile showcase

  // Spring physics for smooth scroll-scrubbing
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  })

  // The Fill Reveal mechanism: 0.3 -> 0.6
  // clip-path inset(top right bottom left)
  // We want to fill from bottom to top, so inset(100% 0 0 0) goes to inset(0% 0 0 0)
  const fillProgress = useTransform(smoothProgress, [0.25, 0.6], [100, 0])
  
  // Create a string for the clip-path
  const clipPathFill = useTransform(fillProgress, (val) => `inset(${val}% 0 0 0)`)

  // The Circuit Trace Divider
  // Travels down from 0% to 100%
  const traceY = useTransform(smoothProgress, [0.2, 0.7], ["0%", "100%"])
  const traceX = useTransform(smoothProgress, [0.2, 0.7], ["0%", "100%"]) // For mobile horizontal line

  // The Supporting Copy Reveal: 0.55 -> 0.7
  const copyOpacity = useTransform(smoothProgress, [0.55, 0.7], [0, 1])
  const copyY = useTransform(smoothProgress, [0.55, 0.7], [20, 0])

  // Hand-off into FAQ: 0.8 -> 1.0 (Fade to 0.15 depth-swap)
  const exitOpacity = useTransform(smoothProgress, [0.8, 1], [1, 0.15])
  const exitScale = useTransform(smoothProgress, [0.8, 1], [1, 0.95])

  return (
    <section ref={containerRef} className="relative w-full bg-[#0A0E1A] flex flex-col justify-center overflow-hidden h-auto md:h-[200vh]">
      
      {/* 1. Ambient Background Depth (Drifting Blobs) */}
      {!shouldReduceMotion && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden flex items-center justify-center">
          {/* Cyan Blob */}
          <motion.div 
            className="absolute w-[40vw] h-[40vw] rounded-full bg-brand-cyan/10 blur-[80px] md:blur-[120px]"
            animate={isInView ? {
              x: ["-20%", "10%", "-20%"],
              y: ["-10%", "20%", "-10%"],
              scale: [1, 1.1, 1],
            } : {}}
            transition={{
              duration: 25,
              repeat: Infinity,
              ease: "linear"
            }}
          />
          {/* Blue Blob - hidden on mobile to save performance */}
          <motion.div 
            className="hidden md:block absolute w-[35vw] h-[35vw] rounded-full bg-[#1E40AF]/15 blur-[120px]"
            initial={{ x: "10%", y: "20%" }}
          />
        </div>
      )}

      <motion.div 
        className="flex flex-col items-center justify-center w-full px-6 py-24 md:py-0 md:sticky md:top-0 md:h-screen"
        style={{ 
          opacity: shouldReduceMotion ? 1 : exitOpacity, 
          scale: shouldReduceMotion ? 1 : exitScale 
        }}
      >
        
        {/* Anchor Point (Conceptual hand-off from Portfolio) */}
        <motion.div 
          className="absolute left-1/2 top-0 -translate-x-1/2 w-[1px] h-24 bg-gradient-to-b from-brand-cyan to-transparent opacity-30"
          style={{
            opacity: useTransform(smoothProgress, [0.0, 0.2], [1, 0]),
            scaleY: useTransform(smoothProgress, [0.0, 0.2], [1, 0]),
            transformOrigin: "top"
          }}
        />

        {/* 2 & 5. The Duo Stats Block (Tighter Rhythm & Outline Reveal) */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-12 md:gap-24 relative z-10 w-full max-w-6xl mt-12">
          
          {/* Stat 1: Experience */}
          <div className="flex flex-col items-center relative group">
            {/* Outline Base */}
            <div 
              className="text-[6rem] md:text-[12rem] lg:text-[16rem] font-bold leading-none tracking-tighter"
              style={{
                WebkitTextStroke: "1px rgba(255,255,255,0.2)",
                color: "transparent",
              }}
            >
              2+
            </div>
            
            {/* Filled Overlay via ClipPath */}
            <motion.div 
              className="absolute top-0 left-0 w-full text-[6rem] md:text-[12rem] lg:text-[16rem] font-bold leading-none tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-white to-white/50 text-center"
              style={{ clipPath: shouldReduceMotion ? 'none' : clipPathFill }}
            >
              2+
            </motion.div>

            {/* Breathing Glow */}
            {!shouldReduceMotion && (
              <motion.div 
                className="absolute inset-0 pointer-events-none -z-10"
                animate={{
                  filter: [
                    'drop-shadow(0 0 10px rgba(34,211,238,0.0))', 
                    'drop-shadow(0 0 40px rgba(34,211,238,0.15))', 
                    'drop-shadow(0 0 10px rgba(34,211,238,0.0))'
                  ]
                }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              >
                <div className="w-full h-full text-[8rem] md:text-[12rem] lg:text-[16rem] font-bold leading-none tracking-tighter text-transparent bg-clip-text bg-brand-cyan opacity-20">
                  2+
                </div>
              </motion.div>
            )}

            <span className="text-xl md:text-2xl font-bold text-[#C9CDD6] mt-0 tracking-wide uppercase text-center max-w-[200px]">
              Years Experience
            </span>
          </div>

          {/* 3. The Circuit Divider */}
          <div className="relative w-full h-[1px] md:w-[1px] md:h-64 bg-white/10 flex-shrink-0 overflow-hidden my-4 md:my-0 rounded-full">
            {/* Mobile Horizontal Trace */}
            <motion.div 
              className="absolute w-full h-[20px] bg-brand-cyan shadow-[0_0_15px_rgba(34,211,238,0.8)] rounded-full md:hidden"
              style={{ top: 0, left: traceX, x: '-50%', y: 0 }}
            />
            {/* Desktop Vertical Trace */}
            <motion.div 
              className="absolute hidden md:block w-[2px] h-1/3 bg-brand-cyan shadow-[0_0_15px_rgba(34,211,238,0.8)] rounded-full"
              style={{ top: traceY, left: 0, x: 0, y: '-50%' }}
            />
          </div>

          {/* Stat 2: Projects */}
          <div className="flex flex-col items-center relative group">
            {/* Outline Base */}
            <div 
              className="text-[8rem] md:text-[12rem] lg:text-[16rem] font-bold leading-none tracking-tighter"
              style={{
                WebkitTextStroke: "1px rgba(255,255,255,0.2)",
                color: "transparent",
              }}
            >
              10+
            </div>
            
            {/* Filled Overlay via ClipPath */}
            <motion.div 
              className="absolute top-0 left-0 w-full text-[8rem] md:text-[12rem] lg:text-[16rem] font-bold leading-none tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-white to-white/50 text-center"
              style={{ clipPath: shouldReduceMotion ? 'none' : clipPathFill }}
            >
              10+
            </motion.div>

            {/* Breathing Glow */}
            {!shouldReduceMotion && (
              <motion.div 
                className="absolute inset-0 pointer-events-none -z-10"
                animate={{
                  filter: [
                    'drop-shadow(0 0 10px rgba(34,211,238,0.0))', 
                    'drop-shadow(0 0 40px rgba(34,211,238,0.15))', 
                    'drop-shadow(0 0 10px rgba(34,211,238,0.0))'
                  ]
                }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              >
                <div className="w-full h-full text-[8rem] md:text-[12rem] lg:text-[16rem] font-bold leading-none tracking-tighter text-transparent bg-clip-text bg-brand-cyan opacity-20">
                  10+
                </div>
              </motion.div>
            )}

            <span className="text-xl md:text-2xl font-bold text-[#C9CDD6] mt-0 tracking-wide uppercase text-center max-w-[200px]">
              Projects Delivered
            </span>
          </div>
        </div>

        {/* Supporting Copy CTA */}
        <motion.div 
          className="mt-16 md:mt-24 flex items-center justify-center gap-4 bg-white/5 backdrop-blur-sm border border-white/10 px-8 py-4 rounded-full shadow-2xl relative z-10"
          style={shouldReduceMotion ? {} : { opacity: copyOpacity, y: copyY }}
        >
          <div className="w-2.5 h-2.5 rounded-full bg-brand-cyan animate-pulse shadow-[0_0_10px_rgba(34,211,238,0.8)] flex-shrink-0" />
          <span className="text-lg md:text-xl text-[#C9CDD6] font-mono tracking-tight">
            Currently taking on new projects.
          </span>
        </motion.div>

      </motion.div>
    </section>
  )
}
