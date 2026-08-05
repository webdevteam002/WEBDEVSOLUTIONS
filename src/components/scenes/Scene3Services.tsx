'use client'

import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import Image from 'next/image'

const services = [
  "Custom Web Application Development (Next.js, React, Node.js)",
  "SaaS Application Development (Multi-tenancy, Stripe, Dashboards)",
  "Desktop Application Development (Electron, Tauri, React)",
  "Progressive Web App (PWA) Development (Offline-first, Next.js)",
  "AI Solutions & Integration (LLMs, LangChain, OpenAI)",
  "API Development & Integration (RESTful APIs, Node.js, Express)",
  "E-Commerce Website Development (Next.js Commerce, Shopify)",
  "Business & Corporate Websites (Next.js, Tailwind, CMS)",
  "WordPress Development (Custom themes, PHP, WooCommerce)",
  "Shopify Development (Custom Liquid themes, Hydrogen)"
]

export function Scene3Services() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  })

  // Hexagon rotation mapped to scroll
  const hexRotate = useTransform(scrollYProgress, [0, 1], [0, 360])

  return (
    <section ref={containerRef} className="relative w-full bg-brand-navy flex flex-col md:flex-row items-start z-10">
      {/* Left Panel: Sticky 3D Hexagon/Logo */}
      <div className="sticky top-0 w-full md:w-1/2 h-[50vh] md:h-screen flex flex-col items-center justify-center p-8 border-b md:border-b-0 md:border-r border-white/10">
        <motion.div style={{ rotate: hexRotate }} className="relative w-48 h-48 md:w-64 md:h-64">
          <Image 
             src="/logo.png" 
             alt="Services Logo"
             fill
             className="object-contain drop-shadow-2xl"
          />
        </motion.div>
        <h2 className="text-3xl font-bold text-white mt-8 tracking-wider uppercase drop-shadow-md">
          Our Services
        </h2>
      </div>

      {/* Right Panel: Normal Scrolling Cards */}
      <div className="w-full md:w-1/2 py-24 md:py-32 px-4 md:px-16 flex flex-col gap-6">
        {services.map((service, idx) => (
          <div key={idx} className="glass-panel p-8 rounded-xl flex items-center gap-6 hover:border-brand-cyan/50 hover:bg-white/5 transition-all">
            <span className="text-brand-gold font-mono text-xl md:text-2xl">{(idx + 1).toString().padStart(2, '0')}</span>
            <h3 className="text-lg md:text-2xl text-white font-medium">{service}</h3>
          </div>
        ))}
      </div>
    </section>
  )
}
