'use client'

import { useRef, MouseEvent, useState, useEffect } from 'react'
import { motion, useMotionTemplate, useMotionValue, useScroll, useTransform, useReducedMotion } from 'framer-motion'

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

export function ServiceCardItem({ service, index, isMobile }: { service: ServiceType, index: number, isMobile: boolean }) {
  const cardRef = useRef<HTMLDivElement>(null)
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const [isHovered, setIsHovered] = useState(false)

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current || isMobile) return
    const rect = cardRef.current.getBoundingClientRect()
    mouseX.set(e.clientX - rect.left)
    mouseY.set(e.clientY - rect.top)
  }

  const spotlight = useMotionTemplate`radial-gradient(400px circle at ${mouseX}px ${mouseY}px, rgba(34, 211, 238, 0.1), transparent 40%)`

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={!isMobile ? { y: -4 } : {}}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="relative overflow-hidden bg-[#0A0E1A]/80 backdrop-blur-md rounded-2xl border border-white/5 flex flex-col justify-between h-full p-6 lg:p-8 group cursor-pointer shrink-0 w-[320px] md:w-[400px]"
    >
      {!isMobile && (
        <motion.div
          className="pointer-events-none absolute inset-0 z-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          style={{ background: spotlight }}
        />
      )}

      <div className="relative z-10 flex flex-col h-full justify-between">
        <div>
          <div className="flex justify-between items-start mb-6">
            <span className="text-[#22D3EE] font-mono text-sm block">
              {(index + 1).toString().padStart(2, '0')}
            </span>
            <div className="text-white/20 group-hover:text-[#22D3EE] transition-colors duration-300">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="12 2 2 22 22 22" />
              </svg>
            </div>
          </div>
          <h3 className="text-xl md:text-2xl font-bold text-white mb-4">
            {service.title}
          </h3>
          <motion.p
            initial={{ opacity: 0.7 }}
            animate={{ opacity: isHovered || isMobile ? 1 : 0.7 }}
            className="text-[#C9CDD6] text-sm leading-relaxed"
          >
            {service.description}
          </motion.p>
        </div>
        <div className="flex flex-wrap gap-2 mt-6">
          {service.techStack.map(tech => (
            <motion.span 
              key={tech} 
              className={`px-3 py-1 text-xs bg-white/5 border rounded-full transition-colors duration-300 ${
                isHovered || isMobile ? 'border-cyan-500/50 text-white' : 'border-white/10 text-[#8B949E]'
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

export function Scene3Services({ services: _ignored }: { services?: any }) {
  const containerRef = useRef<HTMLElement>(null)
  const shouldReduceMotion = useReducedMotion()
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  })

  const [isMobile, setIsMobile] = useState(false)
  
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Cluster 1 (Build) - 0 to 0.25
  const c1x = useTransform(scrollYProgress, [0, 0.05, 0.2, 0.25], ["50vw", "0vw", "0vw", "-100vw"])
  const c1op = useTransform(scrollYProgress, [0, 0.05, 0.2, 0.25], [0, 1, 1, 0])
  
  // Cluster 2 (Integrate) - 0.25 to 0.5
  const c2x = useTransform(scrollYProgress, [0.25, 0.3, 0.45, 0.5], ["50vw", "0vw", "0vw", "-100vw"])
  const c2op = useTransform(scrollYProgress, [0.25, 0.3, 0.45, 0.5], [0, 1, 1, 0])
  
  // Cluster 3 (Sell) - 0.5 to 0.75
  const c3x = useTransform(scrollYProgress, [0.5, 0.55, 0.7, 0.75], ["50vw", "0vw", "0vw", "-100vw"])
  const c3op = useTransform(scrollYProgress, [0.5, 0.55, 0.7, 0.75], [0, 1, 1, 0])
  
  // Cluster 4 (Establish) - 0.75 to 1
  const c4x = useTransform(scrollYProgress, [0.75, 0.8, 0.95, 1], ["50vw", "0vw", "0vw", "-100vw"]) // Continues left to hand-off into Process
  const c4op = useTransform(scrollYProgress, [0.75, 0.8, 0.95, 1], [0, 1, 1, 0])

  const clustersAnim = [
    { x: c1x, op: c1op },
    { x: c2x, op: c2op },
    { x: c3x, op: c3op },
    { x: c4x, op: c4op },
  ]

  if (isMobile || shouldReduceMotion) {
    return (
      <section id="services" className="w-full bg-[#0A0E1A] py-24 px-4 overflow-x-hidden">
        <div className="max-w-7xl mx-auto space-y-16 pl-8">
          {clusters.map((cluster, cIdx) => (
            <div key={cluster.id} className="snap-start pt-12">
              {cIdx === 0 ? (
                <motion.h2 layoutId="we-build-differently" className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-brand-cyan to-brand-blue mb-8">
                  {cluster.name}
                </motion.h2>
              ) : (
                <h2 className="text-4xl font-bold text-white mb-8">{cluster.name}</h2>
              )}
              <div className="flex flex-col gap-6">
                {cluster.services.map((service, idx) => (
                  <ServiceCardItem key={service.id} service={service} index={idx} isMobile={true} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    )
  }

  return (
    <section id="services" ref={containerRef} className="relative w-full h-[600vh] bg-[#0A0E1A]">
      <div className="sticky top-0 h-screen w-full overflow-hidden flex items-center pl-32">
        {clusters.map((cluster, cIdx) => (
          <motion.div 
            key={cluster.id}
            className="absolute left-32 right-0 flex flex-col justify-center"
            style={{ x: clustersAnim[cIdx].x, opacity: clustersAnim[cIdx].op }}
          >
            {cIdx === 0 ? (
              <motion.h2 
                layoutId="we-build-differently"
                className="text-6xl md:text-8xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-brand-cyan to-brand-blue mb-12"
              >
                {cluster.name}
              </motion.h2>
            ) : (
              <h2 className="text-6xl md:text-8xl font-bold text-white mb-12">
                {cluster.name}
              </h2>
            )}
            
            <div className="flex gap-6 overflow-visible pb-12 w-full pr-32">
              {cluster.services.map((service, idx) => (
                <ServiceCardItem key={service.id} service={service} index={idx} isMobile={false} />
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
