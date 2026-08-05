'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'

export function Scene9CTA() {
  return (
    <section id="contact" className="relative h-screen w-full flex items-center justify-center bg-brand-navy overflow-hidden">
      {/* PNG Logo Background */}
      <motion.div
        initial={{ y: 0 }}
        animate={{ y: -15 }}
        transition={{ type: "spring", stiffness: 100, damping: 20, repeat: Infinity, repeatType: "reverse" }}
        className="absolute inset-0 flex items-center justify-center opacity-20 pointer-events-none scale-150"
      >
        <div className="relative w-[300px] h-[300px] md:w-[600px] md:h-[600px]">
          <Image 
            src="/logo.png" 
            alt="WebDev Solutions" 
            fill 
            className="object-contain drop-shadow-[0_0_30px_rgba(34,211,238,0.5)]" 
          />
        </div>
      </motion.div>

      <div className="z-10 max-w-2xl text-center px-4">
        <h2 className="text-5xl md:text-7xl font-bold mb-8 text-white drop-shadow-xl">
          Let's Build Something That <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-cyan to-brand-blue">Scales</span>
        </h2>
        <p className="text-xl text-brand-silver mb-12">
          Ready to transform your digital presence? We're taking on new projects for Q3.
        </p>
        
        <div className="flex flex-col gap-4 max-w-md mx-auto relative glass-panel p-6 rounded-2xl border border-white/10">
          <input 
            type="email" 
            placeholder="Your email address" 
            className="w-full bg-black/40 border border-white/10 rounded-xl px-6 py-4 text-white focus:outline-none focus:border-brand-cyan transition-colors"
          />
          <a 
            href="mailto:webdev.team002@gmail.com?subject=Project%20Inquiry%20-%20WebDev%20Solutions&body=Hello%20WebDev%20Solutions%20team%2C%0D%0A%0D%0AI%20am%20interested%20in%20your%20development%20services%20and%20would%20like%20to%20discuss%20a%20potential%20project.%0D%0A%0D%0AProject%20Type%20%28e.g.%2C%20Custom%20Web%20App%2C%20SaaS%2C%20E-Commerce%29%3A%20%0D%0ABudget%20Range%3A%20%0D%0ATimeline%3A%20%0D%0A%0D%0ABrief%20Description%3A%0D%0A%0D%0A%0D%0AThanks%2C%0D%0A%5BYour%20Name%5D"
            className="w-full text-center block bg-brand-blue hover:bg-brand-cyan text-white font-bold py-4 rounded-xl transition-colors shadow-[0_0_20px_rgba(37,99,235,0.4)] hover:shadow-[0_0_30px_rgba(34,211,238,0.6)]"
          >
            Get In Touch
          </a>
        </div>
      </div>
    </section>
  )
}
