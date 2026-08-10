'use client'

import { useRef } from 'react'
import { Shard } from '@/components/ui/Shard'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'

const steps = [
  { title: "Discover", desc: "Learn business, goals, constraints." },
  { title: "Strategize", desc: "Map architecture and tech stack." },
  { title: "Design", desc: "Wireframes, prototypes, visual system." },
  { title: "Develop", desc: "Sprints, regular demos, clean code." },
  { title: "Test & Refine", desc: "QA, performance, security checks." },
  { title: "Launch & Scale", desc: "Deploy, monitor, ongoing technical partnership." },
]

export function Scene4Process() {
  const containerRef = useRef<HTMLElement>(null)
  
  useGSAP(() => {
    gsap.registerPlugin(ScrollTrigger);

    // 1. Vertical Line Scrub
    // The vertical line draws as the user scrolls from top center to bottom center
    gsap.fromTo(".process-vertical-line", 
      { scaleY: 0 },
      { 
        scaleY: 1,
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top center",
          end: "bottom center",
          scrub: true
        }
      }
    );

    // 2. Horizontal Exit Line Scrub
    // Draws as the section exits the viewport
    gsap.fromTo(".process-horizontal-line",
      { scaleX: 0 },
      {
        scaleX: 1,
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "bottom center",
          end: "bottom top",
          scrub: true
        }
      }
    );

    // 3. Per-Step Reveal
    const stepElements = gsap.utils.toArray('.process-step') as HTMLElement[];
    
    stepElements.forEach((stepEl) => {
      const shardNode = stepEl.querySelector('.step-shard');
      const textContent = stepEl.querySelector('.step-content');
      
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: stepEl,
          start: "top 70%",
          end: "top 40%",
          scrub: true
        }
      });

      // Animate Shard
      tl.fromTo(shardNode, 
        { scale: 0, opacity: 0, rotationZ: -45 },
        { scale: 1, opacity: 1, rotationZ: 0, ease: "power2.out", duration: 1 },
        0
      );

      // Animate Text
      tl.fromTo(textContent,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, ease: "power2.out", duration: 1 },
        0
      );
    });

  }, { scope: containerRef });

  return (
    <section ref={containerRef} id="process" className="relative py-32 w-full bg-[#0A0E1A]">
      <div className="max-w-4xl mx-auto px-4 pl-4 md:pl-4">
        <h2 className="text-4xl md:text-6xl font-bold mb-24 text-center md:text-left md:ml-32">
          Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-blue to-brand-cyan">Process</span>
        </h2>

        <div className="relative">
          {/* Faded background line */}
          <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-[2px] bg-white/10 transform md:-translate-x-1/2"></div>
          
          {/* Animated Neon Line */}
          <div 
            className="process-vertical-line absolute left-8 md:left-1/2 top-0 bottom-0 w-[2px] bg-brand-cyan transform md:-translate-x-1/2 origin-top drop-shadow-[0_0_10px_rgba(34,211,238,0.8)]"
          />

          <div className="space-y-32 pb-32">
            {steps.map((step, idx) => {
               const isEven = idx % 2 === 0
               return (
                <div key={idx} className={`process-step relative flex flex-col md:flex-row items-center ${
                  isEven ? 'md:flex-row-reverse' : ''
                }`}>
                  
                  {/* Shard Node Wrapper */}
                  <div className="absolute left-8 md:left-1/2 w-12 h-12 transform -translate-x-1/2 -translate-y-1/2 z-10 flex items-center justify-center pointer-events-none">
                     <div className="step-shard w-full h-full">
                       <Shard shardId={isEven ? 3 : 4} className="w-12 h-12" />
                     </div>
                  </div>

                  {/* Content */}
                  <div className="step-content w-full md:w-1/2 pl-16 md:pl-0 md:px-16">
                    <div className={`p-8 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm ${
                      isEven ? 'md:text-left' : 'md:text-right'
                    }`}>
                      <span className="text-brand-cyan font-mono text-xl md:text-2xl mb-3 block">Step 0{idx + 1}</span>
                      <h3 className="text-3xl md:text-4xl font-bold text-white mb-3">{step.title}</h3>
                      <p className="text-[#C9CDD6] text-lg">{step.desc}</p>
                    </div>
                  </div>
                </div>
               )
            })}
          </div>

          {/* Hand-off line drawing off the right edge */}
          <div 
            className="process-horizontal-line absolute left-8 md:left-1/2 bottom-0 h-[2px] bg-brand-cyan origin-left drop-shadow-[0_0_10px_rgba(34,211,238,0.8)]"
            style={{ 
              width: "100vw", 
              marginLeft: "1px" // slight overlap to join perfectly
            }}
          />
        </div>
      </div>
    </section>
  )
}
