'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'

const NAV_LINKS = [
  { name: 'About Us', href: '#about' },
  { name: 'Services', href: '#services' },
  { name: 'Projects', href: '#projects' },
  { name: 'Contact', href: '#contact' }
]

export function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  // Close mobile menu if window resizes to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMobileMenuOpen(false)
      }
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <>
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 100, damping: 20 }}
        className="fixed top-0 left-0 w-full z-[100] bg-transparent pointer-events-none"
      >
        <div className="max-w-7xl mx-auto px-6 py-2 flex justify-between items-center pointer-events-auto">
          {/* Left Column: Empty on Desktop, Hamburger on Mobile */}
          <div className="w-10">
            <button 
              className="md:hidden text-[#C9CDD6] hover:text-white transition-colors p-2 -ml-2"
              onClick={() => setIsMobileMenuOpen(true)}
              aria-label="Open menu"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="3" y1="12" x2="21" y2="12"></line>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <line x1="3" y1="18" x2="21" y2="18"></line>
              </svg>
            </button>
          </div>

          {/* Mobile Branding: Top Right */}
          <div className="md:hidden flex items-center font-bold text-lg tracking-tight z-[105] whitespace-nowrap shrink-0 pr-2">
            <span className="text-brand-cyan">WebDev</span>
            <span className="text-white ml-1">Solutions</span>
          </div>

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

          {/* Right Column: Call to Action (Hidden on mobile) */}
          <div className="hidden md:flex items-center gap-4">
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
                className="px-5 py-2 text-sm rounded-full bg-[#2563EB] text-white hover:scale-105 transition-transform cursor-pointer"
              >
                Start a Project
              </motion.div>
            </a>
          </div>
        </div>
      </motion.header>

      {/* Mobile Slide-in Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[101] md:hidden"
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 left-0 bottom-0 w-[80vw] max-w-sm bg-[#0A0E1A] border-r border-white/10 z-[102] flex flex-col p-6 md:hidden shadow-2xl"
            >
              <div className="flex justify-between items-center mb-12">
                <span className="font-bold text-white text-xl tracking-tight">Menu</span>
                <button 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-[#C9CDD6] hover:text-white transition-colors p-2 -mr-2"
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>
              </div>

              <nav className="flex flex-col gap-6 flex-1">
                {NAV_LINKS.map((link) => (
                  <a
                    key={link.name}
                    href={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="text-2xl font-bold text-[#C9CDD6] hover:text-white transition-colors"
                  >
                    {link.name}
                  </a>
                ))}
              </nav>

              <div className="flex flex-col gap-6 mt-auto">
                <a 
                  href="#contact"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-full py-4 text-center rounded-full bg-[#2563EB] text-white font-bold hover:bg-blue-500 transition-colors shadow-[0_0_20px_rgba(37,99,235,0.4)]"
                >
                  Start a Project
                </a>
                <Link 
                  href="/admin/login" 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-3 text-[#C9CDD6] hover:text-white transition-colors py-2"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                  <span>Admin Login</span>
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
