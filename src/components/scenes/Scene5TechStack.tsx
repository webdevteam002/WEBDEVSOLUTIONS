'use client'

import { useRef, useEffect, useState } from 'react'
import { motion, useScroll, useVelocity, useSpring, useTransform, useAnimationFrame, useReducedMotion } from 'framer-motion'

const techs = [
  "Next.js", "React", "TypeScript", "Tailwind CSS", 
  "Framer Motion", "Three.js", "WebGL", "Node.js", 
  "PostgreSQL", "Sanity.io", "AWS", "Vercel"
]

function StaticTechGrid() {
  return (
    <div className="flex flex-wrap justify-center gap-4 md:gap-6 px-6 max-w-5xl mx-auto z-10 relative">
      {techs.map(tech => (
        <div 
          key={tech} 
          className="px-6 py-3 md:px-8 md:py-4 rounded-full bg-[#0F172A]/80 backdrop-blur-md border border-white/10 text-white/80 text-lg md:text-2xl font-bold whitespace-nowrap shadow-lg transition-colors hover:border-brand-cyan/50 hover:text-white"
        >
          {tech}
        </div>
      ))}
    </div>
  )
}

function MarqueeRow({ 
  items, 
  direction, 
  baseVelocity,
  scrollVelocity,
  isBackRow = false
}: { 
  items: string[], 
  direction: 1 | -1, 
  baseVelocity: number,
  scrollVelocity: any,
  isBackRow?: boolean
}) {
  const baseX = useRef(0)
  const containerRef = useRef<HTMLDivElement>(null)
  const itemRefs = useRef<(HTMLDivElement | null)[]>([])

  useAnimationFrame((t, delta) => {
    if (!containerRef.current) return

    // Calculate dynamic velocity: base speed + scroll-induced momentum
    let moveBy = direction * baseVelocity * (delta / 1000)
    
    const currentVelocity = scrollVelocity.get()
    if (currentVelocity !== 0) {
      // Multiply by direction so it always speeds up the current heading
      // Or we can let scroll direction push it? Let's just use raw velocity 
      // but bound it to direction so scrolling down always accelerates it forward
      moveBy += direction * Math.abs(currentVelocity) * (delta / 1000) * 0.05
    }

    baseX.current += moveBy

    // Seamless loop wraparound (width is 200%, so wrapping at 50%)
    if (direction === -1 && baseX.current <= -50) {
      baseX.current = 0
    } else if (direction === 1 && baseX.current >= 0) {
      baseX.current = -50
    }

    containerRef.current.style.transform = `translateX(${baseX.current}%)`

    // Center Focus / Bloom effect
    const center = window.innerWidth / 2
    itemRefs.current.forEach((el) => {
      if (!el) return
      const rect = el.getBoundingClientRect()
      const elCenter = rect.left + rect.width / 2
      const dist = Math.abs(center - elCenter)
      
      // Activation zone: 300px from center
      if (dist < 300) {
        const factor = Math.pow(1 - dist / 300, 2) // Non-linear ease for pop
        const scale = 1 + factor * 0.15 
        
        el.style.transform = `scale(${scale})`
        el.style.borderColor = `rgba(34, 211, 238, ${factor * 0.5 + 0.1})`
        el.style.backgroundColor = `rgba(34, 211, 238, ${factor * 0.15})`
        el.style.color = `rgba(255, 255, 255, ${factor * 0.4 + 0.6})`
        el.style.boxShadow = `0 0 ${factor * 40}px rgba(34, 211, 238, ${factor * 0.4})`
        el.style.zIndex = '10'
      } else {
        el.style.transform = `scale(1)`
        el.style.borderColor = 'rgba(255, 255, 255, 0.1)'
        el.style.backgroundColor = 'rgba(15, 23, 42, 0.8)'
        el.style.color = 'rgba(255, 255, 255, 0.6)'
        el.style.boxShadow = 'none'
        el.style.zIndex = '1'
      }
    })
  })

  // Duplicate for seamless loop
  const allItems = [...items, ...items]

  return (
    <div className={`flex whitespace-nowrap overflow-visible ${isBackRow ? 'opacity-60 blur-[1.5px] scale-90' : 'opacity-100 z-10'}`}>
      <div 
        ref={containerRef}
        className="flex gap-8 md:gap-16 px-4 md:px-8 items-center"
        style={{ width: '200%' }} 
      >
        {allItems.map((tech, idx) => (
          <div 
            key={idx} 
            ref={el => { itemRefs.current[idx] = el }}
            className="px-6 py-3 md:px-10 md:py-5 rounded-full border text-xl md:text-3xl font-bold transition-none"
            style={{ 
              backgroundColor: 'rgba(15, 23, 42, 0.8)',
              borderColor: 'rgba(255, 255, 255, 0.1)',
              color: 'rgba(255, 255, 255, 0.6)',
              backdropFilter: 'blur(12px)',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              willChange: 'transform, border-color, background-color, color, box-shadow'
            }}
          >
            {tech}
          </div>
        ))}
      </div>
    </div>
  )
}

export function Scene5TechStack() {
  const containerRef = useRef<HTMLElement>(null)
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  })

  const { scrollYProgress: convergenceProgress } = useScroll({
    target: containerRef,
    offset: ["end center", "end start"]
  })

  const scrollVelocity = useVelocity(scrollYProgress)
  const smoothVelocity = useSpring(scrollVelocity, {
    damping: 50,
    stiffness: 400
  })

  const [isMobile, setIsMobile] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const systemReduceMotion = useReducedMotion()

  useEffect(() => {
    setIsMounted(true)
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const shouldReduceMotion = isMounted ? systemReduceMotion : false

  // Convergence compression
  const gap = useTransform(convergenceProgress, [0, 1], ["4rem", "0rem"])
  const opacity = useTransform(convergenceProgress, [0, 1], [1, 0])
  
  return (
    <section 
      ref={containerRef} 
      className="relative py-32 h-screen max-h-[800px] bg-[#0A0E1A] overflow-hidden flex flex-col justify-center border-t border-white/5"
    >
      <motion.div 
        className="flex flex-col justify-center relative w-full"
        style={!shouldReduceMotion ? { 
          gap, 
          opacity,
          maskImage: 'linear-gradient(to right, transparent 0%, black 15%, black 85%, transparent 100%)',
          WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 15%, black 85%, transparent 100%)'
        } : {}}
      >
        {shouldReduceMotion ? (
           <StaticTechGrid />
        ) : (
           <>
             {/* Row 2 (Background, reversed array so order feels distinct) */}
             {!isMobile && (
               <MarqueeRow 
                 items={[...techs].reverse()} 
                 direction={-1} 
                 baseVelocity={3} 
                 scrollVelocity={smoothVelocity} 
                 isBackRow={true}
               />
             )}
             
             {/* Row 1 (Foreground) */}
             <MarqueeRow 
               items={techs} 
               direction={1} 
               baseVelocity={6} 
               scrollVelocity={smoothVelocity} 
             />
           </>
        )}
      </motion.div>
      
      {/* Portfolio convergence band hand-off */}
      {!shouldReduceMotion && (
        <motion.div 
          className="absolute bottom-0 left-0 right-0 h-[4px] bg-brand-cyan origin-center z-50 shadow-[0_0_20px_rgba(34,211,238,0.5)]"
          style={{ 
            scaleX: convergenceProgress,
            opacity: convergenceProgress 
          }}
        />
      )}
    </section>
  )
}
