"use client"

import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import {
  Menu,
  X,
  Brain,
  Gamepad2,
} from 'lucide-react'

export default function LandingNavbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navLinks = [
    { label: 'Features', href: '#features' },
    { label: 'Games', href: '/games', isExternal: true },
    { label: 'Pricing', href: '#pricing' },
    { label: 'Contact', href: '#contact' },
    { label: 'About', href: '#about' },
  ]

  const scrollToSection = (href: string, isExternal = false) => {
    if (isExternal) {
      window.location.href = href
      setIsMobileMenuOpen(false)
      return
    }

    const element = document.querySelector(href)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
    setIsMobileMenuOpen(false)
  }

  return (
    <>
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/95 dark:bg-gray-900/95 backdrop-blur-md shadow-lg border-b border-gray-200/20 dark:border-gray-800/20'
          : 'bg-transparent'
      }`}>
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center space-x-2 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                AI Learning Platform
              </span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {navLinks.map((link) => (
                <button
                  key={link.label}
                  onClick={() => scrollToSection(link.href, link.isExternal)}
                  className={`text-sm font-medium transition-colors hover:text-blue-600 dark:hover:text-blue-400 flex items-center gap-1 ${
                    isScrolled ? 'text-gray-900 dark:text-gray-100' : 'text-gray-700 dark:text-gray-200'
                  }`}
                >
                  {link.label}
                  {link.label === 'Games' && <Gamepad2 className="w-4 h-4" />}
                </button>
              ))}
            </div>

            {/* Desktop CTA Buttons */}
            <div className="hidden md:flex items-center space-x-4">
              <Button
                variant="outline"
                onClick={() => scrollToSection('#pricing')}
                className="border-gray-300 dark:border-gray-600"
              >
                Pricing
              </Button>
              <Button
                onClick={() => window.location.href = '/auth'}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                Get Started Free
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
            <div className="container mx-auto px-4 py-4">
              <div className="flex flex-col space-y-3">
                {navLinks.map((link) => (
                  <button
                    key={link.label}
                    onClick={() => scrollToSection(link.href, link.isExternal)}
                    className="text-left py-2 text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center gap-2"
                  >
                    {link.label}
                    {link.label === 'Games' && <Gamepad2 className="w-4 h-4" />}
                  </button>
                ))}
                <div className="flex flex-col space-y-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                  <Button
                    variant="outline"
                    onClick={() => scrollToSection('#pricing')}
                    className="w-full border-gray-300 dark:border-gray-600"
                  >
                    View Pricing
                  </Button>
                  <Button
                    onClick={() => window.location.href = '/auth'}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  >
                    Get Started Free
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </nav>
    </>
  )
}