'use client'

import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { Shard } from '@/components/ui/Shard'

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
  
  // Create a scroll window that ends slightly before the actual end,
  // so the remaining 10% can be used to draw the horizontal exit line.
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start center", "end center"]
  })

  // Vertical line draws from 0 to 0.9 progress
  const lineDraw = useTransform(scrollYProgress, [0, 0.9], [0, 1])
  
  // Horizontal line (hand-off to Technology) draws from 0.9 to 1.0 progress
  const horizontalExit = useTransform(scrollYProgress, [0.9, 1], [0, 1])

  return (
    <section ref={ref} className="relative py-32 w-full bg-[#0A0E1A]">
      <div className="max-w-4xl mx-auto px-4 pl-32 md:pl-4">
        <h2 className="text-4xl md:text-6xl font-bold mb-24 text-center md:text-left md:ml-32">
          Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-blue to-brand-cyan">Process</span>
        </h2>

        <div className="relative">
          {/* Faded background line */}
          <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-[2px] bg-white/10 transform md:-translate-x-1/2"></div>
          
          {/* Animated Neon Line */}
          <motion.div 
            className="absolute left-8 md:left-1/2 top-0 bottom-0 w-[2px] bg-brand-cyan transform md:-translate-x-1/2 origin-top drop-shadow-[0_0_10px_rgba(34,211,238,0.8)]"
            style={{ scaleY: lineDraw }}
          />

          <div className="space-y-32 pb-32">
            {steps.map((step, idx) => {
               const isEven = idx % 2 === 0
               // Node appears right when the line reaches it
               const nodeProgress = idx / (steps.length - 1)
               const nodeStart = nodeProgress * 0.9 // scaled to the 0.9 vertical duration
               
               const shardOpacity = useTransform(scrollYProgress, [nodeStart - 0.05, nodeStart], [0, 1])
               const shardScale = useTransform(scrollYProgress, [nodeStart - 0.05, nodeStart + 0.1], [0, 1])
               const shardRot = useTransform(scrollYProgress, [nodeStart - 0.05, nodeStart + 0.1], [-45, 0])

               return (
                <div key={idx} className={`relative flex flex-col md:flex-row items-center ${
                  isEven ? 'md:flex-row-reverse' : ''
                }`}>
                  
                  {/* Shard Node */}
                  <div className="absolute left-8 md:left-1/2 w-12 h-12 transform -translate-x-1/2 -translate-y-1/2 z-10 flex items-center justify-center pointer-events-none">
                     <motion.div
                       style={{ opacity: shardOpacity, scale: shardScale, rotateZ: shardRot }}
                     >
                       <Shard shardId={isEven ? 3 : 4} className="w-12 h-12" />
                     </motion.div>
                  </div>

                  {/* Content */}
                  <div className="w-full md:w-1/2 pl-16 md:pl-0 md:px-16">
                    <div className={`p-8 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm ${
                      isEven ? 'md:text-left' : 'md:text-right'
                    }`}>
                      <span className="text-brand-cyan font-mono mb-2 block">Step 0{idx + 1}</span>
                      <h3 className="text-2xl font-bold text-white mb-2">{step.title}</h3>
                      <p className="text-[#C9CDD6]">{step.desc}</p>
                    </div>
                  </div>
                </div>
               )
            })}
          </div>

          {/* Hand-off line drawing off the right edge */}
          <motion.div 
            className="absolute left-8 md:left-1/2 bottom-0 h-[2px] bg-brand-cyan origin-left drop-shadow-[0_0_10px_rgba(34,211,238,0.8)]"
            style={{ 
              width: "100vw", 
              scaleX: horizontalExit,
              marginLeft: "1px" // slight overlap to join perfectly
            }}
          />
        </div>
      </div>
    </section>
  )
}
