"use client"

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { XPBar } from '@/components/gamification/xp-bar'
import { AchievementCard } from '@/components/gamification/achievement-card'
import { Leaderboard } from '@/components/gamification/leaderboard'
import { StreakTracker } from '@/components/gamification/streak-tracker'
import { LearningProgressCard } from '@/components/dashboard/learning-progress-card'
// Define the interface locally to match what the component expects
interface UILearningPath {
  id: string
  title: string
  description: string
  level: number
  modules: any[]
  estimatedDuration: number
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'expert'
  tags: string[]
  isActive: boolean
  currentModule?: {
    id: string
    title: string
    type: 'video' | 'reading' | 'exercise' | 'project' | 'quiz'
    duration: number
  }
  completedModules: number
  progress: number
  estimatedTimeRemaining: number
  isEnrolled: boolean
  enrollmentDate?: Date
  lastAccessDate?: Date
  totalModules: number
  estimatedHours: number
  xpReward: number
  prerequisites: string[]
  isLocked: boolean
  icon: string
  color: string
  category: string
}
import {
  Trophy,
  Target,
  Brain,
  BookOpen,
  Star,
  Users,
  Gift,
  Settings,
  Bell,
  Flame,
  Award,
  Volume2,
  Eye,
  Cpu,
  ArrowRight,
  Rocket
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
  learningPaths: UILearningPath[]
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
          id: 'llm-integration',
          title: 'LLM Integration Masterclass',
          description: 'Master Large Language Model integration for web applications',
          level: 1,
          modules: [],
          estimatedDuration: 45,
          difficulty: 'beginner',
          tags: ['OpenAI', 'ChatGPT', 'API Integration', 'JavaScript'],
          isActive: true,
          estimatedTimeRemaining: 20,
          isEnrolled: true,
          enrollmentDate: new Date('2024-01-01'),
          lastAccessDate: new Date('2024-01-15'),
          category: 'LLM Integration',
          progress: 70,
          totalModules: 8,
          completedModules: 6,
          estimatedHours: 8,
          xpReward: 1200,
          currentModule: {
            id: '7',
            title: 'Output Parsing & Formatting',
            type: 'exercise',
            duration: 30
          },
          prerequisites: [],
          isLocked: false,
          icon: 'brain',
          color: 'blue'
        },
        {
          id: 'tts-implementation',
          title: 'Text-to-Speech Implementation',
          description: 'Build voice-enabled applications with modern TTS APIs',
          level: 1,
          modules: [],
          estimatedDuration: 30,
          difficulty: 'beginner',
          tags: ['ElevenLabs', 'Web Speech API', 'Audio Processing'],
          isActive: true,
          estimatedTimeRemaining: 15,
          isEnrolled: true,
          enrollmentDate: new Date('2024-01-05'),
          lastAccessDate: new Date('2024-01-14'),
          category: 'TTS Integration',
          progress: 50,
          totalModules: 6,
          completedModules: 3,
          estimatedHours: 5,
          xpReward: 800,
          currentModule: {
            id: '4',
            title: 'Audio Controls & Playback',
            type: 'video',
            duration: 25
          },
          prerequisites: [],
          isLocked: false,
          icon: 'volume2',
          color: 'purple'
        },
        {
          id: 'vlm-vision',
          title: 'Vision Language Models',
          description: 'Implement image analysis with AI vision capabilities',
          level: 2,
          modules: [],
          estimatedDuration: 50,
          difficulty: 'intermediate',
          tags: ['GPT-4 Vision', 'Image Analysis', 'Base64 Encoding'],
          isActive: true,
          estimatedTimeRemaining: 35,
          isEnrolled: false,
          category: 'VLM Integration',
          progress: 0,
          totalModules: 10,
          completedModules: 0,
          estimatedHours: 10,
          xpReward: 1500,
          prerequisites: ['LLM Integration Masterclass'],
          isLocked: false,
          icon: 'eye',
          color: 'green'
        },
        {
          id: 'text2image-generation',
          title: 'AI Image Generation',
          description: 'Create stunning images with DALL-E and Stable Diffusion',
          level: 2,
          modules: [],
          estimatedDuration: 40,
          difficulty: 'intermediate',
          tags: ['DALL-E', 'Stable Diffusion', 'Base64', 'Image Processing'],
          isActive: true,
          estimatedTimeRemaining: 40,
          isEnrolled: false,
          category: 'AI Image Generation',
          progress: 0,
          totalModules: 8,
          completedModules: 0,
          estimatedHours: 8,
          xpReward: 1300,
          prerequisites: ['LLM Integration Masterclass'],
          isLocked: false,
          icon: 'image',
          color: 'pink'
        },
        {
          id: 'ai-agent-development',
          title: 'AI Agent Development',
          description: 'Build autonomous AI agents for automation and complex tasks',
          level: 3,
          modules: [],
          estimatedDuration: 90,
          difficulty: 'advanced',
          tags: ['LangChain', 'Autonomous Agents', 'Function Calling'],
          isActive: true,
          estimatedTimeRemaining: 90,
          isEnrolled: false,
          category: 'AI Agents',
          progress: 0,
          totalModules: 15,
          completedModules: 0,
          estimatedHours: 20,
          xpReward: 3000,
          prerequisites: ['LLM Integration Masterclass', 'Vision Language Models'],
          isLocked: false,
          icon: 'cpu',
          color: 'orange'
        },
        {
          id: 'api-best-practices',
          title: 'AI API Best Practices',
          description: 'Production-ready AI integration with security and optimization',
          level: 2,
          modules: [],
          estimatedDuration: 35,
          difficulty: 'intermediate',
          tags: ['Security', 'Rate Limiting', 'Cost Optimization', 'Production'],
          isActive: true,
          estimatedTimeRemaining: 25,
          isEnrolled: true,
          enrollmentDate: new Date('2024-01-08'),
          lastAccessDate: new Date('2024-01-12'),
          category: 'API Integration',
          progress: 30,
          totalModules: 7,
          completedModules: 2,
          estimatedHours: 6,
          xpReward: 1000,
          currentModule: {
            id: '3',
            title: 'Security & Authentication',
            type: 'reading',
            duration: 20
          },
          prerequisites: ['LLM Integration Masterclass'],
          isLocked: false,
          icon: 'code',
          color: 'gray'
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
        title: 'AI Integration Challenge',
        description: 'Complete 3 AI integration tutorials',
        progress: 2,
        totalRequired: 3,
        xpReward: 500,
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
    // Navigate to AI integration tutorial
    if (typeof window !== 'undefined') {
      window.location.href = `/learn/ai-integration?tutorial=${pathId}`
    }
  }

  const handleContinueLearning = (pathId: string, moduleId: string) => {
    // Navigate to specific tutorial with module
    if (typeof window !== 'undefined') {
      window.location.href = `/learn/ai-integration?tutorial=${pathId}&module=${moduleId}`
    }
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
      <header
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
              <Link href="/learn">
                <Button variant="outline" className="bg-white text-purple-600 hover:bg-purple-50 hover:text-purple-700 border-purple-300">
                  <BookOpen className="h-4 w-4 mr-2" />
                  Learning Center
                </Button>
              </Link>
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
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* User Stats Header */}
        <div
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
        </div>

        {/* XP Progress Bar */}
        <div
                    className="mb-8"
        >
          <XPBar
            currentXP={user.totalXP}
            showDetails={true}
            animated={true}
            onLevelUp={() => {}}
          />
        </div>

        {/* Navigation Tabs */}
        <div
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
        </div>

        {/* Dynamic Content Based on Selected View */}
        <div
            key={selectedView}
                      >
            {selectedView === 'overview' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Streak Tracker */}
                <div
                >
                  <StreakTracker
                    currentStreak={user.streak}
                    longestStreak={user.longestStreak}
                    lastActiveDate={new Date()}
                    claimedToday={false}
                    dailyGoals={{ completed: 3, total: 5 }}
                    onClaimDailyReward={handleClaimDailyReward}
                  />
                </div>

                {/* Weekly Challenge */}
                <div
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

                        <Link href="/learn/ai-integration">
                          <Button variant="default" className="w-full">
                            Start AI Tutorials
                            <ArrowRight className="w-4 h-4 ml-2" />
                          </Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Recent Achievements */}
                <div
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
                      <Link href="/learn/ai-integration">
                        <Button variant="outline" className="w-full mt-4">
                          View AI Tutorials
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                </div>

                {/* AI Integration Quick Start */}
                <div className="lg:col-span-3">
                  <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0 shadow-xl">
                    <CardHeader className="pb-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="text-2xl flex items-center gap-3">
                            <Rocket className="w-6 h-6" />
                            AI Integration Quick Start
                          </CardTitle>
                          <CardDescription className="text-blue-100 mt-2">
                            Start building AI-powered applications today with our hands-on tutorials
                          </CardDescription>
                        </div>
                        <Link href="/learn/ai-integration">
                          <Button className="bg-white text-blue-600 hover:bg-gray-100">
                            View All Tutorials
                            <ArrowRight className="w-4 h-4 ml-2" />
                          </Button>
                        </Link>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <Link href="/learn/ai-integration?tutorial=llm-basics">
                          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 hover:bg-white/20 transition-colors cursor-pointer">
                            <Brain className="w-8 h-8 mb-2" />
                            <h3 className="font-semibold mb-1">LLM Integration</h3>
                            <p className="text-sm text-blue-100">ChatGPT & OpenAI API</p>
                            <div className="flex items-center gap-2 mt-2">
                              <Badge className="bg-green-500 text-white">Beginner</Badge>
                              <span className="text-xs">45 min</span>
                            </div>
                          </div>
                        </Link>
                        <Link href="/learn/ai-integration?tutorial=tts">
                          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 hover:bg-white/20 transition-colors cursor-pointer">
                            <Volume2 className="w-8 h-8 mb-2" />
                            <h3 className="font-semibold mb-1">Text-to-Speech</h3>
                            <p className="text-sm text-blue-100">Voice Generation</p>
                            <div className="flex items-center gap-2 mt-2">
                              <Badge className="bg-green-500 text-white">Beginner</Badge>
                              <span className="text-xs">30 min</span>
                            </div>
                          </div>
                        </Link>
                        <Link href="/learn/ai-integration?tutorial=vlm">
                          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 hover:bg-white/20 transition-colors cursor-pointer">
                            <Eye className="w-8 h-8 mb-2" />
                            <h3 className="font-semibold mb-1">Vision AI</h3>
                            <p className="text-sm text-blue-100">Image Analysis</p>
                            <div className="flex items-center gap-2 mt-2">
                              <Badge className="bg-yellow-500 text-white">Intermediate</Badge>
                              <span className="text-xs">50 min</span>
                            </div>
                          </div>
                        </Link>
                        <Link href="/learn/ai-integration?tutorial=agents">
                          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 hover:bg-white/20 transition-colors cursor-pointer">
                            <Cpu className="w-8 h-8 mb-2" />
                            <h3 className="font-semibold mb-1">AI Agents</h3>
                            <p className="text-sm text-blue-100">Automation & More</p>
                            <div className="flex items-center gap-2 mt-2">
                              <Badge className="bg-red-500 text-white">Advanced</Badge>
                              <span className="text-xs">90 min</span>
                            </div>
                          </div>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Learning Progress Overview */}
                <div className="lg:col-span-3">
                  <LearningProgressCard
                    paths={learningPaths}
                    onPathSelect={handlePathSelect}
                    onContinueLearning={handleContinueLearning}
                    compact={true}
                  />
                </div>
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
                {achievements.map((achievement) => (
                  <div
                    key={achievement.id}
                  >
                    <AchievementCard
                      achievement={achievement}
                      showProgress={true}
                      onUnlock={(id) => console.log('Achievement unlocked:', id)}
                    />
                  </div>
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
          </div>
      </main>
    </div>
  )
}