"use client"

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Sparkles, Star, Zap } from 'lucide-react'
import { getXPProgress, formatXP } from '@/lib/utils'

interface XPBarProps {
  currentXP: number
  showDetails?: boolean
  animated?: boolean
  compact?: boolean
  onLevelUp?: (newLevel: number) => void
}

export function XPBar({
  currentXP,
  showDetails = true,
  animated = true,
  compact = false,
  onLevelUp
}: XPBarProps) {
  const [previousLevel, setPreviousLevel] = useState(0)
  const [showLevelUpAnimation, setShowLevelUpAnimation] = useState(false)
  const [displayXP, setDisplayXP] = useState(currentXP)

  const xpProgress = getXPProgress(displayXP)

  useEffect(() => {
    if (animated) {
      const timer = setTimeout(() => {
        setDisplayXP(currentXP)
      }, 100)
      return () => clearTimeout(timer)
    } else {
      setDisplayXP(currentXP)
    }
  }, [currentXP, animated])

  useEffect(() => {
    if (xpProgress.currentLevel > previousLevel && previousLevel > 0) {
      setShowLevelUpAnimation(true)
      onLevelUp?.(xpProgress.currentLevel)

      setTimeout(() => {
        setShowLevelUpAnimation(false)
      }, 3000)
    }
    setPreviousLevel(xpProgress.currentLevel)
  }, [xpProgress.currentLevel, previousLevel, onLevelUp])

  if (compact) {
    return (
      <div className="flex items-center space-x-2">
        <Badge variant="level" size="sm" className="flex items-center space-x-1">
          <Star className="h-3 w-3" />
          <span>Lvl {xpProgress.currentLevel}</span>
        </Badge>
        <div className="flex-1">
          <Progress
            value={xpProgress.progress}
            variant="xp"
            size="sm"
            animated={animated ? "pulse" : "none"}
          />
        </div>
        <span className="text-xs text-gray-500 dark:text-gray-400 min-w-[40px] text-right">
          {Math.round(xpProgress.progress)}%
        </span>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {/* Level Up Animation */}
      <AnimatePresence>
        {showLevelUpAnimation && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.8 }}
            className="flex items-center justify-center space-x-2 bg-gradient-to-r from-yellow-100 to-amber-100 dark:from-yellow-900 dark:to-amber-900 rounded-xl p-4 border-2 border-yellow-300 dark:border-yellow-700"
          >
            <div className="flex items-center space-x-2">
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              >
                <Star className="h-8 w-8 text-yellow-500 fill-yellow-500" />
              </motion.div>
              <div className="text-center">
                <h3 className="text-xl font-bold text-yellow-800 dark:text-yellow-200">
                  LEVEL UP!
                </h3>
                <p className="text-sm text-yellow-700 dark:text-yellow-300">
                  You've reached Level {xpProgress.currentLevel}
                </p>
              </div>
              <Sparkles className="h-6 w-6 text-yellow-500" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* XP Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Badge variant="level" className="flex items-center space-x-2 px-4 py-2">
            <Star className="h-5 w-5" />
            <span className="text-lg font-bold">Level {xpProgress.currentLevel}</span>
          </Badge>

          {showDetails && (
            <div className="flex items-center space-x-2">
              <Zap className="h-4 w-4 text-purple-500" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {formatXP(displayXP)} XP
              </span>
            </div>
          )}
        </div>

        {showDetails && (
          <div className="text-right">
            <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Level {xpProgress.nextLevel}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              {formatXP(xpProgress.xpForNextLevel - displayXP)} XP to go
            </div>
          </div>
        )}
      </div>

      {/* Progress Bar */}
      <div className="relative">
        <Progress
          value={xpProgress.progress}
          variant="xp"
          size="lg"
          animated={animated ? "shimmer" : "none"}
          showLabel
          labelPosition="top"
        />

        {/* Milestone Markers */}
        {showDetails && (
          <div className="flex justify-between mt-2 px-1">
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {formatXP(xpProgress.xpForCurrentLevel)}
            </span>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {formatXP(xpProgress.xpForNextLevel)}
            </span>
          </div>
        )}
      </div>

      {/* XP Breakdown */}
      {showDetails && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="grid grid-cols-3 gap-4 mt-4"
        >
          <div className="text-center p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
            <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
              {formatXP(displayXP - xpProgress.xpForCurrentLevel)}
            </div>
            <div className="text-xs text-purple-600 dark:text-purple-400">
              Current Level XP
            </div>
          </div>

          <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {formatXP(xpProgress.xpForNextLevel - xpProgress.xpForCurrentLevel)}
            </div>
            <div className="text-xs text-blue-600 dark:text-blue-400">
              XP Required
            </div>
          </div>

          <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
              {Math.round(xpProgress.progress)}%
            </div>
            <div className="text-xs text-green-600 dark:text-green-400">
              Progress
            </div>
          </div>
        </motion.div>
      )}
    </div>
  )
}