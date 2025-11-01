"use client"

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Flame,
  Calendar,
  Zap,
  Gift,
  Trophy,
  Star,
  Award,
  Target,
  CheckCircle
} from 'lucide-react'
import { getStreakBonusDays, getTimeAgo } from '@/lib/utils'

interface StreakTrackerProps {
  currentStreak: number
  longestStreak: number
  lastActiveDate: Date
  claimedToday: boolean
  dailyGoals: {
    completed: number
    total: number
  }
  onClaimDailyReward: () => void
  compact?: boolean
}

export function StreakTracker({
  currentStreak,
  longestStreak,
  lastActiveDate,
  claimedToday,
  dailyGoals,
  onClaimDailyReward,
  compact = false
}: StreakTrackerProps) {
  const [isClaiming, setIsClaiming] = useState(false)
  const [showRewardAnimation, setShowRewardAnimation] = useState(false)
  const [timeUntilReset, setTimeUntilReset] = useState('')

  useEffect(() => {
    const calculateTimeUntilReset = () => {
      const now = new Date()
      const tomorrow = new Date(now)
      tomorrow.setDate(tomorrow.getDate() + 1)
      tomorrow.setHours(0, 0, 0, 0)

      const diff = tomorrow.getTime() - now.getTime()
      const hours = Math.floor(diff / (1000 * 60 * 60))
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))

      setTimeUntilReset(`${hours}h ${minutes}m`)
    }

    calculateTimeUntilReset()
    const interval = setInterval(calculateTimeUntilReset, 60000) // Update every minute

    return () => clearInterval(interval)
  }, [])

  const getStreakColor = () => {
    if (currentStreak >= 100) return 'from-purple-600 to-pink-600'
    if (currentStreak >= 50) return 'from-red-600 to-orange-600'
    if (currentStreak >= 30) return 'from-amber-600 to-yellow-600'
    if (currentStreak >= 14) return 'from-blue-600 to-cyan-600'
    if (currentStreak >= 7) return 'from-green-600 to-emerald-600'
    return 'from-gray-600 to-gray-700'
  }

  const getStreakMilestone = () => {
    if (currentStreak >= 365) return { icon: <Trophy className="h-8 w-8" />, title: "Legendary!", color: "text-purple-600" }
    if (currentStreak >= 180) return { icon: <Star className="h-8 w-8" />, title: "Epic!", color: "text-red-600" }
    if (currentStreak >= 90) return { icon: <Award className="h-8 w-8" />, title: "Amazing!", color: "text-amber-600" }
    if (currentStreak >= 30) return { icon: <Zap className="h-8 w-8" />, title: "Incredible!", color: "text-blue-600" }
    if (currentStreak >= 14) return { icon: <Flame className="h-8 w-8" />, title: "Great!", color: "text-green-600" }
    if (currentStreak >= 7) return { icon: <Target className="h-8 w-8" />, title: "Good Start!", color: "text-orange-600" }
    return { icon: <Flame className="h-8 w-8" />, title: "Keep Going!", color: "text-gray-600" }
  }

  const getDailyBonus = () => {
    const baseXP = 50
    const streakBonus = getStreakBonusDays(currentStreak)
    return baseXP + streakBonus
  }

  const handleClaimReward = async () => {
    setIsClaiming(true)
    await new Promise(resolve => setTimeout(resolve, 1000)) // Simulate API call
    setShowRewardAnimation(true)
    setIsClaiming(false)
    onClaimDailyReward()

    setTimeout(() => {
      setShowRewardAnimation(false)
    }, 3000)
  }

  const isStreakActive = () => {
    const now = new Date()
    const lastActive = new Date(lastActiveDate)
    const diffInHours = (now.getTime() - lastActive.getTime()) / (1000 * 60 * 60)
    return diffInHours <= 48
  }

  const milestone = getStreakMilestone()
  const bonusDays = getStreakBonusDays(currentStreak)

  if (compact) {
    return (
      <Card className="border-2 border-orange-200 dark:border-orange-800 bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="p-2 rounded-lg bg-gradient-to-br from-orange-500 to-red-500"
              >
                <Flame className="h-6 w-6 text-white" />
              </motion.div>
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    {currentStreak}
                  </span>
                  <span className="text-sm text-gray-600 dark:text-gray-400">day streak</span>
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  Longest: {longestStreak} days
                </div>
              </div>
            </div>

            <div className="text-right">
              {!claimedToday ? (
                <Button
                  variant="warning"
                  size="sm"
                  onClick={handleClaimReward}
                  disabled={isClaiming}
                  className="animate-pulse"
                >
                  <Gift className="h-4 w-4 mr-1" />
                  Claim
                </Button>
              ) : (
                <div className="flex items-center space-x-1 text-green-600">
                  <CheckCircle className="h-4 w-4" />
                  <span className="text-xs">Claimed</span>
                </div>
              )}
            </div>
          </div>

          {/* Daily Progress */}
          <div className="mt-3">
            <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400 mb-1">
              <span>Daily Goals</span>
              <span>{dailyGoals.completed}/{dailyGoals.total}</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
              <div
                className="bg-gradient-to-r from-orange-500 to-red-500 h-1.5 rounded-full transition-all duration-300"
                style={{ width: `${(dailyGoals.completed / dailyGoals.total) * 100}%` }}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-2 border-orange-200 dark:border-orange-800 overflow-hidden">
      {/* Reward Animation Overlay */}
      <AnimatePresence>
        {showRewardAnimation && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-10 flex items-center justify-center bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.8, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: -20 }}
              className="text-center"
            >
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="mx-auto mb-4"
              >
                <Gift className="h-16 w-16 text-yellow-500" />
              </motion.div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                Daily Reward Claimed!
              </h3>
              <p className="text-lg text-gray-600 dark:text-gray-400">
                +{getDailyBonus()} XP Earned
              </p>
              {bonusDays > 0 && (
                <Badge variant="premium" className="mt-2">
                  +{bonusDays} Streak Bonus
                </Badge>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <CardHeader className="bg-gradient-to-r from-orange-100 to-red-100 dark:from-orange-900/30 dark:to-red-900/30">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <motion.div
              animate={{
                rotate: [0, 5, -5, 0],
                scale: [1, 1.05, 1]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className={`p-3 rounded-xl bg-gradient-to-br ${getStreakColor()}`}
            >
              <Flame className="h-8 w-8 text-white" />
            </motion.div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {currentStreak} Day Streak
              </h2>
              <CardDescription className="text-sm">
                {isStreakActive() ? 'Active' : 'At Risk'} • Longest: {longestStreak} days
              </CardDescription>
            </div>
          </div>

          <div className={`text-center ${milestone.color}`}>
            {milestone.icon}
            <p className="text-sm font-bold mt-1">{milestone.title}</p>
          </div>
        </CardTitle>
      </CardHeader>

      <CardContent className="p-6">
        {/* Streak Status */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="text-center p-4 bg-orange-50 dark:bg-orange-900/20 rounded-xl">
            <div className="text-3xl font-bold text-orange-600 dark:text-orange-400">
              {currentStreak}
            </div>
            <div className="text-sm text-orange-600 dark:text-orange-400">
              Current Streak
            </div>
          </div>

          <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl">
            <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">
              {bonusDays}
            </div>
            <div className="text-sm text-purple-600 dark:text-purple-400">
              Bonus Days
            </div>
          </div>
        </div>

        {/* Daily Goals Progress */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-semibold text-gray-900 dark:text-gray-100">
              Daily Goals
            </h3>
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {dailyGoals.completed}/{dailyGoals.total} Complete
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
            <motion.div
              className="bg-gradient-to-r from-orange-500 to-red-500 h-3 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${(dailyGoals.completed / dailyGoals.total) * 100}%` }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            />
          </div>
        </div>

        {/* Daily Reward Section */}
        <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                Daily Reward
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Resets in {timeUntilReset}
              </p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                +{getDailyBonus()} XP
              </div>
              {bonusDays > 0 && (
                <Badge variant="premium" size="sm">
                  +{bonusDays} Bonus
                </Badge>
              )}
            </div>
          </div>

          {!claimedToday ? (
            <Button
              variant="warning"
              size="lg"
              className="w-full animate-pulse"
              onClick={handleClaimReward}
              disabled={isClaiming}
            >
              {isClaiming ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  Claiming...
                </>
              ) : (
                <>
                  <Gift className="h-5 w-5 mr-2" />
                  Claim Daily Reward
                </>
              )}
            </Button>
          ) : (
            <div className="w-full p-3 bg-green-100 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl text-center">
              <div className="flex items-center justify-center space-x-2 text-green-700 dark:text-green-400">
                <CheckCircle className="h-5 w-5" />
                <span className="font-semibold">Today's reward claimed!</span>
              </div>
              <p className="text-sm text-green-600 dark:text-green-400 mt-1">
                Come back tomorrow for your next reward
              </p>
            </div>
          )}
        </div>

        {/* Streak Benefits */}
        <div className="mt-6 p-4 bg-gradient-to-r from-yellow-50 to-amber-50 dark:from-yellow-900/20 dark:to-amber-900/20 rounded-xl border border-yellow-200 dark:border-yellow-800">
          <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
            Streak Benefits
          </h4>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="flex items-center space-x-2">
              <Star className="h-4 w-4 text-yellow-500" />
              <span className="text-gray-700 dark:text-gray-300">
                {currentStreak >= 7 ? '✓' : '-'} Weekly Bonus (7+ days)
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <Award className="h-4 w-4 text-amber-500" />
              <span className="text-gray-700 dark:text-gray-300">
                {currentStreak >= 30 ? '✓' : '-'} Monthly Badge (30+ days)
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <Trophy className="h-4 w-4 text-purple-500" />
              <span className="text-gray-700 dark:text-gray-300">
                {currentStreak >= 100 ? '✓' : '-'} Elite Status (100+ days)
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <Gift className="h-4 w-4 text-green-500" />
              <span className="text-gray-700 dark:text-gray-300">
                +{bonusDays} XP Bonus Daily
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}