'use client'

import { motion, Variants } from 'framer-motion'

export function Scene1Hero() {
  const words1 = "We Engineer".split(" ")
  const words2 = "Digital Experiences".split(" ")
  const words3 = "That Scale.".split(" ")

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  }

  const wordVariants: Variants = {
    hidden: { y: "120%", rotate: 5, opacity: 0 },
    visible: { 
      y: "0%", 
      rotate: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100, damping: 20 }
    }
  }

  return (
    <section className="relative h-screen w-full flex items-center justify-center overflow-hidden bg-transparent">
      
      {/* Center: Kinetic Text Content */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="z-10 w-full flex flex-col items-center justify-center px-4 pointer-events-none"
      >
        <h1 className="text-5xl md:text-7xl lg:text-9xl font-bold text-center tracking-tighter leading-[1.1] drop-shadow-2xl flex flex-col items-center">
          
          <div className="flex flex-wrap justify-center gap-x-4 md:gap-x-6 overflow-hidden py-2">
            {words1.map((word, i) => (
              <span key={i} className="overflow-hidden inline-block pb-2">
                <motion.span variants={wordVariants} className="inline-block text-white">
                  {word}
                </motion.span>
              </span>
            ))}
          </div>

          <div className="flex flex-wrap justify-center gap-x-4 md:gap-x-6 overflow-hidden py-2">
            {words2.map((word, i) => (
              <span key={i} className="overflow-hidden inline-block pb-2">
                <motion.span variants={wordVariants} className="inline-block text-transparent bg-clip-text bg-gradient-to-r from-brand-cyan to-brand-blue">
                  {word}
                </motion.span>
              </span>
            ))}
          </div>

          <div className="flex flex-wrap justify-center gap-x-4 md:gap-x-6 overflow-hidden py-2">
            {words3.map((word, i) => (
              <span key={i} className="overflow-hidden inline-block pb-2">
                <motion.span variants={wordVariants} className="inline-block text-white">
                  {word}
                </motion.span>
              </span>
            ))}
          </div>

        </h1>
      </motion.div>
    </section>
  )
}
