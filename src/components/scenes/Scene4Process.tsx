'use client'

import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'

const steps = [
  { title: "Discover", desc: "Learn business, goals, constraints." },
  { title: "Strategize", desc: "Map architecture and tech stack." },
  { title: "Design", desc: "Wireframes, prototypes, visual system." },
  { title: "Develop", desc: "Sprints, regular demos, clean code." },
  { title: "Test & Refine", desc: "QA, performance, security checks." },
  { title: "Launch & Scale", desc: "Deploy, monitor, ongoing technical partnership." },
]

export function Scene4Process() {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start center", "end center"]
  })

  return (
    <section ref={ref} className="relative py-32 w-full bg-black/80">
      <div className="max-w-4xl mx-auto px-4">
        <h2 className="text-4xl md:text-6xl font-bold mb-24 text-center">
          Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-blue to-brand-cyan">Process</span>
        </h2>

        <div className="relative">
          {/* Neon circuit line background */}
          <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-[2px] bg-white/10 transform md:-translate-x-1/2"></div>
          
          {/* Animated Neon Line */}
          <motion.div 
            className="absolute left-8 md:left-1/2 top-0 w-[2px] bg-brand-cyan transform md:-translate-x-1/2 neon-glow origin-top"
            style={{ scaleY: scrollYProgress }}
          ></motion.div>

          <div className="space-y-24">
            {steps.map((step, idx) => {
               const isEven = idx % 2 === 0
               return (
                <div key={idx} className={`relative flex flex-col md:flex-row items-center ${
                  isEven ? 'md:flex-row-reverse' : ''
                }`}>
                  
                  {/* Center Node */}
                  <div className="absolute left-8 md:left-1/2 w-4 h-4 rounded-full bg-brand-navy border-2 border-brand-cyan transform -translate-x-1/2 z-10">
                     <motion.div 
                        className="w-full h-full bg-brand-cyan rounded-full"
                        style={{
                           opacity: useTransform(scrollYProgress, [idx / steps.length, (idx + 1) / steps.length], [0, 1])
                        }}
                     />
                  </div>

                  {/* Content */}
                  <div className="w-full md:w-1/2 pl-16 md:pl-0 md:px-12">
                    <div className={`glass-panel p-8 rounded-2xl ${
                      isEven ? 'md:text-left' : 'md:text-right'
                    }`}>
                      <span className="text-brand-blue font-mono mb-2 block">Step 0{idx + 1}</span>
                      <h3 className="text-2xl font-bold text-white mb-2">{step.title}</h3>
                      <p className="text-brand-silver">{step.desc}</p>
                    </div>
                  </div>
                </div>
               )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
