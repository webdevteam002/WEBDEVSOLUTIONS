'use client'

import { useRef, MouseEvent, useState, useEffect } from 'react'
import { motion, useMotionTemplate, useMotionValue } from 'framer-motion'
import { Shard } from '@/components/ui/Shard'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, useGSAP)
}

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
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative overflow-hidden bg-[#0A0E1A]/80 backdrop-blur-md rounded-2xl border border-white/5 flex flex-col justify-between h-full p-6 lg:p-8 group cursor-pointer w-full md:w-[400px] transition-colors hover:border-cyan-500/30 min-h-[220px]"
    >
      {!isMobile && (
        <motion.div
          className="pointer-events-none absolute inset-0 z-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          style={{ background: spotlight }}
        />
      )}

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
                isHovered || isMobile ? 'border-cyan-500/50 text-white' : 'border-white/10 text-[#8B949E]'
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

function MobileServices() {
  return (
    <section id="services" className="w-full bg-[#0A0E1A]">
      <div className="w-full flex flex-col pt-24 pb-24">
        {clusters.map((cluster, cIdx) => (
          <div key={cluster.id} className="min-h-screen w-full flex flex-col justify-center px-6 relative snap-start mb-24 last:mb-0">
            {cIdx === 0 ? (
              <motion.h2 layoutId="we-build-differently" className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-brand-cyan to-brand-blue mb-12">
                {cluster.name}
              </motion.h2>
            ) : (
              <h2 className="text-6xl font-bold text-white mb-12">{cluster.name}</h2>
            )}
            <div className="flex flex-col gap-6 relative z-10 w-full">
              {cluster.services.map((service, idx) => (
                <ServiceCardItem key={service.id} service={service} index={idx} isMobile={true} />
              ))}
            </div>
            {cIdx === 1 && (
              <div className="absolute top-[30%] right-[-10%] opacity-20 pointer-events-none z-0 overflow-hidden">
                <Shard shardId={3} className="w-64 h-64 blur-[1px]" />
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  )
}

function DesktopServices() {
  const containerRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLDivElement>(null)
  
  useGSAP(() => {
    // Total pin scroll distance: 1000vh (100vh per card, 10 cards total)
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: triggerRef.current,
        start: "top top",
        end: "+=1000%",
        scrub: 1,
        pin: true,
        anticipatePin: 1
      }
    });

    let currentTime = 0;

    clusters.forEach((cluster, cIdx) => {
      const clusterEl = document.querySelector(`.cluster-${cIdx}`);
      const cards = gsap.utils.toArray(`.cluster-${cIdx} .service-card`);
      const numCards = cluster.services.length;

      cards.forEach((card, cardIdx) => {
        const isActiveTimeStart = currentTime + cardIdx;
        const isActiveTimeEnd = isActiveTimeStart + 1;

        // Future -> Active (Slide to front)
        if (cardIdx > 0) {
          tl.to(card, {
            y: 0,
            scale: 1,
            opacity: 1,
            duration: 0.2,
            ease: "power2.out"
          }, isActiveTimeStart - 0.2);
        }

        // Active -> Past (Slide up and fade out)
        // We do this for all cards except the last one of the cluster, 
        // which stays active and rides the horizontal cluster swap transition.
        if (cardIdx < numCards - 1) {
          tl.to(card, {
            y: -100,
            opacity: 0,
            scale: 0.95,
            duration: 0.2,
            ease: "power2.in"
          }, isActiveTimeEnd - 0.2);
        }
      });

      // Horizontal Swap Out - Takes the last 0.4 (40vh) of this cluster's time
      const isLastCluster = cIdx === clusters.length - 1;
      const clusterEndTime = currentTime + numCards;

      if (!isLastCluster) {
        const nextClusterEl = document.querySelector(`.cluster-${cIdx + 1}`);
        
        // Active cluster slides out left
        tl.to(clusterEl, {
          x: "-100vw",
          opacity: 0,
          ease: "power2.inOut",
          duration: 0.4
        }, clusterEndTime - 0.4); 
        
        // Next cluster slides in from right
        tl.fromTo(nextClusterEl, {
          x: "100vw",
          opacity: 0
        }, {
          x: "0vw",
          opacity: 1,
          ease: "power2.inOut",
          duration: 0.4
        }, clusterEndTime - 0.4);
      }

      currentTime += numCards;
    });

    // Spin shard continuously
    gsap.to(".shard-fragment", {
      rotation: 360,
      duration: 30,
      repeat: -1,
      ease: "linear"
    });

  }, { scope: containerRef });

  return (
    <section id="services" ref={triggerRef} className="h-screen w-full bg-[#0A0E1A] overflow-hidden relative">
      <div ref={containerRef} className="relative w-full h-full flex items-center justify-center">
        
        {/* Shard Assembly Motif */}
        <div className="shard-fragment absolute top-[20%] left-[40%] opacity-20 pointer-events-none z-0">
           <Shard shardId={3} className="w-[800px] h-[800px] blur-[3px]" />
        </div>

        {clusters.map((cluster, cIdx) => (
          <div 
            key={cluster.id} 
            className={`cluster-${cIdx} absolute inset-0 w-full h-full flex items-center px-8 md:pl-48 md:pr-12 max-w-7xl mx-auto z-10`}
            style={{ 
               transform: cIdx === 0 ? "translateX(0)" : "translateX(100vw)",
               opacity: cIdx === 0 ? 1 : 0
            }}
          >
            {/* Left 1/3: Premium Editorial Title */}
            <div className="w-1/3 flex flex-col justify-center h-full pr-8">
              {cIdx === 0 ? (
                <motion.h2 
                  layoutId="we-build-differently"
                  className="text-[80px] lg:text-[120px] font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-brand-cyan to-brand-blue leading-none"
                >
                  {cluster.name}
                </motion.h2>
              ) : (
                <h2 className="text-[80px] lg:text-[120px] font-bold tracking-tight text-white leading-none">
                  {cluster.name}
                </h2>
              )}
            </div>

            {/* Right 2/3: Tactile Card Group */}
            <div className="w-2/3 h-full relative flex items-center justify-center">
              <div className="relative w-full max-w-[400px] flex justify-center items-center h-full">
                {cluster.services.map((service, idx) => (
                  <div 
                    key={service.id} 
                    className="service-card absolute w-full"
                    style={{ 
                      // Initial setup: first card is active, others are stacked behind
                      transform: idx === 0 
                        ? `translateY(0px) scale(1)` 
                        : `translateY(${idx * 20}px) scale(${1 - idx * 0.05})`,
                      opacity: idx === 0 ? 1 : 0.4,
                      zIndex: 10 - idx
                    }}
                  >
                    <ServiceCardItem service={service} index={idx} isMobile={false} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

export function Scene3Services(props: any) {
  const [mounted, setMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setMounted(true);
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  if (!mounted) return <div className="h-screen bg-[#0A0E1A]" />;

  if (isMobile) {
    return <MobileServices />
  }

  return <DesktopServices />
}
