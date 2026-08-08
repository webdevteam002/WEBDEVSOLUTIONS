'use client'

import { motion, useScroll, useTransform, useMotionValueEvent } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'

export function Scene1Hero() {

  const containerRef = useRef<HTMLDivElement>(null)
  const imgRef = useRef<HTMLImageElement>(null)
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  })
  
  const [images, setImages] = useState<HTMLImageElement[]>([])
  const [isLoaded, setIsLoaded] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const lastDrawnIndex = useRef(-1)

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Preload all 480 frames on mount
  useEffect(() => {
    const frameCount = 480
    const loadedImages: HTMLImageElement[] = new Array(frameCount)
    let loadedCount = 0

    for (let i = 0; i < frameCount; i++) {
      const img = new Image()
      img.src = `/hero-frames/frame_${(i + 1).toString().padStart(4, '0')}.webp`
      loadedImages[i] = img
      img.onload = () => {
        loadedCount++
        if (loadedCount === frameCount) {
          setImages(loadedImages)
          setIsLoaded(true)
        }
      }
      img.onerror = () => {
        loadedCount++
        if (loadedCount === frameCount) {
          setImages(loadedImages)
          setIsLoaded(true)
        }
      }
    }
  }, [])

  // Initial render when loaded
  useEffect(() => {
    if (isLoaded && images.length > 0 && imgRef.current) {
      lastDrawnIndex.current = 0
      imgRef.current.src = images[0].src
    }
  }, [isLoaded, images])

  // Scroll-scrub: useMotionValueEvent to map scroll progress to frame index
  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    if (!isLoaded || images.length === 0 || !imgRef.current) return
    const frameIndex = Math.min(479, Math.max(0, Math.round(latest * 479)))

    if (frameIndex !== lastDrawnIndex.current) {
      lastDrawnIndex.current = frameIndex
      imgRef.current.src = images[frameIndex].src
    }
  })

  const chevronOpacity = useTransform(scrollYProgress, [0, 0.1], [1, 0])
  return (
    <div ref={containerRef} className="relative w-full h-[400vh]">
      {/* Sticky container that stays on screen during the 400vh scroll */}
      <div className="sticky top-0 left-0 w-full h-screen flex flex-col md:flex-row items-center z-0 overflow-hidden bg-[#0A0E1A]">
        
        {/* Left Column: Text (Visible above the background) */}
        <div className="w-full md:w-1/2 h-full flex flex-col justify-center px-8 md:pl-32 z-20 pt-24 md:pt-0 pointer-events-auto">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight drop-shadow-lg"
          >
            We Engineer <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-cyan to-brand-blue">
              Digital Experiences
            </span><br/>
            That Scale
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="text-lg text-[#C9CDD6] mb-8 max-w-lg"
          >
            A premium Web3 & Full-Stack Agency with 2+ Years Experience delivering cinematic websites and scalable applications.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4 }}
          >
            <a href="#projects" className="inline-block px-8 py-4 bg-brand-cyan text-[#0A0E1A] font-bold rounded-full hover:bg-white transition-colors duration-300 shadow-[0_0_20px_rgba(34,211,238,0.3)] hover:scale-105 transform">
              Explore Our Work
            </a>
          </motion.div>
        </div>

        {/* Right Column: Animated Frames */}
        <div className="absolute inset-0 md:relative md:w-1/2 h-full z-0 pointer-events-none">
          {/* Fallback gradient shown until frames load */}
          {!isLoaded && (
            <div className="absolute inset-0 w-full h-full bg-gradient-to-b from-[#0A0E1A] to-[#1E40AF]/20" />
          )}
          {/* Native img tag for perfect object-fit cover and native hardware acceleration */}
          <img 
            ref={imgRef}
            className="w-full h-full object-cover object-[center_15%] mix-blend-screen opacity-30 md:opacity-100"
            alt="Cinematic Scroll Sequence"
          />
          {/* Fade mask for mobile/desktop seamless blending */}
          <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-[#0A0E1A] via-[#0A0E1A]/80 md:via-transparent to-transparent pointer-events-none" />
        </div>

        {/* Scroll-cue chevron */}
        <motion.div 
          className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/50 z-20"
          style={{ opacity: chevronOpacity }}
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="6 9 12 15 18 9"></polyline>
          </svg>
        </motion.div>
      </div>
    </div>
  )
}
