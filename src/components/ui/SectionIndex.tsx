'use client'

import { motion, useScroll, useMotionValue, animate } from 'framer-motion'
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
  const [activeIndex, setActiveIndex] = useState(0)
  const traceProgress = useMotionValue(0)
  const { scrollYProgress } = useScroll() // Still used for mobile progress bar

  // Animate trace line smoothly to the current active index
  useEffect(() => {
    const targetScale = activeIndex / (sections.length - 1)
    const controls = animate(traceProgress, targetScale, {
      type: "spring",
      stiffness: 100,
      damping: 20
    })
    return () => controls.stop()
  }, [activeIndex, traceProgress])

  useEffect(() => {
    // Small delay ensures DOM is fully painted and any GSAP wrappers are applied
    const timeoutId = setTimeout(() => {
      const main = document.querySelector('main')
      if (!main) return

      // Filter children to find the 9 scenes. 
      // We skip Navbar, SectionIndex, and Footer by checking computed styles or known tags.
      const children = Array.from(main.children)
      const scenes = children.filter(el => {
        const style = window.getComputedStyle(el)
        const tagName = el.tagName.toLowerCase()
        // Skip fixed elements (Navbar, SectionIndex) and footer
        return style.position !== 'fixed' && tagName !== 'nav' && tagName !== 'footer'
      })

      // If we didn't find exactly 9 scenes, fallback gracefully
      if (scenes.length !== sections.length) {
        console.warn('SectionIndex: Expected 9 scenes, found', scenes.length)
        return
      }

      // Use IntersectionObserver to detect which section is in the center of the screen
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const index = scenes.indexOf(entry.target)
            if (index !== -1) {
              setActiveIndex(index)
            }
          }
        })
      }, {
        rootMargin: "-50% 0px -50% 0px" // Trigger exactly when element crosses vertical center
      })

      scenes.forEach(scene => observer.observe(scene))

      return () => observer.disconnect()
    }, 500)

    return () => clearTimeout(timeoutId)
  }, [])

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
          style={{ scaleY: traceProgress }}
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
