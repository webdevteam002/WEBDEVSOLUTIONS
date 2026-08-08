'use client'

import { useState, useEffect } from 'react'
import { motion, useScroll, useTransform, useReducedMotion, useMotionTemplate } from 'framer-motion'

const steps = [
  { title: "Discover", desc: "Learn business, goals, constraints.", id: "01" },
  { title: "Strategize", desc: "Map architecture and tech stack.", id: "02" },
  { title: "Design", desc: "Wireframes, prototypes, visual system.", id: "03" },
  { title: "Develop", desc: "Sprints, regular demos, clean code.", id: "04" },
  { title: "Test & Refine", desc: "QA, performance, security checks.", id: "05" },
  { title: "Launch & Scale", desc: "Deploy, monitor, ongoing technical partnership.", id: "06" },
]

export function Scene4Process() {
  const containerRef = useRef<HTMLDivElement>(null)
  const shouldReduceMotion = useReducedMotion()
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  })

  // We use a motion template to perfectly slide the track based on its dynamic width vs window width.
  // When scroll = 0, translate is calc(-0% + 0vw) -> 0
  // When scroll = 1, translate is calc(-100% + 100vw) -> perfectly aligns the right edge!
  const progressPercent = useTransform(scrollYProgress, p => p * 100)
  const x = useMotionTemplate`calc(-${progressPercent}% + ${progressPercent}vw)`

  const [isMobile, setIsMobile] = useState(false)
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  if (isMobile || shouldReduceMotion) {
    return (
      <section className="relative py-24 w-full bg-[#0A0E1A] overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-4xl md:text-6xl font-bold mb-16">
            Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-blue to-brand-cyan">Process</span>
          </h2>
          <div className="flex flex-col gap-8">
            {steps.map((step, idx) => (
              <div key={idx} className="p-8 rounded-2xl bg-white/5 border border-white/10">
                <span className="text-brand-cyan font-mono mb-2 block">Step {step.id}</span>
                <h3 className="text-2xl font-bold text-white mb-2">{step.title}</h3>
                <p className="text-[#C9CDD6]">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  return (
    <section ref={containerRef} className="relative h-[400vh] bg-[#0A0E1A]">
      <div className="sticky top-0 h-screen w-full overflow-hidden flex flex-col justify-center">
        
        {/* Background Typography */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
          <motion.h2 
            style={{ 
              opacity: useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]),
              scale: useTransform(scrollYProgress, [0, 1], [0.95, 1.05])
            }}
            className="text-[12rem] md:text-[20rem] font-black text-white/[0.03] tracking-tighter whitespace-nowrap"
          >
            PROCESS.
          </motion.h2>
        </div>

        {/* Horizontal Track */}
        <div className="flex overflow-visible pl-[10vw]">
          <motion.div 
            style={{ x }} 
            className="flex gap-8 md:gap-16 items-center w-fit pr-[10vw] relative z-10"
          >
            {steps.map((step, idx) => {
              // We create a localized parallax effect for each card's internal content
              const cardStart = idx * (1 / steps.length)
              const cardEnd = cardStart + (1 / steps.length)
              
              return (
                <div 
                  key={idx} 
                  className="relative w-[85vw] md:w-[600px] h-[400px] md:h-[500px] shrink-0 bg-[#0A0E1A]/60 backdrop-blur-xl border border-white/10 rounded-3xl p-10 md:p-16 flex flex-col justify-between overflow-hidden group hover:border-brand-cyan/50 transition-colors duration-500"
                >
                  {/* Neon Glow on hover */}
                  <div className="absolute inset-0 bg-gradient-to-br from-brand-cyan/0 via-transparent to-brand-blue/0 group-hover:from-brand-cyan/10 group-hover:to-brand-blue/10 transition-colors duration-500" />
                  
                  <div className="absolute top-0 right-0 p-8 opacity-20 group-hover:opacity-100 transition-opacity duration-500 text-brand-cyan transform group-hover:scale-110 group-hover:rotate-12">
                    <Shard shardId={idx % 4 + 1} className="w-32 h-32" />
                  </div>

                  <div className="relative z-10">
                    <span className="text-brand-cyan font-mono text-xl md:text-2xl mb-4 block">Step {step.id}</span>
                    <h3 className="text-4xl md:text-6xl font-bold text-white mb-6 tracking-tight">{step.title}</h3>
                    <p className="text-[#C9CDD6] text-xl md:text-2xl leading-relaxed max-w-md">{step.desc}</p>
                  </div>
                  
                  {/* Decorative Bottom Bar */}
                  <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden mt-8 relative z-10">
                    <motion.div 
                      className="h-full bg-brand-cyan rounded-full" 
                      style={{
                        width: useMotionTemplate`${useTransform(scrollYProgress, [cardStart - 0.2, cardEnd], [0, 100])}%`
                      }}
                    />
                  </div>
                </div>
              )
            })}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
