'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'

export interface ProjectData {
  id: string;
  title: string;
  category: string;
  description: string;
  tech: string[];
}

export const portfolioData: ProjectData[] = [
  {
    id: '1',
    title: "Hamdard Enterprises Portal",
    category: "Web App",
    description: "Engineered and deployed a production-grade enterprise web application with fully fluid mobile layout and sub-second page performance. Configured automated CI/CD deployment on Vercel with custom domain and SSL.",
    tech: ["Next.js", "React", "Tailwind CSS", "Vercel", "Node.js"]
  },
  {
    id: '2',
    title: "Interactive 3D Human Body Explorer",
    category: "3D & Interactive",
    description: "Architected an interactive 3D anatomy visualization tool with real-time rotation, zoom, and structure inspection. Optimized 3D geometry rendering for a steady 60 FPS across desktop and mobile browsers.",
    tech: ["JavaScript (ES6+)", "WebGL", "Three.js", "HTML5", "CSS3"]
  },
  {
    id: '3',
    title: "Ferrari Digital Experience",
    category: "Frontend UI",
    description: "Designed a high-end vehicle showcase inspired by minimalist Apple and Ferrari digital aesthetics. Built smooth micro-interactions, scroll-driven visual triggers, and high-DPI asset presentation.",
    tech: ["Next.js", "React", "Framer Motion", "Modern CSS3"]
  },
  {
    id: '4',
    title: "Neurosurgeon Medical Portfolio",
    category: "Healthcare Tech",
    description: "Developed a custom healthcare web application with dynamic patient consultation forms. Implemented secure RESTful API endpoints for appointment inquiries and client communications.",
    tech: ["React", "Node.js", "Express", "MongoDB", "Tailwind CSS"]
  },
  {
    id: '5',
    title: "Campus Management System",
    category: "Database Systems",
    description: "Built a centralized campus registry with secure authentication, role-based access, and CRUD operations. Structured relational schemas with optimized indexing for multi-parameter search.",
    tech: ["PHP", "MySQL", "JavaScript", "HTML5", "CSS3"]
  }
]

export function ProjectCard({ project }: { project: ProjectData }) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <div 
      className="relative w-full h-[400px]"
      style={{ perspective: 1000 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <motion.div
        className="w-full h-full relative"
        style={{ transformStyle: "preserve-3d" }}
        animate={{ rotateY: isHovered ? 180 : 0 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
      >
        {/* FRONT FACE */}
        <div 
          className="absolute inset-0 w-full h-full rounded-2xl overflow-hidden bg-brand-navy border border-white/5"
          style={{ backfaceVisibility: "hidden" }}
        >
          {/* Typography-driven design: generic subtle noise/gradient using Image as requested */}
          <div className="absolute inset-0 z-0 opacity-20 mix-blend-overlay">
             <Image src="/logo-parts/pixels.webp" alt="Background" fill className="object-cover" />
          </div>
          
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A0E1A] via-[#0A0E1A]/40 to-transparent z-10" />
          
          <div className="absolute top-6 right-6 z-20 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full border border-white/20">
            <span className="text-xs text-white font-medium">{project.category}</span>
          </div>
          
          <div className="absolute bottom-6 left-6 right-6 z-20">
            <h3 className="text-2xl font-bold text-white">{project.title}</h3>
          </div>
        </div>

        {/* BACK FACE */}
        <div 
          className="absolute inset-0 w-full h-full rounded-2xl bg-[#0A0E1A] border border-[#22D3EE]/30 overflow-hidden"
          style={{ 
            backfaceVisibility: "hidden", 
            transform: "rotateY(180deg)" 
          }}
        >
          <div className="flex flex-col justify-between p-8 h-full">
            <div>
              <div className="flex justify-between items-start mb-6">
                <h3 className="text-xl font-bold text-white leading-tight pr-4">{project.title}</h3>
                <span className="text-xs text-[#22D3EE] font-mono whitespace-nowrap mt-1">{project.category}</span>
              </div>
              <p className="text-[#C9CDD6] text-sm leading-relaxed overflow-y-auto max-h-[160px] pr-2 custom-scrollbar">
                {project.description}
              </p>
            </div>
            
            <div className="flex flex-wrap gap-2 mt-4">
              {project.tech.map((t, i) => (
                <span key={i} className="px-2 py-1 text-xs text-[#8B949E] bg-white/5 border border-white/10 rounded-full">
                  {t}
                </span>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

// Accept generic props to maintain compatibility with page.tsx
export function Scene6Portfolio({ projects: _ignored }: { projects?: any }) {
  const [activeCategory, setActiveCategory] = useState("All")
  
  const categories = ["All", ...Array.from(new Set(portfolioData.map(p => p.category)))]

  const filteredProjects = activeCategory === "All" 
    ? portfolioData 
    : portfolioData.filter(p => p.category === activeCategory)

  return (
    <section id="projects" className="py-32 bg-black min-h-screen">
      <div className="max-w-7xl mx-auto px-4 md:px-12 lg:px-24">
        <h2 className="text-5xl md:text-7xl font-bold text-white tracking-tight mb-16 drop-shadow-lg">
          Selected Work
        </h2>
        
        {/* Filter Chips */}
        <div className="flex flex-wrap gap-4 mb-16">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`relative px-6 py-2 rounded-full text-sm font-medium transition-colors z-10 ${
                activeCategory === cat ? 'text-black bg-brand-cyan' : 'text-brand-silver hover:text-white border border-white/10'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project) => (
              <motion.div
                key={project.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
              >
                <ProjectCard project={project} />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </section>
  )
}
