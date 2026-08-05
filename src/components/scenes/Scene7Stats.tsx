'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { useEffect, useState } from 'react'

const stats = [
  { label: "Projects Delivered", target: 25, suffix: "+" },
  { label: "Awards Won", target: 12, suffix: "" },
  { label: "Years Experience", target: 10, suffix: "+" },
  { label: "Client Satisfaction", target: 99, suffix: "%" },
]

function Counter({ target, suffix }: { target: number, suffix: string }) {
  const [count, setCount] = useState(0)
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  useEffect(() => {
    if (isInView) {
      let start = 0
      const end = target
      const duration = 2000 // ms
      const increment = end / (duration / 16)
      
      const timer = setInterval(() => {
        start += increment
        if (start >= end) {
          setCount(end)
          clearInterval(timer)
        } else {
          setCount(Math.ceil(start))
        }
      }, 16)
      return () => clearInterval(timer)
    }
  }, [isInView, target])

  return <span ref={ref}>{count}{suffix}</span>
}

export function Scene7Stats() {
  return (
    <section className="py-24 bg-brand-navy border-y border-white/5">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 text-center">
          {stats.map((stat, idx) => (
            <div key={idx} className="flex flex-col gap-2">
              <h4 className="text-5xl md:text-6xl font-black text-brand-cyan mb-2 drop-shadow-[0_0_15px_rgba(34,211,238,0.3)]">
                <Counter target={stat.target} suffix={stat.suffix} />
              </h4>
              <p className="text-brand-silver font-medium text-sm md:text-base uppercase tracking-wider">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
