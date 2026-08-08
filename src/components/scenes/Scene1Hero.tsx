'use client'

import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import { Shard } from '@/components/ui/Shard'

export function Scene1Hero() {
  const words1 = "We Engineer".split(" ")
  const words2 = "Digital Experiences".split(" ")
  const words3 = "That Scale.".split(" ")

  const containerRef = useRef<HTMLElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  })

  const shouldReduceMotion = useReducedMotion()
  
  // State for canvas frames
  const [images, setImages] = useState<HTMLImageElement[]>([])
  const [isLoaded, setIsLoaded] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  // Determine mobile status
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Preload frames
  useEffect(() => {
    if (shouldReduceMotion) {
      // Just load the first frame for reduced motion
      const img = new Image()
      img.src = '/hero-frames/frame_001.webp'
      img.onload = () => {
        setImages([img])
        setIsLoaded(true)
      }
      return
    }

    const frameCount = 80
    const loadedImages: HTMLImageElement[] = []
    let loadedCount = 0

    // Mobile loads every 3rd frame (27 frames)
    const step = isMobile ? 3 : 1
    const totalToLoad = Math.ceil(frameCount / step)

    for (let i = 1; i <= frameCount; i += step) {
      const img = new Image()
      img.src = `/hero-frames/frame_${i.toString().padStart(3, '0')}.webp`
      img.onload = () => {
        loadedCount++
        if (loadedCount === totalToLoad) {
          setIsLoaded(true)
        }
      }
      // Keep them in order
      const arrayIndex = Math.floor((i - 1) / step)
      loadedImages[arrayIndex] = img
    }
    
    setImages(loadedImages)
  }, [isMobile, shouldReduceMotion])

  // Canvas scrub rendering
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || !isLoaded || images.length === 0) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let renderFrameId: number

    const render = () => {
      const dpr = window.devicePixelRatio || 1
      const rect = canvas.getBoundingClientRect()
      
      canvas.width = rect.width * dpr
      canvas.height = rect.height * dpr
      ctx.scale(dpr, dpr)

      // Get frame index
      const progress = scrollYProgress.get()
      let index = Math.round(progress * (images.length - 1))
      
      // Safety check
      if (index >= images.length) index = images.length - 1
      if (index < 0) index = 0

      const img = images[index]
      if (img) {
        // Draw image covering canvas (object-fit: cover equivalent)
        const imgRatio = img.width / img.height
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
        
        // Add dark overlay via global alpha or just drawing rect
        ctx.globalAlpha = 0.35 // 35% opacity as specified
        ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight)
      }
    }

    // Initial render
    render()

    // Render on scroll using framer motion's onChange
    const unsubscribe = scrollYProgress.onChange(() => {
      if (renderFrameId) cancelAnimationFrame(renderFrameId)
      renderFrameId = requestAnimationFrame(render)
    })

    const handleResize = () => {
      if (renderFrameId) cancelAnimationFrame(renderFrameId)
      renderFrameId = requestAnimationFrame(render)
    }
    window.addEventListener('resize', handleResize)

    return () => {
      unsubscribe()
      window.removeEventListener('resize', handleResize)
      if (renderFrameId) cancelAnimationFrame(renderFrameId)
    }
  }, [images, isLoaded, scrollYProgress])

  // Headline divergences
  // Line 1: drifts left+up
  const line1X = useTransform(scrollYProgress, [0, 1], ["0%", "-50%"])
  const line1Y = useTransform(scrollYProgress, [0, 1], ["0%", "-100%"])
  const line1Opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])
  
  // Line 2: scales toward camera and fades
  const line2Scale = useTransform(scrollYProgress, [0, 1], [1, 3])
  const line2Opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])

  // Line 3: drifts right+down, then hands off to Tension
  const line3X = useTransform(scrollYProgress, [0, 1], ["0%", "20%"])
  const line3Y = useTransform(scrollYProgress, [0, 1], ["0%", "150%"])
  
  // Mobile divergence simplification: just drift up
  const mobileDriftY = useTransform(scrollYProgress, [0, 1], ["0%", "-100%"])
  const mobileOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])

  // Shard 1 positioning (mouse parallax + scroll drift)
  const shard1Y = useTransform(scrollYProgress, [0, 1], [0, 300])

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
    <section ref={containerRef} className="relative h-screen w-full flex items-center justify-center overflow-hidden bg-[#0A0E1A]">
      
      {/* Scroll-scrubbed Canvas */}
      <canvas 
        ref={canvasRef}
        className="absolute inset-0 z-0 w-full h-full"
      />
      
      {/* Loading Fallback */}
      {!isLoaded && (
        <div className="absolute inset-0 z-0 bg-gradient-to-b from-[#0A0E1A] to-[#1E40AF]/20 opacity-30" />
      )}

      {/* Shard 1 */}
      {!shouldReduceMotion && (
        <motion.div 
          className="absolute left-[15%] top-[20%] z-0"
          style={{ y: shard1Y }}
        >
          <Shard shardId={1} className="w-24 h-24 opacity-60" />
        </motion.div>
      )}

      {/* Center: Kinetic Text Content */}
      <motion.div 
        initial="hidden"
        animate="visible"
        transition={{ staggerChildren: 0.1, delayChildren: 0.2 }}
        className="z-10 w-full flex flex-col items-center justify-center px-4 pointer-events-none"
      >
        <h1 className="text-5xl md:text-7xl lg:text-9xl font-bold text-center tracking-tighter leading-[1.1] drop-shadow-2xl flex flex-col items-center">
          
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
      
      {/* Scroll-cue chevron */}
      <motion.div 
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 text-white/50"
        style={{ opacity: useTransform(scrollYProgress, [0, 0.1], [1, 0]) }}
        animate={{ y: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="6 9 12 15 18 9"></polyline>
        </svg>
      </motion.div>
    </section>
  )
}
