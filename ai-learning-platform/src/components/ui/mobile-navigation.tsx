"use client"

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Home,
  BookOpen,
  Trophy,
  Users,
  User,
  Settings,
  Bell,
  Menu,
  X,
  Flame,
  Zap,
  Star
} from 'lucide-react'

interface MobileNavigationProps {
  currentView: string
  onViewChange: (view: string) => void
  notifications: number
  userXP: number
  userStreak: number
  userLevel: number
}

export function MobileNavigation({
  currentView,
  onViewChange,
  notifications,
  userXP,
  userStreak,
  userLevel
}: MobileNavigationProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const navigationItems = [
    { id: 'overview', label: 'Home', icon: <Home className="h-5 w-5" /> },
    { id: 'learning', label: 'Learn', icon: <BookOpen className="h-5 w-5" /> },
    { id: 'achievements', label: 'Achievements', icon: <Trophy className="h-5 w-5" /> },
    { id: 'leaderboard', label: 'Rankings', icon: <Users className="h-5 w-5" /> },
    { id: 'profile', label: 'Profile', icon: <User className="h-5 w-5" /> }
  ]

  const slideVariants = {
    hidden: { x: "-100%" },
    visible: { x: 0 },
    exit: { x: "-100%" }
  }

  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 }
  }

  return (
    <>
      {/* Mobile Header */}
      <div className="lg:hidden sticky top-0 z-50 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center space-x-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMenuOpen(true)}
              className="lg:hidden"
            >
              <Menu className="h-6 w-6" />
            </Button>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">AI</span>
              </div>
              <span className="font-bold text-lg">Learn AI</span>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {/* User Stats */}
            <div className="flex items-center space-x-2 mr-2">
              <Badge variant="level" size="sm" className="flex items-center space-x-1">
                <Star className="h-3 w-3" />
                <span className="text-xs">{userLevel}</span>
              </Badge>
              <Badge variant="warning" size="sm" className="flex items-center space-x-1">
                <Flame className="h-3 w-3" />
                <span className="text-xs">{userStreak}</span>
              </Badge>
            </div>

            {/* Notifications */}
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              {notifications > 0 && (
                <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  {notifications > 9 ? '9+' : notifications}
                </span>
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Side Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            <motion.div
              variants={overlayVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="fixed inset-0 bg-black/50 z-40 lg:hidden"
              onClick={() => setIsMenuOpen(false)}
            />

            <motion.div
              variants={slideVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              transition={{ type: "tween", duration: 0.3 }}
              className="fixed top-0 left-0 h-full w-80 bg-white dark:bg-gray-900 shadow-2xl z-50 lg:hidden"
            >
              {/* Menu Header */}
              <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold">AI</span>
                  </div>
                  <div>
                    <h2 className="font-bold text-lg">AI Learning</h2>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Menu</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <X className="h-6 w-6" />
                </Button>
              </div>

              {/* User Profile Section */}
              <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center">
                    <User className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100">Player</h3>
                    <div className="flex items-center space-x-2 mt-1">
                      <Badge variant="level" size="sm">Level {userLevel}</Badge>
                      <Badge variant="warning" size="sm">
                        <Flame className="h-3 w-3 mr-1" />
                        {userStreak} days
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* XP Progress */}
                <div className="mt-3">
                  <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400 mb-1">
                    <span>Progress</span>
                    <span>{userXP} XP</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-purple-600 to-pink-600 h-2 rounded-full"
                      style={{ width: '65%' }}
                    />
                  </div>
                </div>
              </div>

              {/* Navigation Items */}
              <nav className="flex-1 p-4">
                <div className="space-y-2">
                  {navigationItems.map((item) => (
                    <Button
                      key={item.id}
                      variant={currentView === item.id ? "default" : "ghost"}
                      className="w-full justify-start space-x-3 h-12"
                      onClick={() => {
                        onViewChange(item.id)
                        setIsMenuOpen(false)
                      }}
                    >
                      {item.icon}
                      <span>{item.label}</span>
                    </Button>
                  ))}
                </div>

                <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
                  <Button
                    variant="ghost"
                    className="w-full justify-start space-x-3 h-12"
                  >
                    <Settings className="h-5 w-5" />
                    <span>Settings</span>
                  </Button>
                </div>
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Bottom Navigation Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 z-30">
        <div className="grid grid-cols-5 gap-1">
          {navigationItems.map((item) => (
            <Button
              key={item.id}
              variant={currentView === item.id ? "default" : "ghost"}
              className="flex-col space-y-1 h-16 rounded-none"
              onClick={() => onViewChange(item.id)}
            >
              <div className="relative">
                {item.icon}
                {item.id === 'achievements' && notifications > 0 && (
                  <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full" />
                )}
              </div>
              <span className="text-xs">{item.label}</span>
            </Button>
          ))}
        </div>
      </div>

      {/* Add bottom padding for mobile to account for fixed navigation */}
      <div className="lg:hidden h-16" />
    </>
  )
}