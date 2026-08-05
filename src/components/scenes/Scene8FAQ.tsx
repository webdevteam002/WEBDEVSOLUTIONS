'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown } from 'lucide-react'

const faqs = [
  { q: "What services do you offer?", a: "We offer full-cycle custom web and mobile app development, SaaS platforms, AI integrations, desktop applications, and high-performance e-commerce solutions." },
  { q: "How much does a custom app cost?", a: "Costs vary based on complexity, features, and timeline. Our projects typically start at $10k. We provide a detailed architectural roadmap and fixed-price quote during the Discovery phase." },
  { q: "Do you build SaaS platforms?", a: "Yes, SaaS is our specialty. We build scalable, multi-tenant architectures with integrated billing (Stripe), real-time dashboards, and robust role-based access control." },
  { q: "How long does it take?", a: "A standard web application takes 8-12 weeks from kickoff to launch. More complex AI or desktop applications may take 3-6 months. We work in 2-week agile sprints to deliver continuous value." },
  { q: "Do you provide ongoing support?", a: "Absolutely. We offer retainer-based technical partnerships to handle maintenance, monitoring, security updates, and feature scaling post-launch." },
]

export function Scene8FAQ() {
  const [openIdx, setOpenIdx] = useState<number | null>(0)

  return (
    <section className="py-32 bg-black">
      <div className="max-w-3xl mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-16">Frequently Asked Questions</h2>
        
        <div className="flex flex-col gap-4">
          {faqs.map((faq, idx) => (
            <div key={idx} className="glass-panel rounded-2xl overflow-hidden">
              <button 
                onClick={() => setOpenIdx(openIdx === idx ? null : idx)}
                className="w-full flex items-center justify-between p-6 text-left"
              >
                <span className="font-medium text-lg">{faq.q}</span>
                <motion.div
                  animate={{ rotate: openIdx === idx ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <ChevronDown className="w-5 h-5 text-brand-cyan" />
                </motion.div>
              </button>
              <AnimatePresence>
                {openIdx === idx && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                  >
                    <div className="p-6 pt-0 text-brand-silver">
                      {faq.a}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
