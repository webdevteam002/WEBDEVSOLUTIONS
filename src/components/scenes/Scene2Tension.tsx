'use client'

import { motion, useScroll, useTransform, useSpring, useReducedMotion } from 'framer-motion'
import { useRef } from 'react'

export function Scene2Tension() {
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  })

  const shouldReduceMotion = useReducedMotion()

  const opacityRaw = useTransform(scrollYProgress, [0.2, 0.5, 0.8], [0, 1, 0])
  const opacity = shouldReduceMotion ? opacityRaw : useSpring(opacityRaw, { stiffness: 100, damping: 20 })
  
  const yRaw = useTransform(scrollYProgress, [0.2, 0.5, 0.8], [50, 0, -50])
  const y = shouldReduceMotion ? yRaw : useSpring(yRaw, { stiffness: 100, damping: 20 })

  return (
    <section ref={ref} className="relative h-screen w-full flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <motion.div style={{ opacity, y }} className="max-w-3xl text-center px-4">
        <h2 className="text-3xl md:text-5xl font-medium leading-relaxed">
          Most software fails because it's built generic.
          <br />
          <span className="text-brand-cyan">Then it's stitched together with more generic tools.</span>
          <br />
          <span className="font-bold text-white">We build differently.</span>
        </h2>
      </motion.div>
    </section>
  )
}
