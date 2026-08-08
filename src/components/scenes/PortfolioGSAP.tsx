'use client'

import React, { useRef, useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Image from 'next/image'

gsap.registerPlugin(ScrollTrigger)

export interface ProjectData {
  id: string;
  title: string;
  category: string;
  description: string;
  tech: string[];
  link?: string | null;
  imageFallback?: string;
}

export const portfolioData: ProjectData[] = [
  { id: '1', title: "Hamdard Enterprises Portal", category: "Web App", description: "Engineered and deployed a production-grade enterprise web application...", tech: ["Next.js", "React", "Node.js"], link: "https://hamdardenterprises.vercel.app/", imageFallback: "/hamdard.png" },
  { id: '2', title: "Interactive 3D Human Body Explorer", category: "3D & Interactive", description: "Architected an interactive 3D anatomy visualization tool...", tech: ["WebGL", "Three.js"], link: null },
  { id: '3', title: "Ferrari Digital Experience", category: "Frontend UI", description: "Designed a high-end vehicle showcase inspired by minimalist aesthetics...", tech: ["Framer Motion", "CSS3"], link: null },
  { id: '4', title: "Neurosurgeon Medical Portfolio", category: "Healthcare Tech", description: "Developed a custom healthcare web application...", tech: ["React", "Node.js"], link: null },
  { id: '5', title: "Campus Management System", category: "Database Systems", description: "Built a centralized campus registry...", tech: ["PHP", "MySQL"], link: null }
]

export default function PortfolioGSAP({ projects = portfolioData }: { projects?: ProjectData[] }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const panelsRef = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    // Only run on desktop
    if (window.innerWidth < 768) return
    if (!containerRef.current || !trackRef.current) return

    const mm = gsap.matchMedia()

    mm.add("(min-width: 768px)", () => {
      const panels = panelsRef.current
      const totalPanels = panels.length

      // Pin the container for 5x viewport width scroll
      const pinTrigger = ScrollTrigger.create({
        trigger: containerRef.current,
        start: "top top",
        end: `+=${100 * totalPanels}%`,
        pin: true,
        scrub: 1,
      })

      // Animate the track moving horizontally
      gsap.to(trackRef.current, {
        xPercent: -100 * (totalPanels - 1),
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: `+=${100 * totalPanels}%`,
          scrub: 1,
        }
      })

      // We can create specific transitions for the images inside the panels
      panels.forEach((panel, i) => {
        if (!panel) return
        const img = panel.querySelector('.portfolio-img')
        const content = panel.querySelector('.portfolio-content')
        
        if (img && i > 0) {
           // Previous image scales down and slides left, new one scales up
           // This happens automatically with the horizontal track movement, but we can add scale
           gsap.fromTo(img, 
             { scale: 0.8, filter: 'blur(10px)' },
             { 
               scale: 1, 
               filter: 'blur(0px)',
               ease: "power2.out",
               scrollTrigger: {
                 trigger: containerRef.current,
                 start: `top+=${100 * (i - 0.5)}% top`,
                 end: `top+=${100 * i}% top`,
                 scrub: 1
               }
             }
           )
           gsap.to(img, {
             scale: 0.8,
             filter: 'blur(10px)',
             ease: "power2.in",
             scrollTrigger: {
               trigger: containerRef.current,
               start: `top+=${100 * i}% top`,
               end: `top+=${100 * (i + 0.5)}% top`,
               scrub: 1
             }
           })
        }
        
        if (content && i > 0) {
           gsap.from(content, {
             opacity: 0,
             y: 50,
             scrollTrigger: {
               trigger: containerRef.current,
               start: `top+=${100 * (i - 0.2)}% top`,
               end: `top+=${100 * i}% top`,
               scrub: 1
             }
           })
        }
      })
      
      return () => {
         pinTrigger.kill()
      }
    })

    // Timeout to ensure DOM is fully painted before refresh
    const timer = setTimeout(() => {
      ScrollTrigger.refresh()
    }, 100)

    return () => {
      mm.revert()
      clearTimeout(timer)
    }
  }, [])

  return (
    <div ref={containerRef} className="h-screen w-full overflow-hidden bg-[#0A0E1A] relative hidden md:block">
      {/* Category Filter Chips persist above pinned track */}
      <div className="absolute top-8 left-1/2 -translate-x-1/2 z-50 flex gap-4 bg-[#0A0E1A]/50 backdrop-blur-md p-2 rounded-full border border-white/10">
        {["All", ...Array.from(new Set(projects.map(p => p.category)))].map(cat => (
          <button key={cat} className="px-4 py-1 rounded-full text-xs font-mono text-brand-cyan hover:bg-white/10 transition-colors">
            {cat}
          </button>
        ))}
      </div>

      <div ref={trackRef} className="flex h-full" style={{ width: `${projects.length * 100}%` }}>
        {projects.map((project, i) => (
          <div 
            key={project.id} 
            ref={el => { panelsRef.current[i] = el }}
            className="h-full w-screen flex items-center justify-center p-24 shrink-0"
          >
            <div className="w-full h-full flex items-center gap-16 relative">
              {/* Image side */}
              <div className="w-3/5 h-[70vh] rounded-2xl overflow-hidden relative border border-white/10 shadow-2xl">
                {project.imageFallback ? (
                  <Image src={project.imageFallback} alt={project.title} fill className="object-cover portfolio-img transform origin-center" />
                ) : (
                  <div className="w-full h-full bg-brand-navy flex items-center justify-center portfolio-img transform origin-center">
                    <span className="text-white/20 font-mono text-sm">Asset Coming Soon</span>
                  </div>
                )}
                {/* Hand-off class for the very last image */}
                {i === projects.length - 1 && (
                  <div className="portfolio-anchor-handoff absolute inset-0 transition-all duration-1000" />
                )}
              </div>
              
              {/* Content side */}
              <div className="w-2/5 flex flex-col gap-6 portfolio-content">
                <span className="text-brand-cyan font-mono">{project.category}</span>
                <h3 className="text-4xl lg:text-6xl font-bold text-white leading-tight">{project.title}</h3>
                <p className="text-[#C9CDD6] text-lg leading-relaxed">{project.description}</p>
                <div className="flex flex-wrap gap-2 mt-4">
                  {project.tech.map(t => (
                     <span key={t} className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs text-white/50">{t}</span>
                  ))}
                </div>
                
                <div className="mt-8">
                  {project.link ? (
                    <a href={project.link} target="_blank" rel="noreferrer" className="inline-block px-8 py-3 bg-brand-cyan text-black font-bold rounded-full hover:scale-105 transition-transform">
                      View Project
                    </a>
                  ) : (
                    <span className="inline-block px-8 py-3 bg-white/5 border border-white/10 text-white/50 font-bold rounded-full">
                      Case Study Coming Soon
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
