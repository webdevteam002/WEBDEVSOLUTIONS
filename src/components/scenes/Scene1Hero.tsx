'use client'

import { motion, useScroll, useTransform, useReducedMotion, useMotionValueEvent } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import { Shard } from '@/components/ui/Shard'

export function Scene1Hero() {
  const words1 = "We Engineer".split(" ")
  const words2 = "Digital Experiences".split(" ")
  const words3 = "That Scale.".split(" ")

  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  })

  const shouldReduceMotion = useReducedMotion()
  
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

  // Preload all 192 frames on mount
  useEffect(() => {
    const frameCount = 192
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

  // Draw a specific frame onto the canvas
  const drawFrame = (index: number) => {
    const canvas = canvasRef.current
    if (!canvas) return
    const img = images[index]
    if (!img || !img.complete || img.naturalWidth === 0) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const dpr = window.devicePixelRatio || 1
    const rect = canvas.getBoundingClientRect()
    
    if (canvas.width !== Math.round(rect.width * dpr) || canvas.height !== Math.round(rect.height * dpr)) {
      canvas.width = Math.round(rect.width * dpr)
      canvas.height = Math.round(rect.height * dpr)
      ctx.scale(dpr, dpr)
    }

    // object-fit: cover math
    const imgRatio = img.naturalWidth / img.naturalHeight
    const canvasRatio = rect.width / rect.height
    let drawWidth = rect.width
    let drawHeight = rect.height
    let offsetX = 0
    let offsetY = 0

    if (imgRatio > canvasRatio) {
      drawWidth = rect.height * imgRatio
      offsetX = (rect.width - drawWidth) / 2
    } else {
      drawHeight = rect.width / imgRatio
      offsetY = (rect.height - drawHeight) / 2
    }

    ctx.clearRect(0, 0, rect.width, rect.height)
    ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight)
  }

  // Initial render when loaded
  useEffect(() => {
    if (isLoaded && images.length > 0) {
      lastDrawnIndex.current = 0
      requestAnimationFrame(() => drawFrame(0))
    }
  }, [isLoaded, images])

  // Resize handler
  useEffect(() => {
    const handleResize = () => {
      if (isLoaded && lastDrawnIndex.current >= 0) {
        requestAnimationFrame(() => drawFrame(lastDrawnIndex.current))
      }
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [isLoaded, images])

  // Scroll-scrub: useMotionValueEvent to map scroll progress to frame index
  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    if (!isLoaded || images.length === 0) return
    const frameIndex = Math.min(191, Math.max(0, Math.round(latest * 191)))

    if (frameIndex !== lastDrawnIndex.current) {
      lastDrawnIndex.current = frameIndex
      requestAnimationFrame(() => drawFrame(frameIndex))
    }
  })

  // Headline divergences
  const line1X = useTransform(scrollYProgress, [0, 1], ["0%", "-50%"])
  const line1Y = useTransform(scrollYProgress, [0, 1], ["0%", "-100%"])
  const line1Opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])
  
  const line2Scale = useTransform(scrollYProgress, [0, 1], [1, 3])
  const line2Opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])

  const line3X = useTransform(scrollYProgress, [0, 1], ["0%", "20%"])
  const line3Y = useTransform(scrollYProgress, [0, 1], ["0%", "150%"])
  
  const mobileDriftY = useTransform(scrollYProgress, [0, 1], ["0%", "-100%"])
  const mobileOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])

  const shard1Y = useTransform(scrollYProgress, [0, 1], [0, 300])
  const chevronOpacity = useTransform(scrollYProgress, [0, 0.1], [1, 0])

  const wordVariants = {
    hidden: { y: "120%", rotate: 5, opacity: 0 },
    visible: { 
      y: "0%", 
      rotate: 0,
      opacity: 1,
      transition: { type: "spring" as const, stiffness: 100, damping: 20 }
    }
  }

  return (
    <div ref={containerRef} className="relative w-full h-[200vh]">
      {/* Sticky canvas — NOT absolute */}
      <canvas 
        ref={canvasRef}
        className="sticky top-0 left-0 w-full h-screen object-cover z-0 opacity-30"
      />

      {/* Fallback gradient shown until frames load */}
      {!isLoaded && (
        <div className="fixed top-0 left-0 w-full h-screen z-0 bg-gradient-to-b from-[#0A0E1A] to-[#1E40AF]/20 pointer-events-none" />
      )}

      {/* Overlay content pinned on top of the sticky canvas */}
      <div className="sticky top-0 left-0 w-full h-screen pointer-events-none z-10" style={{ marginTop: '-100vh' }}>
        {/* Shard 1 overlay */}
        {!shouldReduceMotion && (
          <motion.div 
            className="absolute left-[15%] top-[20%]"
            style={{ y: shard1Y }}
          >
            <Shard shardId={1} className="w-24 h-24 opacity-60" />
          </motion.div>
        )}

        {/* Center: Kinetic Text Content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center px-4">
          <motion.div 
            initial="hidden"
            animate="visible"
            transition={{ staggerChildren: 0.1, delayChildren: 0.2 }}
            className="w-full flex flex-col items-center justify-center"
          >
            <h1 className="text-3xl md:text-5xl lg:text-7xl font-bold text-center tracking-tighter leading-[1.1] drop-shadow-2xl flex flex-col items-center">
              
              <motion.div 
                className="flex flex-wrap justify-center gap-x-4 md:gap-x-6 overflow-hidden py-2"
                style={!isMobile && !shouldReduceMotion ? { x: line1X, y: line1Y, opacity: line1Opacity } : { y: mobileDriftY, opacity: mobileOpacity }}
              >
                {words1.map((word, i) => (
                  <span key={i} className="overflow-hidden inline-block pb-2">
                    <motion.span variants={wordVariants} className="inline-block text-white">
                      {word}
                    </motion.span>
                  </span>
                ))}
              </motion.div>

              <motion.div 
                className="flex flex-wrap justify-center gap-x-4 md:gap-x-6 overflow-hidden py-2 origin-center"
                style={!isMobile && !shouldReduceMotion ? { scale: line2Scale, opacity: line2Opacity } : { y: mobileDriftY, opacity: mobileOpacity }}
              >
                {words2.map((word, i) => (
                  <span key={i} className="overflow-hidden inline-block pb-2">
                    <motion.span variants={wordVariants} className="inline-block text-transparent bg-clip-text bg-gradient-to-r from-brand-cyan to-brand-blue">
                      {word}
                    </motion.span>
                  </span>
                ))}
              </motion.div>

              <motion.div 
                className="flex flex-wrap justify-center gap-x-4 md:gap-x-6 overflow-hidden py-2"
                style={!isMobile && !shouldReduceMotion ? { x: line3X, y: line3Y } : { y: mobileDriftY, opacity: mobileOpacity }}
              >
                {words3.map((word, i) => (
                  <span key={i} className="overflow-hidden inline-block pb-2">
                    <motion.span variants={wordVariants} className="inline-block text-white">
                      {word}
                    </motion.span>
                  </span>
                ))}
              </motion.div>

            </h1>
          </motion.div>
        </div>
        
        {/* Scroll-cue chevron */}
        <motion.div 
          className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/50"
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
