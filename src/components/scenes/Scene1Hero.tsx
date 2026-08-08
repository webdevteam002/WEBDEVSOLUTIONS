'use client'

import { motion, useScroll, useTransform, useReducedMotion, useMotionValueEvent } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import { Shard } from '@/components/ui/Shard'

export function Scene1Hero() {

  const containerRef = useRef<HTMLDivElement>(null)
  const imgRef = useRef<HTMLImageElement>(null)
  
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
    const frameIndex = Math.min(191, Math.max(0, Math.round(latest * 191)))

    if (frameIndex !== lastDrawnIndex.current) {
      lastDrawnIndex.current = frameIndex
      imgRef.current.src = images[frameIndex].src
    }
  })

  const shard1Y = useTransform(scrollYProgress, [0, 1], [0, 300])
  const chevronOpacity = useTransform(scrollYProgress, [0, 0.1], [1, 0])
  return (
    <div ref={containerRef} className="relative w-full h-[400vh]">
      {/* Native img tag for perfect object-fit cover and native hardware acceleration */}
      <img 
        ref={imgRef}
        className="sticky top-0 left-0 w-full h-screen object-cover object-[center_15%] z-0"
        alt="Cinematic Scroll Sequence"
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
