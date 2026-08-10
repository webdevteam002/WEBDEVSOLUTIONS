'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { Menu, X } from 'lucide-react'

const NAV_LINKS = [
  { name: 'About Us', href: '#about' },
  { name: 'Services', href: '#services' },
  { name: 'Projects', href: '#projects' },
  { name: 'Contact', href: '#contact' }
]

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 100, damping: 20 }}
        className="fixed top-0 left-0 w-full z-[100] bg-transparent"
      >
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          {/* Left Column: Mobile Menu Toggle */}
          <div className="w-10 md:hidden z-[110]">
            <button onClick={() => setIsOpen(!isOpen)} className="text-white p-2">
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
          <div className="w-10 hidden md:block"></div>

          {/* Center Column: Anchor Links */}
          <nav className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map((link) => (
              <motion.a
                key={link.name}
                href={link.href}
                whileHover={{ textShadow: "0px 0px 8px rgba(34, 211, 238, 0.8)" }}
                className="text-sm text-[#C9CDD6] hover:text-white transition-colors relative group"
              >
                {link.name}
                <motion.div 
                  className="absolute -bottom-1 left-0 w-0 h-[2px] bg-brand-cyan transition-all duration-300 group-hover:w-full"
                />
              </motion.a>
            ))}
          </nav>

          {/* Right Column: Call to Action */}
          <div className="flex items-center gap-4 z-[110]">
            <Link href="/admin/login" aria-label="Admin Login">
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="text-[#C9CDD6] hover:text-white transition-colors"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              </motion.div>
            </Link>
            <a href="#contact">
              <motion.div
                whileHover={{ boxShadow: "0px 0px 15px rgba(34, 211, 238, 0.5)" }}
                whileTap={{ scale: 0.95 }}
                className="px-4 py-2 md:px-5 md:py-2 text-xs md:text-sm rounded-full bg-[#2563EB] text-white hover:scale-105 transition-transform cursor-pointer"
              >
                Start a Project
              </motion.div>
            </a>
          </div>
        </div>
      </motion.header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-[90] bg-[#0A0E1A]/95 backdrop-blur-xl flex flex-col items-center justify-center pt-20 pb-10"
          >
            <nav className="flex flex-col items-center gap-8">
              {NAV_LINKS.map((link, idx) => (
                <motion.a
                  key={link.name}
                  href={link.href}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  onClick={() => setIsOpen(false)}
                  className="text-3xl font-bold text-white hover:text-brand-cyan transition-colors"
                >
                  {link.name}
                </motion.a>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
