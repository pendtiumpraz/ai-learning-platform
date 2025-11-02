"use client"

import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Confetti from 'react-confetti'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Trophy,
  Star,
  Zap,
  Gift,
  Sparkles,
  X
} from 'lucide-react'

interface AchievementNotificationProps {
  achievement: {
    id: string
    title: string
    description: string
    icon: string
    rarity: 'common' | 'rare' | 'epic' | 'legendary' | 'mythic'
    xpReward: number
  }
  isVisible: boolean
  onClose: () => void
  onClaimReward: () => void
}

export function AchievementNotification({
  achievement,
  isVisible,
  onClose,
  onClaimReward
}: AchievementNotificationProps) {
  const [showConfetti, setShowConfetti] = useState(false)
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 })

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight
      })
    }

    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    if (isVisible) {
      setShowConfetti(true)
      // Auto-hide confetti after 5 seconds
      const timer = setTimeout(() => {
        setShowConfetti(false)
      }, 5000)
      return () => clearTimeout(timer)
    }
    return undefined
  }, [isVisible])

  const getRarityGradient = () => {
    switch (achievement.rarity) {
      case 'common':
        return 'from-gray-400 via-gray-500 to-gray-600'
      case 'rare':
        return 'from-blue-400 via-blue-500 to-blue-600'
      case 'epic':
        return 'from-purple-400 via-purple-500 to-purple-600'
      case 'legendary':
        return 'from-amber-400 via-amber-500 to-amber-600'
      case 'mythic':
        return 'from-gradient-to-r from-rose-400 via-fuchsia-500 to-indigo-500'
      default:
        return 'from-gray-400 to-gray-600'
    }
  }

  const getRarityStars = () => {
    switch (achievement.rarity) {
      case 'common': return 1
      case 'rare': return 2
      case 'epic': return 3
      case 'legendary': return 4
      case 'mythic': return 5
      default: return 1
    }
  }

  return (
    <>
      {/* Confetti Effect */}
      {showConfetti && (
        <Confetti
          width={windowSize.width}
          height={windowSize.height}
          recycle={false}
          numberOfPieces={achievement.rarity === 'mythic' ? 500 :
                         achievement.rarity === 'legendary' ? 300 :
                         achievement.rarity === 'epic' ? 200 :
                         achievement.rarity === 'rare' ? 100 : 50}
          gravity={0.1}
          colors={['#FFD700', '#FFA500', '#FF69B4', '#00CED1', '#9370DB']}
        />
      )}

      {/* Achievement Notification */}
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.5, y: 50 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            onClick={onClose}
          >
            <motion.div
              initial={{ rotate: -5 }}
              animate={{ rotate: 0 }}
              transition={{ type: "spring", stiffness: 200 }}
              className="relative max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <Button
                variant="ghost"
                size="icon"
                className="absolute -top-2 -right-2 z-10 bg-white dark:bg-gray-800 rounded-full shadow-lg"
                onClick={onClose}
              >
                <X className="h-4 w-4" />
              </Button>

              <Card className="border-2 border-gradient-to-r overflow-hidden shadow-2xl">
                {/* Gradient Border Effect */}
                <div className={`absolute inset-0 bg-gradient-to-r ${getRarityGradient()} opacity-20`} />

                <CardContent className="relative p-8 text-center">
                  {/* Achievement Icon */}
                  <motion.div
                    initial={{ scale: 0, rotate: 0 }}
                    animate={{ scale: 1, rotate: 360 }}
                    transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
                    className={`mx-auto w-20 h-20 rounded-2xl bg-gradient-to-br ${getRarityGradient()} flex items-center justify-center shadow-lg mb-4`}
                  >
                    <Trophy className="h-10 w-10 text-white" />
                  </motion.div>

                  {/* Rarity Stars */}
                  <div className="flex justify-center space-x-1 mb-4">
                    {[...Array(getRarityStars())].map((_, i) => (
                      <motion.div
                        key={i}
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.3 + i * 0.1 }}
                      >
                        <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                      </motion.div>
                    ))}
                  </div>

                  {/* Achievement Title */}
                  <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2"
                  >
                    Achievement Unlocked!
                  </motion.h2>

                  {/* Achievement Name */}
                  <motion.h3
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="text-xl font-semibold bg-gradient-to-r bg-clip-text text-transparent mb-2"
                    style={{
                      backgroundImage: `linear-gradient(to right,
                        ${achievement.rarity === 'common' ? '#9CA3AF' :
                          achievement.rarity === 'rare' ? '#3B82F6' :
                          achievement.rarity === 'epic' ? '#8B5CF6' :
                          achievement.rarity === 'legendary' ? '#F59E0B' :
                          '#EC4899'},
                        ${achievement.rarity === 'common' ? '#6B7280' :
                          achievement.rarity === 'rare' ? '#1D4ED8' :
                          achievement.rarity === 'epic' ? '#6D28D9' :
                          achievement.rarity === 'legendary' ? '#D97706' :
                          '#BE185D'})`
                    }}
                  >
                    {achievement.title}
                  </motion.h3>

                  {/* Achievement Description */}
                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="text-gray-600 dark:text-gray-400 mb-6"
                  >
                    {achievement.description}
                  </motion.p>

                  {/* Rarity Badge */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.7 }}
                    className="mb-6"
                  >
                    <Badge
                      variant="outline"
                      className={`px-4 py-2 text-sm font-semibold border-2 bg-gradient-to-r ${getRarityGradient()} text-white border-transparent`}
                    >
                      {achievement.rarity.toUpperCase()}
                    </Badge>
                  </motion.div>

                  {/* XP Reward */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                    className="flex items-center justify-center space-x-2 mb-6"
                  >
                    <div className="flex items-center space-x-1 px-4 py-2 bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/20 dark:to-pink-900/20 rounded-full">
                      <Zap className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                      <span className="font-bold text-purple-600 dark:text-purple-400">
                        +{achievement.xpReward} XP
                      </span>
                    </div>
                  </motion.div>

                  {/* Action Buttons */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.9 }}
                    className="flex space-x-3"
                  >
                    <Button
                      variant="default"
                      size="lg"
                      className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                      onClick={onClaimReward}
                    >
                      <Gift className="h-5 w-5 mr-2" />
                      Claim Reward
                    </Button>
                    <Button
                      variant="outline"
                      size="lg"
                      onClick={onClose}
                    >
                      View Later
                    </Button>
                  </motion.div>

                  {/* Decorative Elements */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: [0, 1, 0] }}
                    transition={{ duration: 2, repeat: Infinity, delay: 1 }}
                    className="absolute top-2 left-2"
                  >
                    <Sparkles className="h-4 w-4 text-yellow-500" />
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: [0, 1, 0] }}
                    transition={{ duration: 2, repeat: Infinity, delay: 1.5 }}
                    className="absolute top-2 right-2"
                  >
                    <Sparkles className="h-4 w-4 text-yellow-500" />
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: [0, 1, 0] }}
                    transition={{ duration: 2, repeat: Infinity, delay: 2 }}
                    className="absolute bottom-2 left-2"
                  >
                    <Sparkles className="h-4 w-4 text-yellow-500" />
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: [0, 1, 0] }}
                    transition={{ duration: 2, repeat: Infinity, delay: 2.5 }}
                    className="absolute bottom-2 right-2"
                  >
                    <Sparkles className="h-4 w-4 text-yellow-500" />
                  </motion.div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}