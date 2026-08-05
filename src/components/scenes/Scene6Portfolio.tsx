'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

// Dummy data mapping to the seed data requested
const projects = [
  { id: 1, title: "Hamdard Enterprises", category: "Web App", tech: "Next.js, Node.js" },
  { id: 2, title: "Interactive 3D Human Body Explorer", category: "3D & Interactive", tech: "WebGL, Three.js" },
  { id: 3, title: "Ferrari - Luxury Interactive Web Experience", category: "Frontend UI", tech: "Framer Motion" },
  { id: 4, title: "Neurosurgeon Practice & Medical Portfolio", category: "Healthcare Tech", tech: "MERN stack" },
  { id: 5, title: "Lost & Found Campus Management System", category: "Database Systems", tech: "PHP, MySQL" },
]

const categories = ["All", "Web App", "3D & Interactive", "Frontend UI", "Healthcare Tech", "Database Systems"]

export function Scene6Portfolio() {
  const [activeCategory, setActiveCategory] = useState("All")

  const filteredProjects = activeCategory === "All" 
    ? projects 
    : projects.filter(p => p.category === activeCategory)

  return (
    <section className="py-32 bg-black min-h-screen">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 text-white">Selected Work</h2>
        
        {/* Filter Chips */}
        <div className="flex flex-wrap justify-center gap-4 mb-16">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`relative px-6 py-2 rounded-full text-sm font-medium transition-colors ${
                activeCategory === cat ? 'text-brand-navy' : 'text-brand-silver hover:text-white'
              }`}
            >
              {activeCategory === cat && (
                <motion.div 
                  layoutId="active-pill"
                  className="absolute inset-0 bg-brand-cyan rounded-full z-[-1]"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
              {cat}
            </button>
          ))}
        </div>

        {/* Staggered Grid */}
        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project) => (
              <motion.div
                layout
                key={project.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.3 }}
                className="glass-panel aspect-square rounded-2xl p-8 flex flex-col justify-end relative overflow-hidden group"
              >
                <div className="absolute inset-0 bg-gradient-to-t from-brand-navy via-brand-navy/50 to-transparent z-10 opacity-80 group-hover:opacity-100 transition-opacity" />
                <div className="z-20 transform translate-y-4 group-hover:translate-y-0 transition-transform">
                  <span className="text-brand-cyan text-sm font-mono mb-2 block">{project.category}</span>
                  <h3 className="text-2xl font-bold text-white mb-2 leading-tight">{project.title}</h3>
                  <p className="text-brand-silver/70 text-sm">{project.tech}</p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  )
}
