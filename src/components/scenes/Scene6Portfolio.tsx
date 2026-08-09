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
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  // STEP 1: Static content only, no animation.
  return (
    <section id="projects" className="relative bg-[#0A0E1A] py-24 border-y border-white/5">
      <div className="px-6 md:px-12 mb-12">
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">Selected Work (Static Step 1)</h2>
        <p className="text-white/50 font-mono text-sm">Verifying data rendering on fallback and MongoDB paths.</p>
      </div>
      
      <div className="flex flex-col w-full px-6 md:px-12 gap-16 pb-8">
        {projects.map((project, i) => (
          <div key={project.id} className="w-full flex flex-col md:flex-row gap-8 border border-white/10 p-6 rounded-2xl bg-white/[0.02]">
            <div className="w-full md:w-1/2 h-[300px] md:h-[500px] rounded-xl overflow-hidden relative border border-white/10">
              {project.imageFallback ? (
                <Image src={project.imageFallback} alt={project.title} fill className="object-cover" />
              ) : (
                <div className="w-full h-full bg-brand-navy flex items-center justify-center">
                  <span className="text-white/20 font-mono text-xs">Asset Coming Soon</span>
                </div>
              )}
            </div>
            
            <div className="w-full md:w-1/2 flex flex-col justify-center gap-4">
              <span className="text-brand-cyan font-mono text-xs">0{i + 1} — {project.category}</span>
              <h3 className="text-3xl font-bold text-white leading-tight">{project.title}</h3>
              <p className="text-[#C9CDD6] text-base leading-relaxed max-w-xl">{project.description}</p>
              <div className="flex flex-wrap gap-2 mt-4">
                {project.tech.map(t => (
                   <span key={t} className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs text-white/70">{t}</span>
                ))}
              </div>
              
              <div className="mt-6">
                {project.link ? (
                  <a href={project.link} target="_blank" rel="noreferrer" className="inline-block px-8 py-3 bg-brand-cyan text-black font-bold rounded-full text-sm hover:opacity-80 transition-opacity">
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
        ))}
      </div>
    </section>
  )
}
