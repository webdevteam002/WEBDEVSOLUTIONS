'use client'

import React, { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import Image from 'next/image'

// Disable SSR for GSAP to avoid hydration mismatches
const PortfolioGSAP = dynamic(() => import('./PortfolioGSAP'), { ssr: false })

export interface ProjectData {
  id: string;
  title: string;
  category: string;
  description: string;
  tech: string[];
  link?: string | null;
  imageFallback?: string;
}

export function Scene6Portfolio({ projects }: { projects: ProjectData[] }) {
  const [isMobile, setIsMobile] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  if (!mounted) return null

  // Desktop uses the dynamically imported GSAP version
  if (!isMobile) {
    return <PortfolioGSAP projects={projects} />
  }

  // Mobile uses native CSS scroll-snap
  return (
    <section id="projects" className="relative bg-[#0A0E1A] py-24 border-y border-white/5">
      <div className="px-6 mb-8">
        <h2 className="text-4xl font-bold text-white mb-4">Selected Work</h2>
      </div>
      
      <div className="flex overflow-x-auto snap-x snap-mandatory hide-scrollbar w-full px-6 gap-6 pb-8">
        {projects.map((project) => (
          <div key={project.id} className="w-[85vw] shrink-0 snap-center flex flex-col gap-6">
            <div className="w-full h-[40vh] rounded-2xl overflow-hidden relative border border-white/10">
              {project.imageFallback ? (
                <Image src={project.imageFallback} alt={project.title} fill className="object-cover" />
              ) : (
                <div className="w-full h-full bg-brand-navy flex items-center justify-center">
                  <span className="text-white/20 font-mono text-xs">Asset Coming Soon</span>
                </div>
              )}
            </div>
            
            <div className="flex flex-col gap-4">
              <span className="text-brand-cyan font-mono text-xs">{project.category}</span>
              <h3 className="text-2xl font-bold text-white leading-tight">{project.title}</h3>
              <p className="text-[#C9CDD6] text-sm leading-relaxed">{project.description}</p>
              <div className="flex flex-wrap gap-2 mt-2">
                {project.tech.map(t => (
                   <span key={t} className="px-2 py-1 bg-white/5 border border-white/10 rounded-full text-[10px] text-white/50">{t}</span>
                ))}
              </div>
              
              <div className="mt-4">
                {project.link ? (
                  <a href={project.link} target="_blank" rel="noreferrer" className="inline-block px-6 py-2 bg-brand-cyan text-black font-bold rounded-full text-sm">
                    View Project
                  </a>
                ) : (
                  <span className="inline-block px-6 py-2 bg-white/5 border border-white/10 text-white/50 font-bold rounded-full text-sm">
                    Case Study
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
