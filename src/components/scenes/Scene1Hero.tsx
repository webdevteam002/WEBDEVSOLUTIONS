'use client'

import { motion, useScroll, useTransform, useMotionValueEvent } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'

export function Scene1Hero() {

  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  })
  
  const frameCount = 480
  // Store loaded images in a ref so we don't need to trigger re-renders
  const imagesRef = useRef<(HTMLImageElement | null)[]>(new Array(frameCount).fill(null))
  const [isFirstFrameLoaded, setIsFirstFrameLoaded] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const lastDrawnIndex = useRef(-1)
  const currentTargetIndex = useRef(0)

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Draw a specific frame to the canvas
  const drawFrame = (index: number) => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    
    // Find the closest loaded frame (could be before or after the target index)
    let closestFrame = -1
    let minDistance = Infinity
    for (let i = 0; i < frameCount; i++) {
      if (imagesRef.current[i]) {
        const dist = Math.abs(i - index)
        if (dist < minDistance) {
          minDistance = dist
          closestFrame = i
        }
      }
    }
    
    if (closestFrame >= 0 && imagesRef.current[closestFrame]) {
      const img = imagesRef.current[closestFrame]!
      
      if (lastDrawnIndex.current !== closestFrame) {
        // Set canvas dimensions to match image if not already set
        if (canvas.width !== img.width || canvas.height !== img.height) {
          canvas.width = img.width
          canvas.height = img.height
        }
        
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
        lastDrawnIndex.current = closestFrame
      }
    }
  }

  // Preload frames using Progressive Stride Loading
  useEffect(() => {
    let isCancelled = false

    // Load first frame immediately
    const img0 = new Image()
    img0.src = `/hero-frames/frame_0001.webp`
    img0.onload = () => {
      if (isCancelled) return
      imagesRef.current[0] = img0
      setIsFirstFrameLoaded(true)
      setTimeout(() => drawFrame(currentTargetIndex.current), 0)
      
      // Compute loading order for interlaced effect
      const loadOrder: number[] = []
      
      const isMobileDevice = window.innerWidth < 768
      const mobileStride = Math.floor(frameCount / 80) // 6
      const strides = isMobileDevice 
        ? [mobileStride * 4, mobileStride * 2, mobileStride]
        : [16, 8, 4, 2, 1]
      
      for (const stride of strides) {
        for (let i = 1; i < frameCount; i += stride) {
          if (!loadOrder.includes(i)) {
            loadOrder.push(i)
          }
        }
      }

      // Load frames progressively in the computed order
      let currentOrderIndex = 0
      
      const loadNextBatch = () => {
        if (isCancelled || currentOrderIndex >= loadOrder.length) return
        
        // We load in small concurrent batches so we don't block the browser entirely
        const batchSize = 6
        let loadedInBatch = 0
        let toLoad = Math.min(batchSize, loadOrder.length - currentOrderIndex)
        
        for (let b = 0; b < toLoad; b++) {
          const frameIndex = loadOrder[currentOrderIndex++]
          const img = new Image()
          img.src = `/hero-frames/frame_${(frameIndex + 1).toString().padStart(4, '0')}.webp`
          
          const onComplete = () => {
            if (isCancelled) return
            loadedInBatch++
            if (loadedInBatch === toLoad) {
              loadNextBatch()
            }
          }
          
          img.onload = () => {
            if (isCancelled) return
            imagesRef.current[frameIndex] = img
            // Redraw if this newly loaded frame is closer to the user's current scroll position
            const currentTarget = currentTargetIndex.current
            const distToNew = Math.abs(frameIndex - currentTarget)
            const distToCurrent = Math.abs(lastDrawnIndex.current - currentTarget)
            if (distToNew < distToCurrent) {
               drawFrame(currentTarget)
            }
            onComplete()
          }
          
          img.onerror = onComplete
        }
      }

      loadNextBatch()
    }

    return () => {
      isCancelled = true
    }
  }, [])

  // Scroll-scrub: useMotionValueEvent to map scroll progress to frame index
  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    if (!isFirstFrameLoaded) return
    const frameIndex = Math.min(frameCount - 1, Math.max(0, Math.round(latest * (frameCount - 1))))
    
    if (frameIndex !== currentTargetIndex.current) {
      currentTargetIndex.current = frameIndex
      // Use requestAnimationFrame for smoother rendering
      requestAnimationFrame(() => drawFrame(frameIndex))
    }
  })

  const chevronOpacity = useTransform(scrollYProgress, [0, 0.1], [1, 0])
  return (
    <div ref={containerRef} className="relative w-full h-[400vh] shrink-0">
      {/* Sticky container that stays on screen during the 400vh scroll */}
      <div className="sticky top-0 left-0 w-full h-screen flex flex-col md:flex-row items-center z-0 overflow-hidden bg-[#0A0E1A]">
        
        {/* Left Column: Text (Visible above the background) */}
        <div className="w-full md:w-1/2 h-full flex flex-col justify-center px-6 md:pl-32 z-20 pt-16 md:pt-0 pointer-events-auto">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="text-4xl md:text-6xl font-bold text-white mb-10 md:mb-6 leading-tight drop-shadow-lg"
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
            className="text-lg text-[#C9CDD6] mb-12 md:mb-8 max-w-lg"
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
          {/* Fallback gradient shown until first frame loads */}
          {!isFirstFrameLoaded && (
            <div className="absolute inset-0 w-full h-full bg-gradient-to-b from-[#0A0E1A] to-[#1E40AF]/20" />
          )}
          {/* Canvas for 60fps hardware accelerated rendering */}
          <canvas 
            ref={canvasRef}
            className={`w-full h-full object-contain object-top md:object-cover md:object-[center_15%] mix-blend-screen transition-opacity duration-500 ${isFirstFrameLoaded ? 'opacity-60 md:opacity-100' : 'opacity-0'}`}
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

