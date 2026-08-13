'use client'

import { useRef, MouseEvent, useState } from 'react'
import { motion, useMotionTemplate, useMotionValue } from 'framer-motion'
import { Shard } from '@/components/ui/Shard'

export interface ServiceType {
  id: string;
  title: string;
  description: string;
  techStack: string[];
}

export const servicesData: ServiceType[] = [
  { id: '1', title: "Custom Web Application Development", description: "We build custom web applications exactly how your business needs them...", techStack: ["Next.js", "React", "Node.js", "Python", "PostgreSQL", "MongoDB", "TypeScript", "Tailwind CSS"] },
  { id: '2', title: "SaaS Application Development", description: "Launch your own subscription-based software with ease...", techStack: ["Next.js", "NestJS", "React", "Stripe", "AWS", "Vercel", "PostgreSQL", "Redis", "Docker"] },
  { id: '3', title: "Desktop Application Development", description: "Get fast and reliable desktop software for Windows, Mac, or Linux...", techStack: ["Electron", "Tauri", "React", "Rust", "C++", "SQLite"] },
  { id: '4', title: "Progressive Web App (PWA) Development", description: "Give your users a mobile app experience directly from their web browser...", techStack: ["Next.js", "Service Workers", "Workbox", "IndexedDB", "React"] },
  { id: '5', title: "AI Solutions & Integration", description: "Add smart AI features to your existing systems...", techStack: ["Python", "LangChain", "OpenAI API", "Gemini", "Claude", "Pinecone", "TensorFlow", "FastAPI"] },
  { id: '6', title: "API Development & Integration", description: "Connect all your software tools together...", techStack: ["Node.js", "Express", "NestJS", "GraphQL", "REST", "Swagger", "Postman"] },
  { id: '7', title: "E-Commerce Website Development", description: "Start selling online with a custom e-commerce store...", techStack: ["Shopify", "Next.js Commerce", "Stripe", "WooCommerce", "Sanity", "PostgreSQL"] },
  { id: '8', title: "Business & Corporate Websites", description: "Build a strong online presence for your company...", techStack: ["Next.js", "Tailwind CSS", "Framer Motion", "Sanity CMS", "Vercel", "SEO"] },
  { id: '9', title: "WordPress Development", description: "Get a fully customized WordPress website that is easy for you to manage...", techStack: ["WordPress", "PHP", "MySQL", "WooCommerce", "Elementor", "ACF"] },
  { id: '10', title: "Shopify Development", description: "Launch a powerful Shopify store designed to convert visitors into buyers...", techStack: ["Shopify", "Liquid", "Hydrogen", "React", "Tailwind CSS", "GraphQL"] }
]

const clusters = [
  { id: 'build', name: 'Build.', services: [servicesData[0], servicesData[1], servicesData[2], servicesData[3]] },
  { id: 'integrate', name: 'Integrate.', services: [servicesData[4], servicesData[5]] },
  { id: 'sell', name: 'Sell.', services: [servicesData[6], servicesData[9]] },
  { id: 'establish', name: 'Establish.', services: [servicesData[7], servicesData[8]] },
]

export function ServiceCardItem({ service, index }: { service: ServiceType, index: number }) {
  const cardRef = useRef<HTMLDivElement>(null)
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const [isHovered, setIsHovered] = useState(false)

  const isUpdating = useRef(false)
  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current || isUpdating.current) return
    
    // Quick check to disable flashlight effect computationally if it's likely a touch event
    if (e.movementX === 0 && e.movementY === 0 && e.type !== 'mousemove') return
    
    const clientX = e.clientX
    const clientY = e.clientY
    const currentTarget = cardRef.current
    
    isUpdating.current = true
    requestAnimationFrame(() => {
      if (currentTarget) {
        const rect = currentTarget.getBoundingClientRect()
        mouseX.set(clientX - rect.left)
        mouseY.set(clientY - rect.top)
      }
      isUpdating.current = false
    })
  }

  const spotlight = useMotionTemplate`radial-gradient(400px circle at ${mouseX}px ${mouseY}px, rgba(34, 211, 238, 0.1), transparent 40%)`

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative overflow-hidden bg-[#0A0E1A]/80 backdrop-blur-md rounded-2xl border border-white/10 flex flex-col justify-between h-full p-6 lg:p-8 group cursor-pointer w-full transition-colors hover:border-cyan-500/30 min-h-[220px]"
    >
      <motion.div
        className="hidden md:block pointer-events-none absolute inset-0 z-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{ background: spotlight }}
      />

      <div className="relative z-10 flex flex-col h-full justify-between">
        <div>
          <div className="flex justify-between items-start mb-4">
            <span className="text-[#22D3EE] font-mono text-sm block">
              {(index + 1).toString().padStart(2, '0')}
            </span>
            <div className="text-white/20 group-hover:text-[#22D3EE] transition-colors duration-300">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="12 2 2 22 22 22" />
              </svg>
            </div>
          </div>
          <h3 className="text-xl md:text-2xl font-bold text-white mb-2">
            {service.title}
          </h3>
          <p className="text-[#C9CDD6] text-sm leading-relaxed line-clamp-2 group-hover:line-clamp-none transition-all duration-300 opacity-70 group-hover:opacity-100">
            {service.description}
          </p>
        </div>
        <div className="flex flex-wrap gap-2 mt-4">
          {service.techStack.map(tech => (
            <span 
              key={tech} 
              className={`px-3 py-1 text-xs bg-white/5 border rounded-full transition-colors duration-300 ${
                isHovered ? 'border-cyan-500/50 text-white' : 'border-white/10 text-[#8B949E]'
              }`}
            >
              {tech}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}

export function Scene3Services() {
  return (
    <section id="services" className="w-full bg-[#0A0E1A] py-24 lg:py-32 overflow-hidden">
      <div className="w-full flex flex-col gap-24 lg:gap-32 items-center justify-center">
        
        {clusters.map((cluster, cIdx) => (
          <div 
            key={cluster.id} 
            className="w-full grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 px-6 md:pl-24 lg:pl-48 md:pr-12 max-w-7xl mx-auto relative"
          >
            {/* Left 1/2: Premium Editorial Title (Sticky) */}
            <div className="w-full flex flex-col justify-start lg:pr-8 lg:sticky lg:top-32 h-fit z-20">
              <motion.h2 
                className={`text-5xl md:text-7xl lg:text-[96px] font-bold tracking-tight leading-none ${cIdx === 0 ? 'text-transparent bg-clip-text bg-gradient-to-r from-brand-cyan to-brand-blue' : 'text-white'}`}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
              >
                {cluster.name}
              </motion.h2>
            </div>

            {/* Right 1/2: Tactile Card Group */}
            <div className="w-full flex flex-col gap-6 lg:gap-8 items-center lg:items-start justify-center z-10">
              <div className="w-full max-w-full md:max-w-[500px] lg:max-w-[400px] flex flex-col gap-6 lg:gap-8">
                {cluster.services.map((service, idx) => (
                  <motion.div 
                    key={service.id} 
                    className="w-full"
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{
                      duration: 0.5,
                      delay: idx * 0.1,
                      ease: "easeOut"
                    }}
                  >
                    <ServiceCardItem service={service} index={idx} />
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Background Decoration */}
            {cIdx === 1 && (
              <div className="absolute top-[30%] lg:top-[10%] right-[-20%] lg:right-[-10%] opacity-20 lg:opacity-30 pointer-events-none z-0">
                <Shard shardId={3} className="w-64 h-64 lg:w-96 lg:h-96 blur-[1px]" />
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  )
}
