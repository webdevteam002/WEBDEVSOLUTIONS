'use client'

import { ReactLenis, useLenis } from '@studio-freight/react-lenis'
import { ReactNode, useEffect, useRef } from 'react'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'

export function SmoothScrollProvider({ children }: { children: ReactNode }) {
  const lenisRef = useRef<any>(null)

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)
    
    if (typeof window !== 'undefined') {
      (window as any).ScrollTrigger = ScrollTrigger
    }
    
    const update = (time: number) => {
      lenisRef.current?.lenis?.raf(time * 1000)
    }

    gsap.ticker.add(update)
    gsap.ticker.lagSmoothing(0)

    return () => {
      gsap.ticker.remove(update)
    }
  }, [])

  return (
    <ReactLenis root ref={lenisRef} autoRaf={false} options={{ lerp: 0.05, duration: 1.5, smoothWheel: true }}>
      {children as any}
    </ReactLenis>
  )
}
