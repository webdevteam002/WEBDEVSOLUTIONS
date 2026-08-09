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
          end: `+=${totalPanels * 100}%`,
          pin: true,
          scrub: 1,
          markers: false, // removed markers for final commit
          onUpdate: (self) => {
            const index = Math.min(
              Math.floor(self.progress * totalPanels),
              totalPanels - 1
            )
            setActiveCategory(projects[index].category)
          }
        }
      })

      // Move the horizontal track
      tl.to(trackRef.current, {
        x: () => -(window.innerWidth * (totalPanels - 1)),
        ease: "none",
        duration: totalPanels - 1
      }, 0)

      // Animate individual panels (scale+slide images, fade content)
      panelsRef.current.forEach((panel, i) => {
        if (!panel) return
        const imgContainer = panel.querySelector('.portfolio-img-container')
        const content = panel.querySelector('.portfolio-content')
        
        // Initial state for panels coming in
        if (i > 0) {
          gsap.set(imgContainer, { scale: 0.7, xPercent: 50 })
          gsap.set(content, { opacity: 0.2, filter: "blur(4px)" })
        }

        // Animate IN (from i-1 to i)
        if (i > 0) {
          tl.to(imgContainer, { scale: 1, xPercent: 0, ease: "power2.out", duration: 1 }, i - 1)
          tl.to(content, { opacity: 1, filter: "blur(0px)", ease: "power2.out", duration: 1 }, i - 1)
        }

        // Animate OUT (from i to i+1)
        if (i < totalPanels - 1) {
          tl.to(imgContainer, { scale: 0.7, xPercent: -50, ease: "power2.in", duration: 1 }, i)
          tl.to(content, { opacity: 0.2, filter: "blur(4px)", ease: "power2.in", duration: 1 }, i)
        }
      })
    }, containerRef)

    return () => ctx.revert()
  }, [projects])

  const handleCategoryClick = (category: string) => {
    const index = projects.findIndex(p => p.category === category)
    if (index !== -1 && containerRef.current) {
      const targetScroll = containerRef.current.offsetTop + (index * window.innerHeight)
      window.scrollTo({ top: targetScroll, behavior: 'smooth' })
    }
  }

  return (
    <div ref={containerRef} className="relative w-full h-screen bg-[#0A0E1A] hidden md:block overflow-hidden">
      {/* Category Filter Chips */}
      <div className="absolute top-24 left-1/2 -translate-x-1/2 z-50 flex gap-4 bg-[#0A0E1A]/80 backdrop-blur-md p-2 rounded-full border border-white/10 shadow-2xl">
        {categories.map(cat => (
          <button 
            key={cat}
            onClick={() => handleCategoryClick(cat)}
            className={`px-5 py-2 rounded-full text-sm font-bold transition-all duration-300 whitespace-nowrap ${
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
            className="h-full flex items-center justify-center px-16 pt-32 pb-12 shrink-0 relative"
            style={{ width: '100vw' }}
          >
            <div className="w-full max-w-7xl mx-auto flex items-center gap-16 relative h-[70vh]">
              {/* Image side */}
              <div className="w-3/5 h-full rounded-2xl overflow-hidden relative border border-white/10 shadow-2xl portfolio-img-container transform origin-center will-change-transform">
                {project.imageFallback ? (
                  <Image src={project.imageFallback} alt={project.title} fill className="object-cover" />
                ) : (
                  <div className="w-full h-full bg-brand-navy flex items-center justify-center">
                    <span className="text-white/20 font-mono text-sm">Asset Coming Soon</span>
                  </div>
                )}
              </div>
              
              {/* Content side */}
              <div className="w-2/5 flex flex-col justify-center gap-6 portfolio-content will-change-[opacity,filter]">
                <span className="text-brand-cyan font-mono text-sm">0{i + 1} — {project.category}</span>
                <h3 className="text-4xl lg:text-5xl font-bold text-white leading-tight">{project.title}</h3>
                <p className="text-[#C9CDD6] text-lg leading-relaxed">{project.description}</p>
                <div className="flex flex-wrap gap-2 mt-2">
                  {project.tech.map(t => (
                     <span key={t} className="px-4 py-1.5 bg-white/5 border border-white/10 rounded-full text-xs text-white/70">{t}</span>
                  ))}
                </div>
                
                <div className="mt-6">
                  {project.link ? (
                    <a href={project.link} target="_blank" rel="noreferrer" className="inline-block px-8 py-3 bg-brand-cyan text-black font-bold rounded-full hover:scale-105 transition-transform text-sm">
                      View Live Site
                    </a>
                  ) : (
                    <span className="inline-block px-8 py-3 bg-white/5 border border-white/10 text-white/50 font-bold rounded-full text-sm">
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
  )
}
