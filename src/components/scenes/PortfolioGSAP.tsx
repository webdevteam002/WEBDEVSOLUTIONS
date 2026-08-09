'use client'

import React from 'react'
import Image from 'next/image'

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
  return (
    <div className="relative w-full bg-[#0A0E1A] hidden md:block overflow-x-auto">
      <div className="flex h-screen" style={{ width: `${projects.length * 100}vw` }}>
        {projects.map((project) => (
          <div 
            key={project.id} 
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
  )
}

