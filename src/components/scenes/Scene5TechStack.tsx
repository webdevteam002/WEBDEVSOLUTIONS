'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion'

const techs = [
  "Next.js", "React", "TypeScript", "Tailwind CSS", 
  "Framer Motion", "Three.js", "WebGL", "Node.js", 
  "PostgreSQL", "Sanity.io", "AWS", "Vercel"
]

export function Scene5TechStack() {
  const containerRef = useRef<HTMLElement>(null)
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  })

  const [isMobile, setIsMobile] = useState(false)
  const shouldReduceMotion = useReducedMotion()

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  if (isMobile || shouldReduceMotion) {
    return (
      <section className="py-24 bg-[#0A0E1A] overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold mb-12 text-white">Technology Stack</h2>
          <div className="flex flex-wrap justify-center gap-4">
            {techs.map((tech, idx) => (
              <span key={idx} className="px-4 py-2 bg-white/5 border border-white/10 rounded-full text-[#C9CDD6]">
                {tech}
              </span>
            ))}
          </div>
        </div>
      </section>
    )
  }

  // Parallax background typography that moves slightly opposite to scroll
  const bgY = useTransform(scrollYProgress, [0, 1], ["-20%", "20%"])
  
  // Total scroll distance is effectively 200vh (from start end to end start)
  return (
    <section 
      ref={containerRef} 
      className="relative min-h-[150vh] bg-[#0A0E1A] flex flex-col justify-center overflow-hidden"
    >
      {/* Immersive Parallax Background */}
      <motion.div 
        style={{ y: bgY }}
        className="absolute inset-0 flex items-center justify-center pointer-events-none z-0"
      >
        <h2 className="text-[15rem] md:text-[25rem] font-black text-white/[0.02] tracking-tighter text-center leading-none">
          STACK.
        </h2>
      </motion.div>

      <div className="sticky top-0 h-screen w-full flex items-center justify-center pointer-events-none">
        <div className="max-w-7xl mx-auto px-6 w-full relative z-10 flex flex-wrap justify-center gap-6 md:gap-10 pointer-events-auto">
          {techs.map((tech, idx) => {
            // We want them to stagger reveal as the user scrolls through the middle portion of the section
            // The section is in view from 0 to 1.
            // Center is around 0.5.
            const itemRevealStart = 0.3 + (idx * 0.03)
            const itemRevealEnd = itemRevealStart + 0.1
            
            const scale = useTransform(scrollYProgress, [itemRevealStart, itemRevealEnd], [0.5, 1])
            const opacity = useTransform(scrollYProgress, [itemRevealStart, itemRevealEnd], [0, 1])
            const y = useTransform(scrollYProgress, [itemRevealStart, itemRevealEnd], ["50px", "0px"])
            
            // Fade out towards the end of the section (from 0.8 to 1.0)
            const fadeOut = useTransform(scrollYProgress, [0.8, 0.95], [1, 0])
            
            // Combine opacities using useTransform on the scroll again since we can't easily multiply hooks directly
            const finalOpacity = useTransform(scrollYProgress, (p) => {
              if (p < itemRevealStart) return 0
              if (p > 0.95) return 0
              if (p > 0.8) return 1 - ((p - 0.8) / 0.15)
              return (p - itemRevealStart) / (itemRevealEnd - itemRevealStart)
            })
            
            return (
              <motion.div
                key={idx}
                style={{ scale, opacity: finalOpacity, y }}
                className="group relative cursor-default"
              >
                {/* Neon Glow on hover */}
                <div className="absolute inset-0 bg-brand-cyan/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                <span 
                  className="relative block text-5xl md:text-7xl font-black text-white/20 transition-all duration-500 group-hover:text-white"
                  style={{
                    WebkitTextStroke: '1px rgba(255,255,255,0.1)'
                  }}
                >
                  {tech}
                </span>
              </motion.div>
            )
          })}
        </div>
      </div>
      
      {/* Hand-off to Portfolio */}
      <motion.div 
        className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-brand-cyan to-transparent origin-center"
        style={{ 
          scaleX: useTransform(scrollYProgress, [0.8, 1], [0, 1]),
          opacity: useTransform(scrollYProgress, [0.8, 1], [0, 1]) 
        }}
      />
    </section>
  )
}
