"use client"

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Trophy,
  Lock,
  Unlock,
  Star,
  Zap,
  Target,
  Calendar,
  Sparkles,
  Gift
} from 'lucide-react'
import { formatXP, getTimeAgo } from '@/lib/utils'

interface AchievementCardProps {
  achievement: {
    id: string
    title: string
    description: string
    icon: string
    rarity: 'common' | 'rare' | 'epic' | 'legendary' | 'mythic'
    category: string
    xpReward: number
    requirement: {
      type: string
      value: number
      current: number
    }
    unlocked: boolean
    unlockedAt?: Date
    progress?: number
  }
  showProgress?: boolean
  compact?: boolean
  onUnlock?: (achievementId: string) => void
  onClick?: (achievement: any) => void
}

export function AchievementCard({
  achievement,
  showProgress = true,
  compact = false,
  onUnlock,
  onClick
}: AchievementCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [showCelebration, setShowCelebration] = useState(false)

  const getRarityColor = () => {
    switch (achievement.rarity) {
      case 'common': return 'from-gray-400 to-gray-600'
      case 'rare': return 'from-blue-400 to-blue-600'
      case 'epic': return 'from-purple-400 to-purple-600'
      case 'legendary': return 'from-amber-400 to-amber-600'
      case 'mythic': return 'from-gradient-to-r from-rose-400 via-fuchsia-500 to-indigo-500'
      default: return 'from-gray-400 to-gray-600'
    }
  }

  const getRarityBorder = () => {
    switch (achievement.rarity) {
      case 'common': return 'border-gray-300 dark:border-gray-600'
      case 'rare': return 'border-blue-300 dark:border-blue-600'
      case 'epic': return 'border-purple-300 dark:border-purple-600'
      case 'legendary': return 'border-amber-300 dark:border-amber-600'
      case 'mythic': return 'border-rose-300 dark:border-rose-600'
      default: return 'border-gray-300 dark:border-gray-600'
    }
  }

  const getProgressPercentage = () => {
    if (!achievement.progress) return 0
    return Math.min(100, (achievement.progress / achievement.requirement.value) * 100)
  }

  const getIcon = () => {
    const iconClass = "h-6 w-6"
    switch (achievement.icon) {
      case 'trophy': return <Trophy className={iconClass} />
      case 'star': return <Star className={iconClass} />
      case 'zap': return <Zap className={iconClass} />
      case 'target': return <Target className={iconClass} />
      case 'calendar': return <Calendar className={iconClass} />
      case 'gift': return <Gift className={iconClass} />
      default: return <Trophy className={iconClass} />
    }
  }

  const handleUnlock = () => {
    if (achievement.unlocked && onUnlock) {
      onUnlock(achievement.id)
      setShowCelebration(true)
      setTimeout(() => setShowCelebration(false), 3000)
    }
  }

  if (compact) {
    return (
      <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className={`relative p-3 rounded-lg border-2 ${getRarityBorder()} ${
          achievement.unlocked
            ? 'bg-white dark:bg-gray-800'
            : 'bg-gray-50 dark:bg-gray-900 opacity-75'
        } transition-all duration-200 cursor-pointer`}
        onClick={() => onClick?.(achievement)}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="flex items-center space-x-3">
          <div className={`p-2 rounded-lg bg-gradient-to-br ${getRarityColor()} ${
            achievement.unlocked ? '' : 'grayscale'
          }`}>
            <div className="text-white">
              {getIcon()}
            </div>
          </div>

          <div className="flex-1 min-w-0">
            <h4 className={`font-semibold text-sm truncate ${
              achievement.unlocked
                ? 'text-gray-900 dark:text-gray-100'
                : 'text-gray-500 dark:text-gray-400'
            }`}>
              {achievement.title}
            </h4>
            <div className="flex items-center space-x-2 mt-1">
              <Badge variant={achievement.unlocked ? "achievement" : "secondary"} size="sm">
                {achievement.rarity}
              </Badge>
              {showProgress && !achievement.unlocked && (
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {achievement.progress}/{achievement.requirement.value}
                </span>
              )}
            </div>
          </div>

          <div className="flex flex-col items-end space-y-1">
            {achievement.unlocked ? (
              <Unlock className="h-4 w-4 text-green-500" />
            ) : (
              <Lock className="h-4 w-4 text-gray-400" />
            )}
            <span className="text-xs font-medium text-purple-600 dark:text-purple-400">
              +{formatXP(achievement.xpReward)} XP
            </span>
          </div>
        </div>

        {showProgress && !achievement.unlocked && (
          <div className="mt-2">
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
              <div
                className="bg-gradient-to-r from-blue-500 to-purple-500 h-1.5 rounded-full transition-all duration-300"
                style={{ width: `${getProgressPercentage()}%` }}
              />
            </div>
          </div>
        )}
      </motion.div>
    )
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        whileHover={{
          scale: 1.02,
          boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
        }}
        whileTap={{ scale: 0.98 }}
        className="relative"
      >
        <Card className={`h-full border-2 ${getRarityBorder()} transition-all duration-300 ${
          achievement.unlocked
            ? 'bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 shadow-lg'
            : 'bg-gray-50 dark:bg-gray-900 opacity-75'
        }`}>
          {/* Celebration Animation */}
          <AnimatePresence>
            {showCelebration && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.2 }}
                className="absolute inset-0 z-10 flex items-center justify-center bg-white/95 dark:bg-gray-900/95 rounded-2xl backdrop-blur-sm"
              >
                <div className="text-center">
                  <motion.div
                    animate={{ rotate: [0, 360] }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="mx-auto mb-2"
                  >
                    <Trophy className="h-16 w-16 text-yellow-500" />
                  </motion.div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    Achievement Unlocked!
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mt-1">
                    +{formatXP(achievement.xpReward)} XP Earned
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-3">
                <motion.div
                  whileHover={{ rotate: 10, scale: 1.1 }}
                  className={`p-3 rounded-xl bg-gradient-to-br ${getRarityColor()} ${
                    achievement.unlocked ? '' : 'grayscale opacity-50'
                  } shadow-md`}
                >
                  <div className="text-white">
                    {getIcon()}
                  </div>
                </motion.div>

                <div className="flex-1">
                  <CardTitle className={`text-lg ${
                    achievement.unlocked
                      ? 'text-gray-900 dark:text-gray-100'
                      : 'text-gray-500 dark:text-gray-400'
                  }`}>
                    {achievement.title}
                  </CardTitle>
                  <div className="flex items-center space-x-2 mt-1">
                    <Badge
                      variant={achievement.unlocked ? "achievement" : "secondary"}
                      size="sm"
                      className={achievement.unlocked ? "animate-pulse" : ""}
                    >
                      {achievement.rarity}
                    </Badge>
                    <Badge variant="outline" size="sm">
                      {achievement.category}
                    </Badge>
                  </div>
                </div>
              </div>

              <div className="flex flex-col items-end space-y-2">
                {achievement.unlocked ? (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", duration: 0.5 }}
                  >
                    <Unlock className="h-6 w-6 text-green-500" />
                  </motion.div>
                ) : (
                  <Lock className="h-6 w-6 text-gray-400" />
                )}
                <div className="text-right">
                  <div className="text-sm font-bold text-purple-600 dark:text-purple-400">
                    +{formatXP(achievement.xpReward)} XP
                  </div>
                </div>
              </div>
            </div>
          </CardHeader>

          <CardContent className="pt-0">
            <CardDescription className={`text-sm mb-4 ${
              achievement.unlocked
                ? 'text-gray-700 dark:text-gray-300'
                : 'text-gray-500 dark:text-gray-400'
            }`}>
              {achievement.description}
            </CardDescription>

            {/* Progress Section */}
            {showProgress && !achievement.unlocked && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">
                    {achievement.requirement.type}
                  </span>
                  <span className="font-medium text-gray-900 dark:text-gray-100">
                    {achievement.progress || 0} / {achievement.requirement.value}
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <motion.div
                    className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${getProgressPercentage()}%` }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                  />
                </div>
                <div className="text-center">
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {Math.round(getProgressPercentage())}% Complete
                  </span>
                </div>
              </div>
            )}

            {/* Unlocked Date */}
            {achievement.unlocked && achievement.unlockedAt && (
              <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                <Calendar className="h-4 w-4" />
                <span>Unlocked {getTimeAgo(achievement.unlockedAt)}</span>
              </div>
            )}

            {/* Action Button */}
            {achievement.unlocked && onUnlock && (
              <Button
                variant="gamification"
                size="sm"
                className="w-full mt-4"
                onClick={handleUnlock}
              >
                <Sparkles className="h-4 w-4 mr-2" />
                Claim Reward
              </Button>
            )}
          </CardContent>

          {/* Hover Effects */}
          {isHovered && achievement.unlocked && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute -top-2 -right-2"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-yellow-400 rounded-full blur-lg opacity-50 animate-pulse" />
                <Star className="h-6 w-6 text-yellow-500 fill-yellow-500 relative" />
              </div>
            </motion.div>
          )}
        </Card>
      </motion.div>
    </AnimatePresence>
  )
}