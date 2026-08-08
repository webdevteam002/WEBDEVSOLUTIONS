'use client'

import { useRef } from 'react'
import { motion, useScroll, useTransform, useSpring, useReducedMotion } from 'framer-motion'
import { Shard } from '@/components/ui/Shard'

export function Scene2Tension() {
  const ref = useRef<HTMLElement>(null)
  const shouldReduceMotion = useReducedMotion()

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

  // Y and Opacity transforms
  const y1 = useTransform(smoothProgress, [0.2, 0.4], [100, 0])
  const op1 = useTransform(smoothProgress, [0.2, 0.4], [0, 1])

  const y2 = useTransform(smoothProgress, [0.4, 0.6], [100, 0])
  const op2 = useTransform(smoothProgress, [0.4, 0.6], [0, 1])

  const y3 = useTransform(smoothProgress, [0.6, 0.8], [100, 0])
  const op3 = useTransform(smoothProgress, [0.6, 0.8], [0, 1])

  // Shard 2 crosses right-to-left
  const shard2X = useTransform(scrollYProgress, [0, 1], ["100vw", "-20vw"])

  const staticStyle = (y: any, op: any) => 
    shouldReduceMotion ? { y: 0, opacity: 1 } : { y, opacity: op }

  return (
    <section ref={ref} className="h-[150vh] relative w-full bg-[#0A0E1A] overflow-hidden flex flex-col justify-center">
      
      {/* Shard 2 crossing */}
      {!shouldReduceMotion && (
        <motion.div 
          className="absolute top-[40%] z-0"
          style={{ x: shard2X }}
        >
          <Shard shardId={2} className="w-48 h-48 opacity-20 blur-sm" />
        </motion.div>
      )}

      {/* Manifesto Content (Left Aligned against SectionIndex rail) */}
      <div className="z-10 pl-8 md:pl-48 pr-4 w-full max-w-7xl mx-auto flex flex-col justify-center">
        <motion.h2 
          className="text-4xl md:text-6xl lg:text-7xl font-medium tracking-tight text-white mb-6"
          style={staticStyle(y1, op1)}
        >
          Most agencies build websites.
        </motion.h2>
        
        <motion.h2 
          className="text-4xl md:text-6xl lg:text-7xl font-medium tracking-tight text-white/70 mb-6"
          style={staticStyle(y2, op2)}
        >
          We engineer digital ecosystems
          <br className="hidden md:block" /> that drive revenue.
        </motion.h2>

        <motion.div
          style={staticStyle(y3, op3)}
        >
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
