'use client'

import { motion, useScroll } from 'framer-motion'
import { useEffect, useState } from 'react'

const sections = [
  { id: '01', name: 'Hero' },
  { id: '02', name: 'Tension' },
  { id: '03', name: 'Services' },
  { id: '04', name: 'Process' },
  { id: '05', name: 'Technology' },
  { id: '06', name: 'Portfolio' },
  { id: '07', name: 'Proof' },
  { id: '08', name: 'FAQ' },
  { id: '09', name: 'CTA' },
]

export function SectionIndex() {
  const { scrollYProgress } = useScroll()
  const [activeIndex, setActiveIndex] = useState(0)

  useEffect(() => {
    return scrollYProgress.onChange((latest) => {
      // Approximate section index based on scroll
      // A more precise way would be IntersectionObserver, but scrollYProgress is cheap and fits the "circuit trace" feel
      const idx = Math.min(Math.floor(latest * sections.length), sections.length - 1)
      setActiveIndex(idx)
    })
  }, [scrollYProgress])

  return (
    <>
      {/* Mobile Top Progress Bar */}
      <motion.div 
        className="fixed top-0 left-0 right-0 h-1 bg-brand-cyan z-[150] origin-left md:hidden"
        style={{ scaleX: scrollYProgress }}
      />

      {/* Desktop Left Rail */}
      <div className="fixed left-8 top-1/2 -translate-y-1/2 z-50 hidden md:flex flex-col gap-8 pointer-events-none">
        {/* The Circuit Trace Line */}
        <div className="absolute left-[11px] top-4 bottom-4 w-[2px] bg-white/10 -z-10" />
        <motion.div 
          className="absolute left-[11px] top-4 bottom-4 w-[2px] bg-brand-cyan -z-10 origin-top"
          style={{ scaleY: scrollYProgress }}
        />

        {sections.map((section, idx) => (
          <div key={section.id} className="flex items-center gap-4">
            <div 
              className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors duration-300 ${
                idx <= activeIndex ? 'border-brand-cyan bg-[#0A0E1A]' : 'border-white/20 bg-transparent'
              }`}
            >
              <div 
                className={`w-2 h-2 rounded-full transition-colors duration-300 ${
                  idx <= activeIndex ? 'bg-brand-cyan' : 'bg-transparent'
                }`}
              />
            </div>
            <span 
              className={`text-xs font-mono transition-opacity duration-300 ${
                idx === activeIndex ? 'opacity-100 text-brand-cyan' : 'opacity-30 text-white'
              }`}
            >
              {section.id}
            </span>
          </div>
        ))}
      </div>
    </>
  )
}
