'use client'

import { useRef, useEffect, useState } from 'react'
import { motion, useScroll, useVelocity, useSpring, useTransform, useAnimationFrame, useReducedMotion } from 'framer-motion'

const techs = [
  "Next.js", "React", "TypeScript", "Tailwind CSS", 
  "Framer Motion", "Three.js", "WebGL", "Node.js", 
  "PostgreSQL", "Sanity.io", "AWS", "Vercel"
]

function MarqueeRow({ 
  items, 
  direction, 
  baseVelocity,
  scrollVelocity
}: { 
  items: string[], 
  direction: 1 | -1, 
  baseVelocity: number,
  scrollVelocity: any
}) {
  const baseX = useRef(0)
  const containerRef = useRef<HTMLDivElement>(null)
  
  // To handle the center-scale effect efficiently
  const itemRefs = useRef<(HTMLSpanElement | null)[]>([])

  useAnimationFrame((t, delta) => {
    if (!containerRef.current) return

    // Calculate dynamic velocity
    let moveBy = direction * baseVelocity * (delta / 1000)
    
    // Add scroll velocity factor
    if (scrollVelocity.get() !== 0) {
      moveBy += direction * scrollVelocity.get() * (delta / 1000) * 0.05
    }

    baseX.current += moveBy

    // Loop logic (approximate assuming 2 sets of items)
    // We wrap around when we've moved past 50%
    if (direction === -1 && baseX.current <= -50) {
      baseX.current = 0
    } else if (direction === 1 && baseX.current >= 0) {
      baseX.current = -50
    }

    containerRef.current.style.transform = `translateX(${baseX.current}%)`

    // Center scale effect calculation
    const center = window.innerWidth / 2
    itemRefs.current.forEach((el) => {
      if (!el) return
      const rect = el.getBoundingClientRect()
      const elCenter = rect.left + rect.width / 2
      const dist = Math.abs(center - elCenter)
      
      // If within a threshold (e.g., 150px) of center, scale up and brighten
      if (dist < 200) {
        const scale = 1 + (1 - dist / 200) * 0.15 // Up to 15% scale
        const brightness = 1 + (1 - dist / 200) * 0.5
        el.style.transform = `scale(${scale})`
        // Add cyan glow to text dynamically via color interpolation or drop shadow
        el.style.textShadow = `0 0 ${10 * (1 - dist/200)}px rgba(34, 211, 238, ${1 - dist/200})`
        el.style.color = `rgba(34, 211, 238, ${0.5 + (1 - dist/200)*0.5})`
      } else {
        el.style.transform = `scale(1)`
        el.style.textShadow = 'none'
        el.style.color = 'rgba(255, 255, 255, 0.1)'
      }
    })
  })

  // Duplicate items for seamless loop
  const allItems = [...items, ...items]

  return (
    <div className="flex whitespace-nowrap overflow-visible">
      <div 
        ref={containerRef}
        className="flex gap-16 px-8"
        style={{ width: '200%' }} // 200% width because we duplicated items
      >
        {allItems.map((tech, idx) => (
          <span 
            key={idx} 
            ref={el => { itemRefs.current[idx] = el }}
            className="text-4xl md:text-6xl font-black transition-colors"
            style={{ color: 'rgba(255, 255, 255, 0.1)', display: 'inline-block', willChange: 'transform, color, text-shadow' }}
          >
            {tech}
          </span>
        ))}
      </div>
    </div>
  )
}

export function Scene5TechStack() {
  const containerRef = useRef<HTMLElement>(null)
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"] // track through entire view
  })

  const { scrollYProgress: convergenceProgress } = useScroll({
    target: containerRef,
    offset: ["end center", "end start"] // When leaving the section, converge
  })

  const scrollVelocity = useVelocity(scrollYProgress)
  const smoothVelocity = useSpring(scrollVelocity, {
    damping: 50,
    stiffness: 400
  })

  const [isMobile, setIsMobile] = useState(false)
  const shouldReduceMotion = useReducedMotion()

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Convergence animation values
  const gap = useTransform(convergenceProgress, [0, 1], ["4rem", "0rem"])
  const opacity = useTransform(convergenceProgress, [0, 1], [1, 0.2])
  
  return (
    <section 
      ref={containerRef} 
      className="relative py-32 h-screen max-h-[800px] bg-[#0A0E1A] overflow-hidden flex flex-col justify-center border-y border-brand-cyan/20"
    >
      <motion.div 
        className="absolute left-0 right-0 top-0 h-[1px] bg-brand-cyan/50"
        style={{ scaleX: convergenceProgress, transformOrigin: 'center' }}
      />

      <motion.div 
        className="flex flex-col justify-center"
        style={{ gap, opacity }}
      >
        {/* Row 1: Moves Right (left-to-right) */}
        {shouldReduceMotion ? (
           <div className="flex gap-8 overflow-hidden text-white/30 text-4xl font-bold px-4">{techs.join(" • ")}</div>
        ) : (
           <MarqueeRow 
             items={techs} 
             direction={1} 
             baseVelocity={5} 
             scrollVelocity={smoothVelocity} 
           />
        )}

        {/* Row 2: Moves Left (right-to-left, Hidden on mobile) */}
        {!isMobile && !shouldReduceMotion && (
          <MarqueeRow 
            items={techs.slice().reverse()} 
            direction={-1} 
            baseVelocity={7} // slightly different base speed
            scrollVelocity={smoothVelocity} 
          />
        )}
      </motion.div>
      
      {/* The compressed horizontal band hand-off to Portfolio */}
      <motion.div 
        className="absolute bottom-0 left-0 right-0 h-[4px] bg-brand-cyan origin-center"
        style={{ 
          scaleX: convergenceProgress,
          opacity: convergenceProgress 
        }}
      />
    </section>
  )
}
