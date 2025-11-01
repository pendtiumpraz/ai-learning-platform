"use client"

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { XPBar } from '@/components/gamification/xp-bar'
import { AchievementCard } from '@/components/gamification/achievement-card'
import { Leaderboard } from '@/components/gamification/leaderboard'
import { StreakTracker } from '@/components/gamification/streak-tracker'
import { LearningProgressCard } from '@/components/dashboard/learning-progress-card'
import {
  Trophy,
  Target,
  Brain,
  Code,
  BookOpen,
  Zap,
  Star,
  TrendingUp,
  Users,
  Calendar,
  Gift,
  Settings,
  Bell,
  User,
  ChevronRight,
  Flame,
  Award,
  Sparkles
} from 'lucide-react'

interface DashboardData {
  user: {
    id: string
    username: string
    avatar: string
    level: number
    totalXP: number
    weeklyXP: number
    streak: number
    longestStreak: number
    rank: number
    badges: number
    achievements: number
  }
  achievements: Array<{
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
  }>
  learningPaths: Array<{
    id: string
    title: string
    description: string
    category: string
    difficulty: 'beginner' | 'intermediate' | 'advanced' | 'expert'
    progress: number
    totalModules: number
    completedModules: number
    estimatedHours: number
    xpReward: number
    currentModule?: {
      id: string
      title: string
      type: 'video' | 'reading' | 'exercise' | 'project' | 'quiz'
      duration: number
    }
    prerequisites: string[]
    isLocked: boolean
    icon: string
    color: string
  }>
  leaderboard: Array<{
    id: string
    username: string
    avatar: string
    level: number
    totalXP: number
    weeklyXP: number
    rank: number
    previousRank: number
    badges: number
    achievements: number
    streak: number
    isCurrentUser?: boolean
  }>
  weeklyChallenge: {
    id: string
    title: string
    description: string
    progress: number
    totalRequired: number
    xpReward: number
    endTime: Date
  }
}

