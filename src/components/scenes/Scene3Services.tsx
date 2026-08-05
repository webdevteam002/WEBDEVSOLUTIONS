'use client'

import { useRef, MouseEvent, useState } from 'react'
import { motion, useMotionTemplate, useMotionValue } from 'framer-motion'

export interface ServiceType {
  id: string;
  title: string;
  description: string;
  techStack: string[];
}

// EXACT DATA PAYLOAD
export const servicesData: ServiceType[] = [
  {
    id: '1',
    title: "Custom Web Application Development",
    description: "We build custom web applications exactly how your business needs them. From internal management systems to customer portals, we ensure fast performance and secure data handling.",
    techStack: ["Next.js", "React", "Node.js", "Python", "PostgreSQL", "MongoDB", "TypeScript", "Tailwind CSS"]
  },
  {
    id: '2',
    title: "SaaS Application Development",
    description: "Launch your own subscription-based software with ease. We handle everything from secure user authentication to seamless payment integration and scalable cloud hosting.",
    techStack: ["Next.js", "NestJS", "React", "Stripe", "AWS", "Vercel", "PostgreSQL", "Redis", "Docker"]
  },
  {
    id: '3',
    title: "Desktop Application Development",
    description: "Get fast and reliable desktop software for Windows, Mac, or Linux. We create lightweight apps that feel native and can even work perfectly offline.",
    techStack: ["Electron", "Tauri", "React", "Rust", "C++", "SQLite"]
  },
  {
    id: '4',
    title: "Progressive Web App (PWA) Development",
    description: "Give your users a mobile app experience directly from their web browser. Our PWAs load instantly, work offline, and support push notifications without needing an app store.",
    techStack: ["Next.js", "Service Workers", "Workbox", "IndexedDB", "React"]
  },
  {
    id: '5',
    title: "AI Solutions & Integration",
    description: "Add smart AI features to your existing systems. We build custom chatbots, automate your daily workflows, and integrate powerful AI models to solve real business problems.",
    techStack: ["Python", "LangChain", "OpenAI API", "Gemini", "Claude", "Pinecone", "TensorFlow", "FastAPI"]
  },
  {
    id: '6',
    title: "API Development & Integration",
    description: "Connect all your software tools together. We build secure and fast APIs from scratch, or help you integrate third-party services like payment gateways and CRMs.",
    techStack: ["Node.js", "Express", "NestJS", "GraphQL", "REST", "Swagger", "Postman"]
  },
  {
    id: '7',
    title: "E-Commerce Website Development",
    description: "Start selling online with a custom e-commerce store. We focus on fast checkout, easy inventory management, and a smooth shopping experience to help you increase sales.",
    techStack: ["Shopify", "Next.js Commerce", "Stripe", "WooCommerce", "Sanity", "PostgreSQL"]
  },
  {
    id: '8',
    title: "Business & Corporate Websites",
    description: "Build a strong online presence for your company. We design professional, fast-loading websites that look great on mobile and rank well on Google.",
    techStack: ["Next.js", "Tailwind CSS", "Framer Motion", "Sanity CMS", "Vercel", "SEO"]
  },
  {
    id: '9',
    title: "WordPress Development",
    description: "Get a fully customized WordPress website that is easy for you to manage. We build secure themes and plugins from scratch without relying on slow, pre-made templates.",
    techStack: ["WordPress", "PHP", "MySQL", "WooCommerce", "Elementor", "ACF"]
  },
  {
    id: '10',
    title: "Shopify Development",
    description: "Launch a powerful Shopify store designed to convert visitors into buyers. We customize themes, integrate apps, and optimize your store for maximum speed and performance.",
    techStack: ["Shopify", "Liquid", "Hydrogen", "React", "Tailwind CSS", "GraphQL"]
  }
]

export function ServiceCard({ service, index }: { service: ServiceType, index: number }) {
  const cardRef = useRef<HTMLDivElement>(null)
  
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const [isHovered, setIsHovered] = useState(false)

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    mouseX.set(e.clientX - rect.left)
    mouseY.set(e.clientY - rect.top)
  }

  // Magnetic cyan spotlight effect (#22D3EE at 10% opacity)
  const spotlight = useMotionTemplate`radial-gradient(400px circle at ${mouseX}px ${mouseY}px, rgba(34, 211, 238, 0.1), transparent 40%)`

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="relative overflow-hidden bg-[#0A0E1A]/80 backdrop-blur-md rounded-2xl border border-white/5 flex flex-col justify-between h-full p-8 group cursor-pointer"
    >
      {/* Spotlight Hover Gradient */}
      <motion.div
        className="pointer-events-none absolute inset-0 z-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{ background: spotlight }}
      />

      <div className="relative z-10 flex flex-col h-full justify-between">
        <div className="flex flex-col">
          {/* Top Zone */}
          <div className="flex justify-between items-start mb-8">
            <span className="text-[#22D3EE] font-mono text-sm block">
              {(index + 1).toString().padStart(2, '0')}
            </span>
            <div className="text-white/20 group-hover:text-[#22D3EE] transition-colors duration-300">
              {/* Minimalist geometric outline icon (triangle) */}
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="12 2 2 22 22 22" />
              </svg>
            </div>
          </div>

          {/* Middle Zone */}
          <div className="mb-4">
            <h3 className="text-2xl font-bold text-white mb-4">
              {service.title}
            </h3>
            <motion.p
              initial={{ opacity: 0.7 }}
              animate={{ opacity: isHovered ? 1 : 0.7 }}
              transition={{ duration: 0.2 }}
              className="text-[#C9CDD6] text-sm leading-relaxed"
            >
              {service.description}
            </motion.p>
          </div>
        </div>

        {/* Bottom Zone */}
        <div className="flex flex-wrap gap-2 mt-6">
          {service.techStack.map(tech => (
            <motion.span 
              key={tech} 
              className={`px-3 py-1 text-xs bg-white/5 border rounded-full transition-colors duration-300 ${
                isHovered 
                  ? 'border-cyan-500/50 text-white' 
                  : 'border-white/10 text-[#8B949E]'
              }`}
            >
              {tech}
            </motion.span>
          ))}
        </div>
      </div>
    </motion.div>
  )
}

// We accept any props to ensure compatibility with page.tsx that might pass older service types
export function Scene3Services({ services: _ignored }: { services?: any }) {
  return (
    <section id="services" className="relative w-full min-h-screen bg-transparent z-10 py-32 px-4 md:px-12 lg:px-24">
      <div className="max-w-7xl mx-auto">
        <div className="mb-20">
          <h2 className="text-5xl md:text-7xl font-bold text-white tracking-tighter drop-shadow-lg">
            Our Services
          </h2>
          <p className="text-[#C9CDD6] text-xl mt-6 max-w-2xl">
            We deliver end-to-end technical solutions designed for scale, performance, and aesthetic brilliance.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {servicesData.map((service, idx) => (
            <ServiceCard key={service.id} service={service} index={idx} />
          ))}
        </div>
      </div>
    </section>
  )
}
