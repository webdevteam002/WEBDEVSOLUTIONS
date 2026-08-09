'use client'

import React, { useRef, useEffect, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Image from 'next/image'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

export interface ProjectData {
  id: string;
  title: string;
  category: string;
  description: string;
  tech: string[];
  link?: string | null;
  imageFallback?: string;
}

export default function PortfolioGSAP({ projects }: { projects: ProjectData[] }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const panelsRef = useRef<(HTMLDivElement | null)[]>([])
  
  const categories = Array.from(new Set(projects.map(p => p.category)))
  const [activeCategory, setActiveCategory] = useState<string>(categories[0])

  useEffect(() => {
    if (typeof window === 'undefined') return
    if (window.innerWidth < 768) return
    if (!containerRef.current || !trackRef.current) return

    const ctx = gsap.context(() => {
      const totalPanels = projects.length

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "bottom bottom",
          scrub: 1,
          onUpdate: (self) => {
            // Determine active category based on progress
            const index = Math.min(
              Math.floor(self.progress * totalPanels),
              totalPanels - 1
            )
            setActiveCategory(projects[index].category)
          }
        }
      })

      // 1. Move the horizontal track
      tl.to(trackRef.current, {
        x: () => -(window.innerWidth * (totalPanels - 1)),
        ease: "none",
        duration: totalPanels - 1
      }, 0)

      // 2. Animate individual panels as they come in and out
      panelsRef.current.forEach((panel, i) => {
        if (!panel) return
        const img = panel.querySelector('.portfolio-img')
        const content = panel.querySelector('.portfolio-content')
        
        // Initial setup for panels > 0
        if (i > 0) {
          gsap.set(img, { scale: 0.8, opacity: 0.4 })
          gsap.set(content, { opacity: 0, x: 50 })
        }

        // Animate IN (from i-1 to i)
        if (i > 0) {
          tl.to(img, { scale: 1, opacity: 1, ease: "power2.out", duration: 1 }, i - 1)
          tl.to(content, { opacity: 1, x: 0, ease: "power2.out", duration: 1 }, i - 1)
        }

        // Animate OUT (from i to i+1)
        if (i < totalPanels - 1) {
          tl.to(img, { scale: 0.8, opacity: 0.4, ease: "power2.in", duration: 1 }, i)
          tl.to(content, { opacity: 0, x: -50, ease: "power2.in", duration: 1 }, i)
        }
      })
    }, containerRef)

    // Ensure ScrollTrigger measures correctly after layout
    const timer = setTimeout(() => {
      ScrollTrigger.refresh()
    }, 100)

    return () => {
      ctx.revert()
      clearTimeout(timer)
    }
  }, [projects])

  const handleCategoryClick = (category: string) => {
    const index = projects.findIndex(p => p.category === category)
    if (index !== -1 && containerRef.current) {
      const containerTop = containerRef.current.offsetTop
      const targetScroll = containerTop + (index * window.innerHeight)
      window.scrollTo({ top: targetScroll, behavior: 'smooth' })
    }
  }

  return (
    <div 
      ref={containerRef} 
      className="relative w-full bg-[#0A0E1A] hidden md:block shrink-0"
      style={{ height: `${projects.length * 100}vh` }} // Explicit scroll-distance container
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden flex flex-col">
        
        {/* Persistent Category Filter Chips */}
        <div className="absolute top-24 left-1/2 -translate-x-1/2 z-50 flex gap-4 bg-[#0A0E1A]/80 backdrop-blur-md p-2 rounded-full border border-white/10 shadow-2xl">
          {categories.map(cat => (
            <button 
              key={cat}
              onClick={() => handleCategoryClick(cat)}
              className={`px-5 py-2 rounded-full text-sm font-bold transition-all duration-300 ${
                activeCategory === cat 
                  ? 'bg-brand-cyan text-black scale-105' 
                  : 'text-white/60 hover:text-white hover:bg-white/10'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Horizontal Track */}
        <div ref={trackRef} className="flex h-screen will-change-transform" style={{ width: `${projects.length * 100}vw` }}>
          {projects.map((project, i) => (
            <div 
              key={project.id} 
              ref={el => { panelsRef.current[i] = el }}
              className="h-full flex items-center justify-center px-16 py-12 shrink-0"
              style={{ width: '100vw' }}
            >
            <div className="w-full max-w-6xl mx-auto flex items-center gap-12 relative">
              {/* Image side */}
              <div className="w-1/2 h-[55vh] rounded-2xl overflow-hidden relative border border-white/10 shadow-2xl">
                {project.imageFallback ? (
                  <Image src={project.imageFallback} alt={project.title} fill className="object-cover portfolio-img transform origin-center" />
                ) : (
                  <div className="w-full h-full bg-brand-navy flex items-center justify-center portfolio-img transform origin-center">
                    <span className="text-white/20 font-mono text-sm">Asset Coming Soon</span>
                  </div>
                )}
              </div>
              
              {/* Content side */}
              <div className="w-1/2 flex flex-col gap-4 portfolio-content">
                <span className="text-brand-cyan font-mono text-sm">{project.category}</span>
                <h3 className="text-2xl lg:text-3xl font-bold text-white leading-tight">{project.title}</h3>
                <p className="text-[#C9CDD6] text-sm leading-relaxed">{project.description}</p>
                <div className="flex flex-wrap gap-2 mt-2">
                  {project.tech.map(t => (
                     <span key={t} className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs text-white/50">{t}</span>
                  ))}
                </div>
                
                <div className="mt-4">
                  {project.link ? (
                    <a href={project.link} target="_blank" rel="noreferrer" className="inline-block px-6 py-2.5 bg-brand-cyan text-black font-bold rounded-full hover:scale-105 transition-transform text-sm">
                      View Project
                    </a>
                  ) : (
                    <span className="inline-block px-6 py-2.5 bg-white/5 border border-white/10 text-white/50 font-bold rounded-full text-sm">
                      Case Study
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      </div>
    </div>
  )
}

