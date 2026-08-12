'use client'

import { useRef } from 'react'
import { motion, useScroll, useTransform, useSpring, useReducedMotion } from 'framer-motion'
import { Shard } from '@/components/ui/Shard'

export function Scene2Tension() {
  const ref = useRef<HTMLElement>(null)
  const systemReduceMotion = useReducedMotion()
  const shouldReduceMotion = false // Forced for cinematic mobile showcase

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  })

  // Smooth out the scroll progress
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  })

  // Fade Opacities mapping naturally with the scroll (no Y transforms to keep the 1:1 scroll momentum from Hero)
  const op1 = useTransform(smoothProgress, [0.1, 0.3], [0, 1])
  const op2 = useTransform(smoothProgress, [0.3, 0.5], [0, 1])
  const op3 = useTransform(smoothProgress, [0.5, 0.7], [0, 1])

  // Shard formation: scaling and fading into place instead of crossing
  const shardScale = useTransform(smoothProgress, [0.2, 0.6], [0.5, 1])
  const shardOpacity = useTransform(smoothProgress, [0.2, 0.6], [0, 0.4])
  const shardRotate = useTransform(smoothProgress, [0.2, 0.8], [-45, 0])

  const staticStyle = (op: any) => 
    shouldReduceMotion ? { opacity: 1 } : { opacity: op }

  return (
    <section ref={ref} className="h-[100vh] md:h-[150vh] relative w-full bg-[#0A0E1A] overflow-hidden flex flex-col justify-center shrink-0">
      
      {/* Shard forming motif */}
      {!shouldReduceMotion && (
        <motion.div 
          className="absolute right-[5%] md:right-[15%] top-[30%] z-0"
          style={{ scale: shardScale, opacity: shardOpacity, rotate: shardRotate }}
        >
          <Shard shardId={1} className="w-64 h-64 md:w-96 md:h-96 blur-[2px]" />
        </motion.div>
      )}

      {/* Manifesto Content */}
      <div className="z-10 px-6 md:pl-24 md:pr-4 w-full max-w-7xl mx-auto flex flex-col justify-center">
        <motion.h2 
          className="text-4xl md:text-6xl lg:text-7xl font-medium tracking-tight text-white mb-6"
          style={staticStyle(op1)}
        >
          Most agencies build websites.
        </motion.h2>
        
        <motion.h2 
          className="text-4xl md:text-6xl lg:text-7xl font-medium tracking-tight text-white/70 mb-6"
          style={staticStyle(op2)}
        >
          We engineer digital ecosystems
          <br className="hidden md:block" /> that drive revenue.
        </motion.h2>

        <motion.div style={staticStyle(op3)}>
          <motion.h2 
            layoutId="we-build-differently"
            className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-brand-cyan to-brand-blue inline-block"
          >
            We build differently.
          </motion.h2>
        </motion.div>
      </div>
    </section>
  )
}
