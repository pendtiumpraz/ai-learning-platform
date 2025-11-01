"use client"

import React, { createContext, useContext, useState, useEffect } from 'react'

interface AccessibilityContextType {
  highContrast: boolean
  reducedMotion: boolean
  largeText: boolean
  screenReader: boolean
  keyboardNavigation: boolean
  focusVisible: boolean
  toggleHighContrast: () => void
  toggleReducedMotion: () => void
  toggleLargeText: () => void
  toggleScreenReader: () => void
  toggleKeyboardNavigation: () => void
  toggleFocusVisible: () => void
}

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined)

export function useAccessibility() {
  const context = useContext(AccessibilityContext)
  if (!context) {
    throw new Error('useAccessibility must be used within an AccessibilityProvider')
  }
  return context
}

interface AccessibilityProviderProps {
  children: React.ReactNode
}

export function AccessibilityProvider({ children }: AccessibilityProviderProps) {
  const [highContrast, setHighContrast] = useState(false)
  const [reducedMotion, setReducedMotion] = useState(false)
  const [largeText, setLargeText] = useState(false)
  const [screenReader, setScreenReader] = useState(false)
  const [keyboardNavigation, setKeyboardNavigation] = useState(false)
  const [focusVisible, setFocusVisible] = useState(true)

  // Check for user's system preferences
  useEffect(() => {
    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) {
      setReducedMotion(true)
    }

    // Check for high contrast preference
    const prefersHighContrast = window.matchMedia('(prefers-contrast: high)').matches
    if (prefersHighContrast) {
      setHighContrast(true)
    }

    // Detect keyboard navigation
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Tab') {
        setKeyboardNavigation(true)
      }
    }

    const handleMouseDown = () => {
      setKeyboardNavigation(false)
    }

    document.addEventListener('keydown', handleKeyDown)
    document.addEventListener('mousedown', handleMouseDown)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.removeEventListener('mousedown', handleMouseDown)
    }
  }, [])

  // Apply accessibility classes to document
  useEffect(() => {
    const root = document.documentElement

    if (highContrast) {
      root.classList.add('high-contrast')
    } else {
      root.classList.remove('high-contrast')
    }

    if (reducedMotion) {
      root.classList.add('reduce-motion')
    } else {
      root.classList.remove('reduce-motion')
    }

    if (largeText) {
      root.classList.add('large-text')
    } else {
      root.classList.remove('large-text')
    }

    if (screenReader) {
      root.setAttribute('aria-live', 'polite')
    } else {
      root.removeAttribute('aria-live')
    }

    if (focusVisible) {
      root.classList.add('focus-visible')
    } else {
      root.classList.remove('focus-visible')
    }
  }, [highContrast, reducedMotion, largeText, screenReader, focusVisible])

  const toggleHighContrast = () => setHighContrast(!highContrast)
  const toggleReducedMotion = () => setReducedMotion(!reducedMotion)
  const toggleLargeText = () => setLargeText(!largeText)
  const toggleScreenReader = () => setScreenReader(!screenReader)
  const toggleKeyboardNavigation = () => setKeyboardNavigation(!keyboardNavigation)
  const toggleFocusVisible = () => setFocusVisible(!focusVisible)

  return (
    <AccessibilityContext.Provider
      value={{
        highContrast,
        reducedMotion,
        largeText,
        screenReader,
        keyboardNavigation,
        focusVisible,
        toggleHighContrast,
        toggleReducedMotion,
        toggleLargeText,
        toggleScreenReader,
        toggleKeyboardNavigation,
        toggleFocusVisible,
      }}
    >
      {children}
    </AccessibilityContext.Provider>
  )
}

// Accessibility HOC for components
export function withAccessibility<P extends object>(
  Component: React.ComponentType<P>
) {
  return function AccessibleComponent(props: P) {
    const {
      reducedMotion,
      highContrast,
      largeText,
      keyboardNavigation,
      focusVisible,
    } = useAccessibility()

    const accessibilityProps = {
      'aria-label': 'Interactive element',
      'role': 'button',
      'tabIndex': keyboardNavigation ? 0 : -1,
      'data-reduced-motion': reducedMotion,
      'data-high-contrast': highContrast,
      'data-large-text': largeText,
      'data-keyboard-nav': keyboardNavigation,
      'data-focus-visible': focusVisible,
    }

    return <Component {...props} {...accessibilityProps} />
  }
}

// Skip to main content link for keyboard navigation
export function SkipToMainContent() {
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-purple-600 text-white px-4 py-2 rounded-md z-50 focus:outline-none focus:ring-2 focus:ring-purple-500"
    >
      Skip to main content
    </a>
  )
}

// Screen reader announcements
export function ScreenReaderAnnouncement({ message, priority = 'polite' }: {
  message: string
  priority?: 'polite' | 'assertive'
}) {
  return (
    <div
      aria-live={priority}
      aria-atomic="true"
      className="sr-only"
    >
      {message}
    </div>
  )
}

// Focus trap for modals and dropdowns
export function useFocusTrap(isActive: boolean) {
  useEffect(() => {
    if (!isActive) return

    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return

      const focusableElements = document.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      )

      const firstElement = focusableElements[0] as HTMLElement
      const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          lastElement?.focus()
          e.preventDefault()
        }
      } else {
        if (document.activeElement === lastElement) {
          firstElement?.focus()
          e.preventDefault()
        }
      }
    }

    document.addEventListener('keydown', handleTabKey)
    return () => document.removeEventListener('keydown', handleTabKey)
  }, [isActive])
}

// Keyboard navigation utilities
export function useKeyboardNavigation(
  items: Array<{ id: string; element?: HTMLElement }>,
  onSelect?: (id: string) => void
) {
  const [selectedIndex, setSelectedIndex] = useState(0)

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowDown':
        case 'ArrowRight':
          e.preventDefault()
          setSelectedIndex(prev => (prev + 1) % items.length)
          break
        case 'ArrowUp':
        case 'ArrowLeft':
          e.preventDefault()
          setSelectedIndex(prev => (prev - 1 + items.length) % items.length)
          break
        case 'Enter':
        case ' ':
          e.preventDefault()
          if (items[selectedIndex]) {
            onSelect?.(items[selectedIndex].id)
          }
          break
        case 'Escape':
          e.preventDefault()
          // Handle escape if needed
          break
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [items, selectedIndex, onSelect])

  useEffect(() => {
    if (items[selectedIndex]?.element) {
      items[selectedIndex].element?.focus()
    }
  }, [selectedIndex, items])

  return { selectedIndex, setSelectedIndex }
}