export default function Dashboard() {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [selectedView, setSelectedView] = useState<'overview' | 'achievements' | 'leaderboard' | 'learning'>('overview')
  const [showLevelUpAnimation, setShowLevelUpAnimation] = useState(false)

  // Mock data - in real app, this would come from API
  useEffect(() => {
    const mockData: DashboardData = {
      user: {
        id: '1',
        username: 'AIEnthusiast',
        avatar: '/api/placeholder/40/40',
        level: 15,
        totalXP: 4500,
        weeklyXP: 320,
        streak: 12,
        longestStreak: 28,
        rank: 42,
        badges: 8,
        achievements: 15
      },
      achievements: [
        {
          id: '1',
          title: 'First Steps',
          description: 'Complete your first learning module',
          icon: 'star',
          rarity: 'common',
          category: 'Getting Started',
          xpReward: 50,
          requirement: { type: 'modules', value: 1, current: 1 },
          unlocked: true,
          unlockedAt: new Date('2024-01-15'),
          progress: 1
        },
        {
          id: '2',
          title: 'Week Warrior',
          description: 'Maintain a 7-day learning streak',
          icon: 'calendar',
          rarity: 'rare',
          category: 'Streaks',
          xpReward: 200,
          requirement: { type: 'streak', value: 7, current: 12 },
          unlocked: true,
          unlockedAt: new Date('2024-01-20'),
          progress: 12
        },
        {
          id: '3',
          title: 'Knowledge Seeker',
          description: 'Complete 50 learning modules',
          icon: 'brain',
          rarity: 'epic',
          category: 'Learning',
          xpReward: 500,
          requirement: { type: 'modules', value: 50, current: 32 },
          unlocked: false,
          progress: 32
        }
      ],
      learningPaths: [
        {
          id: '1',
          title: 'Introduction to Machine Learning',
          description: 'Learn the fundamentals of ML and AI',
          category: 'Machine Learning',
          difficulty: 'beginner',
          progress: 65,
          totalModules: 12,
          completedModules: 8,
          estimatedHours: 20,
          xpReward: 1000,
          currentModule: {
            id: '9',
            title: 'Neural Networks Basics',
            type: 'video',
            duration: 45
          },
          prerequisites: [],
          isLocked: false,
          icon: 'brain',
          color: 'blue'
        },
        {
          id: '2',
          title: 'Advanced Neural Networks',
          description: 'Deep dive into deep learning architectures',
          category: 'Deep Learning',
          difficulty: 'advanced',
          progress: 25,
          totalModules: 16,
          completedModules: 4,
          estimatedHours: 40,
          xpReward: 2000,
          currentModule: {
            id: '5',
            title: 'CNN Architecture',
            type: 'exercise',
            duration: 60
          },
          prerequisites: ['Introduction to Machine Learning'],
          isLocked: false,
          icon: 'code',
          color: 'purple'
        },
        {
          id: '3',
          title: 'Natural Language Processing',
          description: 'Master NLP techniques and applications',
          category: 'NLP',
          difficulty: 'intermediate',
          progress: 0,
          totalModules: 14,
          completedModules: 0,
          estimatedHours: 35,
          xpReward: 1500,
          prerequisites: ['Introduction to Machine Learning'],
          isLocked: false,
          icon: 'book',
          color: 'green'
        }
      ],
      leaderboard: [
        {
          id: '1',
          username: 'AIMaster',
          avatar: '/api/placeholder/40/40',
          level: 45,
          totalXP: 15000,
          weeklyXP: 850,
          rank: 1,
          previousRank: 2,
          badges: 25,
          achievements: 42,
          streak: 156
        },
        {
          id: '2',
          username: 'CodeWizard',
          avatar: '/api/placeholder/40/40',
          level: 42,
          totalXP: 13500,
          weeklyXP: 720,
          rank: 2,
          previousRank: 3,
          badges: 22,
          achievements: 38,
          streak: 89
        },
        {
          id: '3',
          username: 'AIEnthusiast',
          avatar: '/api/placeholder/40/40',
          level: 15,
          totalXP: 4500,
          weeklyXP: 320,
          rank: 42,
          previousRank: 45,
          badges: 8,
          achievements: 15,
          streak: 12,
          isCurrentUser: true
        }
      ],
      weeklyChallenge: {
        id: '1',
        title: 'Python Master',
        description: 'Complete 5 Python coding challenges',
        progress: 3,
        totalRequired: 5,
        xpReward: 300,
        endTime: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)
      }
    }

    setTimeout(() => {
      setDashboardData(mockData)
      setIsLoading(false)
    }, 1000)
  }, [])

  const handleClaimDailyReward = () => {
    console.log('Daily reward claimed!')
  }

  const handlePathSelect = (pathId: string) => {
    console.log('Path selected:', pathId)
  }

  const handleContinueLearning = (pathId: string, moduleId: string) => {
    console.log('Continue learning:', pathId, moduleId)
  }

  const handleUserClick = (user: any) => {
    console.log('User clicked:', user)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-64 bg-gray-200 dark:bg-gray-800 rounded-xl animate-pulse" />
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (!dashboardData) return null

  const { user, achievements, learningPaths, leaderboard, weeklyChallenge } = dashboardData

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-b border-gray-200 dark:border-gray-700 sticky top-0 z-40"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Brain className="h-8 w-8 text-purple-600" />
                <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  AI Learning Platform
                </h1>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="icon">
                <Bell className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon">
                <Settings className="h-5 w-5" />
              </Button>
              <div className="flex items-center space-x-2">
                <img
                  src={user.avatar}
                  alt={user.username}
                  className="h-8 w-8 rounded-full border-2 border-purple-500"
                />
                <span className="font-medium text-gray-900 dark:text-gray-100">
                  {user.username}
                </span>
              </div>
            </div>
          </div>
        </div>
      </motion.header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* User Stats Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Card className="bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 text-white border-0 shadow-2xl">
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row items-center justify-between space-y-4 lg:space-y-0">
                <div className="flex items-center space-x-4">
                  <img
                    src={user.avatar}
                    alt={user.username}
                    className="h-16 w-16 rounded-full border-4 border-white shadow-lg"
                  />
                  <div>
                    <h2 className="text-3xl font-bold">Welcome back, {user.username}!</h2>
                    <p className="text-purple-100">Ready to continue your AI learning journey?</p>
                  </div>
                </div>

                <div className="flex items-center space-x-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold">Level {user.level}</div>
                    <div className="text-purple-100">Current Level</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold flex items-center space-x-1">
                      <Flame className="h-6 w-6 text-orange-300" />
                      {user.streak}
                    </div>
                    <div className="text-purple-100">Day Streak</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold">#{user.rank}</div>
                    <div className="text-purple-100">Global Rank</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* XP Progress Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <XPBar
            currentXP={user.totalXP}
            showDetails={true}
            animated={true}
            onLevelUp={(newLevel) => setShowLevelUpAnimation(true)}
          />
        </motion.div>

        {/* Navigation Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <div className="flex space-x-2 bg-white dark:bg-gray-800 p-2 rounded-xl shadow-lg">
            {[
              { id: 'overview', label: 'Overview', icon: <Target className="h-4 w-4" /> },
              { id: 'learning', label: 'Learning', icon: <BookOpen className="h-4 w-4" /> },
              { id: 'achievements', label: 'Achievements', icon: <Trophy className="h-4 w-4" /> },
              { id: 'leaderboard', label: 'Leaderboard', icon: <Users className="h-4 w-4" /> }
            ].map((tab) => (
              <Button
                key={tab.id}
                variant={selectedView === tab.id ? "default" : "ghost"}
                className="flex-1 justify-center space-x-2"
                onClick={() => setSelectedView(tab.id as any)}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </Button>
            ))}
          </div>
        </motion.div>

        {/* Dynamic Content Based on Selected View */}
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedView}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {selectedView === 'overview' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Streak Tracker */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <StreakTracker
                    currentStreak={user.streak}
                    longestStreak={user.longestStreak}
                    lastActiveDate={new Date()}
                    claimedToday={false}
                    dailyGoals={{ completed: 3, total: 5 }}
                    onClaimDailyReward={handleClaimDailyReward}
                  />
                </motion.div>

                {/* Weekly Challenge */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <Card className="h-full border-2 border-green-200 dark:border-green-800">
                    <CardHeader className="bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30">
                      <CardTitle className="flex items-center space-x-2">
                        <Target className="h-5 w-5 text-green-600" />
                        <span>Weekly Challenge</span>
                      </CardTitle>
                      <CardDescription>
                        Complete this week's challenge for bonus XP!
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="p-6">
                      <div className="space-y-4">
                        <div>
                          <h3 className="font-semibold text-lg text-gray-900 dark:text-gray-100">
                            {weeklyChallenge.title}
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {weeklyChallenge.description}
                          </p>
                        </div>

                        <div>
                          <div className="flex justify-between text-sm mb-2">
                            <span>Progress</span>
                            <span>{weeklyChallenge.progress}/{weeklyChallenge.totalRequired}</span>
                          </div>
                          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                            <div
                              className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full"
                              style={{
                                width: `${(weeklyChallenge.progress / weeklyChallenge.totalRequired) * 100}%`
                              }}
                            />
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <Badge variant="success" className="text-sm">
                            <Gift className="h-3 w-3 mr-1" />
                            +{weeklyChallenge.xpReward} XP
                          </Badge>
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            3 days left
                          </span>
                        </div>

                        <Button variant="default" className="w-full">
                          Continue Challenge
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>

                {/* Recent Achievements */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <Card className="h-full">
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <Award className="h-5 w-5" />
                        <span>Recent Achievements</span>
                      </CardTitle>
                      <CardDescription>
                        Your latest accomplishments
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="p-6">
                      <div className="space-y-3">
                        {achievements.slice(0, 3).map((achievement) => (
                          <div
                            key={achievement.id}
                            className="flex items-center space-x-3 p-3 rounded-lg border border-gray-200 dark:border-gray-700"
                          >
                            <div className={`p-2 rounded-lg bg-gradient-to-r ${
                              achievement.rarity === 'common' ? 'from-gray-400 to-gray-600' :
                              achievement.rarity === 'rare' ? 'from-blue-400 to-blue-600' :
                              achievement.rarity === 'epic' ? 'from-purple-400 to-purple-600' :
                              'from-amber-400 to-amber-600'
                            }`}>
                              <Star className="h-4 w-4 text-white" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="font-medium text-sm truncate">
                                {achievement.title}
                              </h4>
                              <p className="text-xs text-gray-600 dark:text-gray-400">
                                +{achievement.xpReward} XP
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                      <Button variant="outline" className="w-full mt-4">
                        View All Achievements
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>

                {/* Learning Progress Overview */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 }}
                  className="lg:col-span-3"
                >
                  <LearningProgressCard
                    paths={learningPaths}
                    onPathSelect={handlePathSelect}
                    onContinueLearning={handleContinueLearning}
                    compact={true}
                  />
                </motion.div>
              </div>
            )}

            {selectedView === 'learning' && (
              <LearningProgressCard
                paths={learningPaths}
                onPathSelect={handlePathSelect}
                onContinueLearning={handleContinueLearning}
              />
            )}

            {selectedView === 'achievements' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {achievements.map((achievement, index) => (
                  <motion.div
                    key={achievement.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <AchievementCard
                      achievement={achievement}
                      showProgress={true}
                      onUnlock={(id) => console.log('Achievement unlocked:', id)}
                    />
                  </motion.div>
                ))}
              </div>
            )}

            {selectedView === 'leaderboard' && (
              <Leaderboard
                entries={leaderboard}
                type="global"
                onUserClick={handleUserClick}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  )
}