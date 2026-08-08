'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence, useScroll, useTransform, useMotionValueEvent, useReducedMotion } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import { Shard } from '@/components/ui/Shard'

const faqs = [
  { q: "What services do you offer?", a: "We offer full-cycle custom web and mobile app development, SaaS platforms, AI integrations, desktop applications, and high-performance e-commerce solutions." },
  { q: "How much does a custom app cost?", a: "Costs vary based on complexity, features, and timeline. Our projects typically start at $10k. We provide a detailed architectural roadmap and fixed-price quote during the Discovery phase." },
  { q: "Do you build SaaS platforms?", a: "Yes, SaaS is our specialty. We build scalable, multi-tenant architectures with integrated billing (Stripe), real-time dashboards, and robust role-based access control." },
  { q: "How long does it take?", a: "A standard web application takes 8-12 weeks from kickoff to launch. More complex AI or desktop applications may take 3-6 months. We work in 2-week agile sprints to deliver continuous value." },
  { q: "Do you provide ongoing support?", a: "Absolutely. We offer retainer-based technical partnerships to handle maintenance, monitoring, security updates, and feature scaling post-launch." },
]

export function Scene8FAQ() {
  const containerRef = useRef<HTMLElement>(null)
  const [openIdx, setOpenIdx] = useState<number | null>(0)
  const [scrollIdx, setScrollIdx] = useState(0)
  const [isMobile, setIsMobile] = useState(false)
  const shouldReduceMotion = useReducedMotion()

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end center"]
  })

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    if (isMobile || shouldReduceMotion) return
    const newIdx = Math.min(Math.floor(latest * faqs.length), faqs.length - 1)
    if (newIdx !== scrollIdx && newIdx >= 0) {
      setScrollIdx(newIdx)
      // Auto-close when scrolling to a new front panel
      if (openIdx !== null && openIdx !== newIdx) {
        setOpenIdx(null)
      }
    }
  })

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  if (isMobile || shouldReduceMotion) {
    return (
      <section id="faq" className="py-24 bg-[#0A0E1A]">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-16 text-white">FAQ</h2>
          <div className="flex flex-col gap-4">
            {faqs.map((faq, idx) => (
              <div key={idx} className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
                <button 
                  onClick={() => setOpenIdx(openIdx === idx ? null : idx)}
                  className="w-full flex items-center justify-between p-6 text-left"
                >
                  <span className="font-medium text-lg text-white">{faq.q}</span>
                  <motion.div animate={{ rotate: openIdx === idx ? 180 : 0 }}>
                    <ChevronDown className="w-5 h-5 text-brand-cyan" />
                  </motion.div>
                </button>
                <AnimatePresence>
                  {openIdx === idx && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="p-6 pt-0 text-[#C9CDD6]">
                        {faq.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  // Desktop Stacking Deck
  return (
    <section ref={containerRef} id="faq" className="h-[200vh] relative w-full bg-[#0A0E1A]">
      <div className="sticky top-0 h-screen flex flex-col items-center justify-center overflow-hidden">
        
        <h2 className="text-4xl md:text-6xl font-bold text-white mb-16 relative z-50">
          Frequently Asked Questions
        </h2>

        <div className="relative w-full max-w-3xl h-[400px]">
          {faqs.map((faq, idx) => {
            const offset = idx - scrollIdx
            const isFront = offset === 0
            const isPast = offset < 0
            
            // Calculate styles based on stack position
            const zIndex = 40 - Math.abs(offset)
            const scale = isPast ? 1.1 : 1 - offset * 0.05
            const y = isPast ? -100 : offset * 20
            const opacity = isPast ? 0 : 1 - offset * 0.2

            return (
              <motion.div
                key={idx}
                layoutId={isFront && idx === faqs.length - 1 ? "faq-cta-handoff" : undefined}
                className={`absolute inset-x-0 mx-auto rounded-3xl border ${
                  isFront ? 'border-brand-cyan/50 bg-[#0A0E1A]/60 backdrop-blur-xl shadow-2xl' : 'border-white/10 bg-[#161B22]'
                }`}
                style={{ zIndex, transformOrigin: "top center" }}
                animate={{ scale, y, opacity }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              >
                {/* Static Shard Watermark on Front Panel */}
                {isFront && (
                  <div className="absolute inset-0 z-0 overflow-hidden rounded-3xl pointer-events-none opacity-20">
                    <Shard shardId={1} className="w-64 h-64 absolute -bottom-10 -right-10 text-brand-cyan" />
                  </div>
                )}

                <div className="relative z-10 w-full h-full flex flex-col">
                  <button 
                    onClick={() => {
                      if (isFront) setOpenIdx(openIdx === idx ? null : idx)
                      // Optional: if clicking a background panel, we could manually scroll to it, but native scroll is driving it.
                    }}
                    className={`w-full flex items-center justify-between p-8 text-left ${!isFront ? 'cursor-default' : 'cursor-pointer'}`}
                    disabled={!isFront}
                  >
                    <span className={`font-bold text-xl md:text-2xl transition-colors ${isFront ? 'text-white' : 'text-white/50'}`}>
                      {faq.q}
                    </span>
                    {isFront && (
                      <motion.div
                        animate={{ rotate: openIdx === idx ? 180 : 0 }}
                        transition={{ type: "spring", stiffness: 200, damping: 20 }}
                      >
                        <ChevronDown className="w-8 h-8 text-brand-cyan" />
                      </motion.div>
                    )}
                  </button>
                  
                  <AnimatePresence>
                    {openIdx === idx && isFront && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ type: "spring", stiffness: 200, damping: 25 }}
                        className="overflow-hidden"
                      >
                        <div className="p-8 pt-0 text-[#C9CDD6] text-lg leading-relaxed">
                          {faq.a}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
