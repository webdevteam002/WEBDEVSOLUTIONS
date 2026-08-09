'use client'

import { useState, useRef, useEffect, RefObject } from 'react'
import { motion, AnimatePresence, useScroll, useTransform, useMotionValueEvent, useReducedMotion, MotionValue } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import { Shard } from '@/components/ui/Shard'
import { useLenis } from '@studio-freight/react-lenis'

const faqs = [
  { q: "What services do you offer?", a: "We offer full-cycle custom web and mobile app development, SaaS platforms, AI integrations, desktop applications, and high-performance e-commerce solutions." },
  { q: "How much does a custom app cost?", a: "Costs vary based on complexity, features, and timeline. Our projects typically start at $10k. We provide a detailed architectural roadmap and fixed-price quote during the Discovery phase." },
  { q: "Do you build SaaS platforms?", a: "Yes, SaaS is our specialty. We build scalable, multi-tenant architectures with integrated billing (Stripe), real-time dashboards, and robust role-based access control." },
  { q: "How long does it take?", a: "A standard web application takes 8-12 weeks from kickoff to launch. More complex AI or desktop applications may take 3-6 months. We work in 2-week agile sprints to deliver continuous value." },
  { q: "Do you provide ongoing support?", a: "Absolutely. We offer retainer-based technical partnerships to handle maintenance, monitoring, security updates, and feature scaling post-launch." },
]

function FAQCard({
  faq,
  idx,
  deckProgress,
  entryProgress,
  activeIndex,
  openIdx,
  setOpenIdx,
  totalFaqs,
  containerRef
}: {
  faq: typeof faqs[0]
  idx: number
  deckProgress: MotionValue<number>
  entryProgress: MotionValue<number>
  activeIndex: number
  openIdx: number | null
  setOpenIdx: (val: number | null) => void
  totalFaqs: number
  containerRef: RefObject<HTMLElement>
}) {
  const lenis = useLenis()
  const deckIndex = useTransform(deckProgress, [0, 1], [0, totalFaqs - 1])
  const offsetValue = useTransform(deckIndex, v => idx - v)

  const deckScale = useTransform(offsetValue, [-1, 0, 1, 2, 3, 4], [1.1, 1, 0.95, 0.9, 0.85, 0.8])
  const deckY = useTransform(offsetValue, [-1, 0, 1, 2, 3, 4], [-100, 0, 20, 40, 60, 80])
  const deckOpacity = useTransform(offsetValue, [-1, 0, 1, 2, 3, 4], [0, 1, 0.8, 0.6, 0.4, 0.2])
  const deckZ = useTransform(offsetValue, v => (v < 0 ? 0 : 10 - Math.round(v)))

  // Entry stagger mapping (ensure input ranges are sorted)
  const entryStart = idx * 0.1
  const entryEnd = 0.5 + idx * 0.1
  const entryY = useTransform(entryProgress, [entryStart, entryEnd], [100, 0])
  const entryOpacity = useTransform(entryProgress, [entryStart, entryEnd], [0, 1])

  const isFront = activeIndex === idx
  const isOpen = openIdx === idx

  const handleCardClick = () => {
    if (isFront) {
      setOpenIdx(isOpen ? null : idx)
    } else {
      const containerTop = containerRef.current?.offsetTop || 0
      const scrollDistance = (containerRef.current?.offsetHeight || 0) - window.innerHeight
      const targetScroll = containerTop + (idx / (totalFaqs - 1)) * scrollDistance
      
      if (lenis) {
        lenis.scrollTo(targetScroll, { duration: 1.2 })
      } else {
        window.scrollTo({ top: targetScroll, behavior: 'smooth' })
      }
    }
  }

  return (
    <motion.div
      style={{ y: entryY, opacity: entryOpacity, zIndex: isOpen ? 50 : deckZ }}
      className="absolute inset-x-0 w-full origin-top"
    >
      <motion.div style={{ y: deckY, scale: deckScale, opacity: deckOpacity }} className="w-full">
        <motion.div
          animate={{
            scale: isOpen ? 1.05 : 1,
            y: isOpen ? -20 : 0,
          }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className={`w-full rounded-3xl border overflow-hidden shadow-2xl relative transition-colors duration-500 ${
            isFront 
              ? 'border-brand-cyan/50 bg-[#0A0E1A]/60 backdrop-blur-xl' 
              : 'border-white/10 bg-[#161B22]'
          }`}
        >
          {/* Static Shard Watermark on Open Panel */}
          {isOpen && (
            <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none opacity-20">
              <Shard shardId={1} className="w-96 h-96 absolute -bottom-20 -right-20 text-brand-cyan" />
            </div>
          )}

          <div className="relative z-10 w-full h-full flex flex-col">
            <button 
              onClick={handleCardClick}
              className="w-full flex items-center justify-between p-8 text-left cursor-pointer"
            >
              <span className={`font-bold text-xl md:text-2xl transition-colors ${isFront ? 'text-white' : 'text-white/50'}`}>
                {faq.q}
              </span>
              <motion.div
                animate={{ 
                  rotate: isOpen ? 180 : 0,
                  opacity: isFront ? 1 : 0.5 
                }}
                transition={{ type: "spring", stiffness: 200, damping: 20 }}
              >
                <ChevronDown className={`w-8 h-8 transition-colors ${isFront ? 'text-brand-cyan' : 'text-white/30'}`} />
              </motion.div>
            </button>
            
            <AnimatePresence>
              {isOpen && (
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
      </motion.div>
    </motion.div>
  )
}

export function Scene8FAQ() {
  const containerRef = useRef<HTMLElement>(null)
  const [openIdx, setOpenIdx] = useState<number | null>(0)
  const [activeIndex, setActiveIndex] = useState(0)
  const [isMobile, setIsMobile] = useState(false)
  const shouldReduceMotion = useReducedMotion()

  const { scrollYProgress: entryProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "start start"]
  })

  const { scrollYProgress: deckProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  })

  const deckIndex = useTransform(deckProgress, [0, 1], [0, faqs.length - 1])

  useMotionValueEvent(deckIndex, "change", (latest) => {
    if (isMobile || shouldReduceMotion) return
    const rounded = Math.round(latest)
    if (rounded !== activeIndex) {
      setActiveIndex(rounded)
      if (openIdx !== null && openIdx !== rounded) {
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
              <div key={idx} className="bg-[#161B22] border border-white/10 rounded-2xl overflow-hidden">
                <button 
                  onClick={() => setOpenIdx(openIdx === idx ? null : idx)}
                  className="w-full flex items-center justify-between p-6 text-left cursor-pointer"
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
    <section ref={containerRef} id="faq" className="h-[400vh] relative w-full bg-[#0A0E1A]">
      <div className="sticky top-0 h-screen flex flex-col items-center justify-center overflow-hidden px-4">
        
        <h2 className="text-4xl md:text-6xl font-bold text-white mb-16 relative z-50">
          Frequently Asked Questions
        </h2>

        <div className="relative w-full max-w-3xl h-[100px] flex-shrink-0">
          {faqs.map((faq, idx) => (
            <FAQCard
              key={idx}
              faq={faq}
              idx={idx}
              deckProgress={deckProgress}
              entryProgress={entryProgress}
              activeIndex={activeIndex}
              openIdx={openIdx}
              setOpenIdx={setOpenIdx}
              totalFaqs={faqs.length}
              containerRef={containerRef}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
