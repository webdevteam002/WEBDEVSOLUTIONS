'use client'

import React, { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import Image from 'next/image'

// Disable SSR for GSAP to avoid hydration mismatches
const PortfolioGSAP = dynamic(() => import('./PortfolioGSAP'), { ssr: false })

export interface ProjectData {
  id: string;
  title: string;
  category: string;
  description: string;
  tech: string[];
  link?: string | null;
  imageFallback?: string;
}

export function Scene6Portfolio({ projects }: { projects: ProjectData[] }) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return <PortfolioGSAP projects={projects} />
}
