'use client'

import { useEffect, useState } from 'react'
import { motion, useScroll, useTransform, useSpring, useReducedMotion, useMotionValue, Variants } from 'framer-motion'

const Defs = () => (
  <defs>
    <linearGradient id="glassBlue" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stopColor="#60A5FA" stopOpacity="0.9" />
      <stop offset="100%" stopColor="#1E40AF" stopOpacity="0.9" />
    </linearGradient>
    <linearGradient id="glassCyan" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stopColor="#22D3EE" stopOpacity="0.9" />
      <stop offset="100%" stopColor="#0369A1" stopOpacity="0.9" />
    </linearGradient>
    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="2" result="blur" />
      <feComposite in="SourceGraphic" in2="blur" operator="over" />
    </filter>
  </defs>
)

export function AnimatedLogo() {
  const shouldReduceMotion = useReducedMotion()
  const { scrollYProgress } = useScroll()
  
  const [isMounted, setIsMounted] = useState(false)
  useEffect(() => {
    setIsMounted(true)
  }, [])

  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  useEffect(() => {
    if (!isMounted || shouldReduceMotion) return
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX)
      mouseY.set(e.clientY)
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [mouseX, mouseY, isMounted, shouldReduceMotion])

  const springConfig = { stiffness: 100, damping: 20 }

  // We need window dimensions to map mouse safely
  const ww = typeof window !== 'undefined' ? window.innerWidth : 1920
  const wh = typeof window !== 'undefined' ? window.innerHeight : 1080

  // Helper to combine Scroll (Assembly) + Mouse (Parallax)
  const useParallaxSprungTransform = (
    scrollInput: number[], 
    scrollOutput: number[],
    parallaxMultiplierX: number = 0,
    parallaxMultiplierY: number = 0
  ) => {
    const scrollT = useTransform(scrollYProgress, scrollInput, scrollOutput)
    
    // Calculate parallax offsets based on mouse deviation from center (-1 to 1)
    const pxOffset = useTransform(mouseX, [0, ww], [-parallaxMultiplierX, parallaxMultiplierX])
    const pyOffset = useTransform(mouseY, [0, wh], [-parallaxMultiplierY, parallaxMultiplierY])
    
    // Fade out parallax based on scroll (it stops working once assembled for stability)
    const parallaxIntensity = useTransform(scrollYProgress, [0, 0.15], [1, 0])

    const combined = useTransform(
      [scrollT, pxOffset, pyOffset, parallaxIntensity], 
      ([st, px, py, pi]: any) => {
        // If reduced motion is active (client side only), ignore parallax and scroll transforms
        if (isMounted && shouldReduceMotion) return 0;
        return st + ((typeof px === 'number' ? px : 0) * (typeof pi === 'number' ? pi : 0))
      }
    )
    return useSpring(combined, springConfig)
  }

  // Only apply static overrides safely after hydration
  const staticArr = (isMounted && shouldReduceMotion) ? [0, 0, 0] : undefined

  // Shard Transforms (Input: Scroll points, Output: Offsets, Parallax X multiplier, Parallax Y multiplier)
  const stlX = useParallaxSprungTransform([0, 0.15, 0.5], staticArr || [-150, -150, 0], 40)
  const stlY = useParallaxSprungTransform([0, 0.15, 0.5], staticArr || [-100, -100, 0], 0, 40)
  
  const scX = useParallaxSprungTransform([0, 0.15, 0.5], staticArr || [-50, -50, 0], 20)
  const scY = useParallaxSprungTransform([0, 0.15, 0.5], staticArr || [50, 50, 0], 0, 20)
  
  const sblX = useParallaxSprungTransform([0, 0.15, 0.5], staticArr || [-120, -120, 0], -30)
  const sblY = useParallaxSprungTransform([0, 0.15, 0.5], staticArr || [150, 150, 0], 0, 60)
  
  const strX = useParallaxSprungTransform([0, 0.15, 0.5], staticArr || [150, 150, 0], 60)
  const strY = useParallaxSprungTransform([0, 0.15, 0.5], staticArr || [-80, -80, 0], 0, -30)
  
  const sbrX = useParallaxSprungTransform([0, 0.15, 0.5], staticArr || [100, 100, 0], 30)
  const sbrY = useParallaxSprungTransform([0, 0.15, 0.5], staticArr || [120, 120, 0], 0, 30)
  
  const pixX = useParallaxSprungTransform([0, 0.15, 0.5], staticArr || [-250, -250, 0], -80)
  const pixY = useParallaxSprungTransform([0, 0.15, 0.5], staticArr || [-20, -20, 0], 0, -20)
  
  const circOpacityRaw = useTransform(scrollYProgress, [0, 0.5, 0.8], [0, 0, 1])
  const circOpacity = (isMounted && shouldReduceMotion) ? 1 : circOpacityRaw

  const containerVariants: Variants = {
    animate: {
      y: (isMounted && shouldReduceMotion) ? 0 : [0, -10, 0],
      transition: {
        duration: 4,
        repeat: Infinity,
        ease: "linear"
      }
    }
  }

  return (
    <motion.div 
      className="relative w-[300px] h-[300px] md:w-[400px] md:h-[400px] flex items-center justify-center opacity-40 md:opacity-100"
      variants={containerVariants}
      animate="animate"
    >
      <svg viewBox="0 0 200 200" className="w-full h-full overflow-visible drop-shadow-2xl">
        <Defs />
        
        {/* Pixels (Left) */}
        <motion.g style={{ x: pixX, y: pixY }}>
          <rect x="10" y="80" width="8" height="8" fill="url(#glassBlue)" stroke="#60A5FA" strokeWidth="0.5" filter="url(#glow)"/>
          <rect x="25" y="70" width="12" height="12" fill="url(#glassBlue)" stroke="#60A5FA" strokeWidth="0.5" filter="url(#glow)"/>
          <rect x="15" y="100" width="10" height="10" fill="url(#glassCyan)" stroke="#22D3EE" strokeWidth="0.5" filter="url(#glow)"/>
          <rect x="30" y="90" width="8" height="8" fill="url(#glassCyan)" stroke="#22D3EE" strokeWidth="0.5" filter="url(#glow)"/>
        </motion.g>

        {/* Shard Top Left */}
        <motion.g style={{ x: stlX, y: stlY }}>
          <path d="M 60,30 L 100,30 L 80,60 L 40,60 Z" fill="url(#glassBlue)" stroke="#60A5FA" strokeWidth="1" filter="url(#glow)" />
        </motion.g>

        {/* Shard Center */}
        <motion.g style={{ x: scX, y: scY }}>
          <polygon points="100,50 140,90 100,130 60,90" fill="url(#glassBlue)" stroke="#60A5FA" strokeWidth="1" filter="url(#glow)" />
        </motion.g>

        {/* Shard Bottom Left */}
        <motion.g style={{ x: sblX, y: sblY }}>
          <path d="M 60,150 L 100,150 L 80,120 L 40,120 Z" fill="url(#glassBlue)" stroke="#60A5FA" strokeWidth="1" filter="url(#glow)" />
        </motion.g>

        {/* Shard Top Right */}
        <motion.g style={{ x: strX, y: strY }}>
          <path d="M 120,60 L 160,60 L 140,30 L 100,30 Z" fill="url(#glassCyan)" stroke="#22D3EE" strokeWidth="1" filter="url(#glow)" />
        </motion.g>

        {/* Shard Bottom Right */}
        <motion.g style={{ x: sbrX, y: sbrY }}>
          <path d="M 120,120 L 160,120 L 140,150 L 100,150 Z" fill="url(#glassCyan)" stroke="#22D3EE" strokeWidth="1" filter="url(#glow)" />
        </motion.g>

        {/* Circuits (Right) */}
        <motion.g style={{ opacity: circOpacity }}>
          <path d="M 160,90 L 190,90" fill="none" stroke="#22D3EE" strokeWidth="2" filter="url(#glow)" />
          <circle cx="190" cy="90" r="4" fill="#0A0E1A" stroke="#22D3EE" strokeWidth="2" filter="url(#glow)" />
          
          <path d="M 150,70 L 180,50" fill="none" stroke="#22D3EE" strokeWidth="2" filter="url(#glow)" />
          <circle cx="180" cy="50" r="4" fill="#0A0E1A" stroke="#22D3EE" strokeWidth="2" filter="url(#glow)" />
          
          <path d="M 150,110 L 180,130" fill="none" stroke="#22D3EE" strokeWidth="2" filter="url(#glow)" />
          <circle cx="180" cy="130" r="4" fill="#0A0E1A" stroke="#22D3EE" strokeWidth="2" filter="url(#glow)" />
        </motion.g>
      </svg>
    </motion.div>
  )
}
