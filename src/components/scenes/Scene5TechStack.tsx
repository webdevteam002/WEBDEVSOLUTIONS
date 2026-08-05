'use client'

import { motion } from 'framer-motion'

const techs = [
  "Next.js", "React", "TypeScript", "Tailwind CSS", 
  "Framer Motion", "Three.js", "WebGL", "Node.js", 
  "PostgreSQL", "Sanity.io", "AWS", "Vercel"
]

export function Scene5TechStack() {
  return (
    <section className="py-24 bg-brand-navy overflow-hidden flex flex-col justify-center border-y border-white/5">
      <div className="flex whitespace-nowrap">
        <motion.div
          className="flex gap-16 px-8"
          animate={{ x: ["0%", "-50%"] }}
          transition={{ repeat: Infinity, ease: "linear", duration: 20 }}
        >
          {/* Double array to create seamless loop */}
          {[...techs, ...techs].map((tech, idx) => (
            <span 
              key={idx} 
              className="text-4xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-br from-white/10 to-white/30"
            >
              {tech}
            </span>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
