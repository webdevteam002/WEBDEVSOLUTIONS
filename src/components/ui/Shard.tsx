'use client'

import { motion, SVGMotionProps } from 'framer-motion'

export type ShardId = 1 | 2 | 3 | 4 | 5 | 6

interface ShardProps extends SVGMotionProps<SVGSVGElement> {
  shardId: ShardId
  className?: string
}

export const ShardDefs = () => (
  <defs>
    <linearGradient id="glassBlue" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stopColor="#60A5FA" stopOpacity="0.9" />
      <stop offset="100%" stopColor="#1E40AF" stopOpacity="0.9" />
    </linearGradient>
    <linearGradient id="glassCyan" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stopColor="#22D3EE" stopOpacity="0.9" />
      <stop offset="100%" stopColor="#0369A1" stopOpacity="0.9" />
    </linearGradient>
    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="2" result="blur" />
      <feComposite in="SourceGraphic" in2="blur" operator="over" />
    </filter>
  </defs>
)

export function Shard({ shardId, className, ...props }: ShardProps) {
  // Using the paths from AnimatedLogo.tsx, centered inside a 40x40 or generic viewbox
  // Original coordinates were within a 200x200 canvas.
  // We'll define paths relative to their own center to make them easy to place.

  const renderPath = () => {
    switch (shardId) {
      case 1: // Top Left
        return <path d="M 0,-15 L 40,-15 L 20,15 L -20,15 Z" fill="url(#glassBlue)" stroke="#60A5FA" strokeWidth="1" filter="url(#glow)" />
      case 2: // Center (polygon)
        return <polygon points="0,-20 40,20 0,60 -40,20" fill="url(#glassBlue)" stroke="#60A5FA" strokeWidth="1" filter="url(#glow)" />
      case 3: // Bottom Left
        return <path d="M 0,15 L 40,15 L 20,-15 L -20,-15 Z" fill="url(#glassBlue)" stroke="#60A5FA" strokeWidth="1" filter="url(#glow)" />
      case 4: // Top Right
        return <path d="M -20,15 L 20,15 L 0,-15 L -40,-15 Z" fill="url(#glassCyan)" stroke="#22D3EE" strokeWidth="1" filter="url(#glow)" />
      case 5: // Bottom Right
        return <path d="M -20,-15 L 20,-15 L 0,15 L -40,15 Z" fill="url(#glassCyan)" stroke="#22D3EE" strokeWidth="1" filter="url(#glow)" />
      case 6: // The Pixels (treated as 6th shard for convergence)
        return (
          <g>
            <rect x="-10" y="-10" width="8" height="8" fill="url(#glassBlue)" stroke="#60A5FA" strokeWidth="0.5" filter="url(#glow)"/>
            <rect x="5" y="-20" width="12" height="12" fill="url(#glassBlue)" stroke="#60A5FA" strokeWidth="0.5" filter="url(#glow)"/>
            <rect x="-5" y="10" width="10" height="10" fill="url(#glassCyan)" stroke="#22D3EE" strokeWidth="0.5" filter="url(#glow)"/>
            <rect x="10" y="0" width="8" height="8" fill="url(#glassCyan)" stroke="#22D3EE" strokeWidth="0.5" filter="url(#glow)"/>
          </g>
        )
    }
  }

  return (
    <motion.svg 
      viewBox="-50 -50 100 100" 
      className={`overflow-visible drop-shadow-2xl ${className || ''}`}
      {...props}
    >
      <ShardDefs />
      {renderPath()}
    </motion.svg>
  )
}
