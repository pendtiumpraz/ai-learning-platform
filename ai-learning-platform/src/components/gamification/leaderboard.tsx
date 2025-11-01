"use client"

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Trophy,
  Medal,
  Award,
  Crown,
  TrendingUp,
  Users,
  Star,
  Zap,
  Globe,
  Friends,
  Target
} from 'lucide-react'
import { formatXP } from '@/lib/utils'

interface LeaderboardEntry {
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
}

interface LeaderboardProps {
  entries: LeaderboardEntry[]
  type?: 'global' | 'friends' | 'weekly' | 'category'
  category?: string
  showUserOnly?: boolean
  compact?: boolean
  onUserClick?: (user: LeaderboardEntry) => void
}

export function Leaderboard({
  entries,
  type = 'global',
  category,
  showUserOnly = false,
  compact = false,
  onUserClick
}: LeaderboardProps) {
  const [selectedTab, setSelectedTab] = useState<'all' | 'weekly' | 'friends'>('all')
  const [animatedEntries, setAnimatedEntries] = useState<LeaderboardEntry[]>([])

  useEffect(() => {
    setAnimatedEntries(entries)
  }, [entries])

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="h-6 w-6 text-yellow-500" />
      case 2:
        return <Medal className="h-6 w-6 text-gray-400" />
      case 3:
        return <Award className="h-6 w-6 text-amber-600" />
      default:
        return <span className="text-lg font-bold text-gray-600 dark:text-gray-400">#{rank}</span>
    }
  }

  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1:
        return 'from-yellow-400 to-amber-500 text-white'
      case 2:
        return 'from-gray-300 to-gray-500 text-white'
      case 3:
        return 'from-amber-600 to-orange-600 text-white'
      default:
        return 'from-gray-100 to-gray-200 text-gray-700 dark:from-gray-700 dark:to-gray-600 dark:text-gray-200'
    }
  }

  const getRankChange = (entry: LeaderboardEntry) => {
    const change = entry.previousRank - entry.rank
    if (change > 0) {
      return (
        <div className="flex items-center text-green-500 text-sm">
          <TrendingUp className="h-4 w-4 mr-1" />
          +{change}
        </div>
      )
    } else if (change < 0) {
      return (
        <div className="flex items-center text-red-500 text-sm">
          <TrendingUp className="h-4 w-4 mr-1 rotate-180" />
          {change}
        </div>
      )
    }
    return <div className="text-gray-400 text-sm">—</div>
  }

  const getLeaderboardTitle = () => {
    switch (type) {
      case 'global':
        return 'Global Leaderboard'
      case 'friends':
        return 'Friends Leaderboard'
      case 'weekly':
        return 'Weekly Challenge'
      case 'category':
        return `${category} Rankings`
      default:
        return 'Leaderboard'
    }
  }

  const getLeaderboardIcon = () => {
    switch (type) {
      case 'global':
        return <Globe className="h-5 w-5" />
      case 'friends':
        return <Friends className="h-5 w-5" />
      case 'weekly':
        return <TrendingUp className="h-5 w-5" />
      case 'category':
        return <Target className="h-5 w-5" />
      default:
        return <Trophy className="h-5 w-5" />
    }
  }

  const currentUserEntry = entries.find(entry => entry.isCurrentUser)
  const displayEntries = showUserOnly && currentUserEntry
    ? [currentUserEntry]
    : animatedEntries.slice(0, compact ? 5 : 10)

  if (compact) {
    return (
      <Card className="w-full">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center space-x-2">
              {getLeaderboardIcon()}
              <span>{getLeaderboardTitle()}</span>
            </CardTitle>
            <Badge variant="outline" size="sm">
              {entries.length} Players
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-2">
            {displayEntries.map((entry, index) => (
              <motion.div
                key={entry.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`flex items-center space-x-3 p-2 rounded-lg ${
                  entry.isCurrentUser
                    ? 'bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800'
                    : 'hover:bg-gray-50 dark:hover:bg-gray-800'
                } transition-colors cursor-pointer`}
                onClick={() => onUserClick?.(entry)}
              >
                <div className={`w-8 h-8 rounded-full bg-gradient-to-r ${getRankColor(entry.rank)} flex items-center justify-center text-sm font-bold`}>
                  {entry.rank <= 3 ? getRankIcon(entry.rank) : entry.rank}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2">
                    <img
                      src={entry.avatar}
                      alt={entry.username}
                      className="w-6 h-6 rounded-full"
                    />
                    <span className={`text-sm font-medium truncate ${
                      entry.isCurrentUser ? 'text-blue-600 dark:text-blue-400' : 'text-gray-900 dark:text-gray-100'
                    }`}>
                      {entry.username}
                    </span>
                    {entry.isCurrentUser && (
                      <Badge variant="secondary" size="sm">You</Badge>
                    )}
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-sm font-bold text-gray-900 dark:text-gray-100">
                    {formatXP(entry.totalXP)}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    Lv. {entry.level}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-2xl flex items-center space-x-3">
              {getLeaderboardIcon()}
              <span>{getLeaderboardTitle()}</span>
            </CardTitle>
            <CardDescription className="mt-1">
              {type === 'weekly' ? 'Top performers this week' : 'Top players by total XP'}
            </CardDescription>
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant="outline" className="px-3 py-1">
              <Users className="h-4 w-4 mr-1" />
              {entries.length} Players
            </Badge>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-2 mt-4">
          {(['all', 'weekly', 'friends'] as const).map((tab) => (
            <Button
              key={tab}
              variant={selectedTab === tab ? "default" : "ghost"}
              size="sm"
              onClick={() => setSelectedTab(tab)}
              className="capitalize"
            >
              {tab === 'all' && <Globe className="h-4 w-4 mr-2" />}
              {tab === 'weekly' && <TrendingUp className="h-4 w-4 mr-2" />}
              {tab === 'friends' && <Friends className="h-4 w-4 mr-2" />}
              {tab}
            </Button>
          ))}
        </div>
      </CardHeader>

      <CardContent>
        <div className="space-y-3">
          <AnimatePresence>
            {displayEntries.map((entry, index) => (
              <motion.div
                key={entry.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.1 }}
                className={`relative p-4 rounded-xl border-2 transition-all duration-200 ${
                  entry.isCurrentUser
                    ? 'border-blue-300 bg-blue-50 dark:border-blue-700 dark:bg-blue-900/20 shadow-lg'
                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 hover:shadow-md'
                } cursor-pointer`}
                onClick={() => onUserClick?.(entry)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {/* Top 3 Crown Effects */}
                {entry.rank <= 3 && (
                  <motion.div
                    className="absolute -top-2 -right-2"
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 2, repeat: Infinity, repeatDelay: index * 0.5 }}
                  >
                    {getRankIcon(entry.rank)}
                  </motion.div>
                )}

                <div className="flex items-center space-x-4">
                  {/* Rank Display */}
                  <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${getRankColor(entry.rank)} flex items-center justify-center font-bold text-lg shadow-md`}>
                    {entry.rank <= 3 ? getRankIcon(entry.rank) : entry.rank}
                  </div>

                  {/* User Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-3">
                      <img
                        src={entry.avatar}
                        alt={entry.username}
                        className="w-10 h-10 rounded-full border-2 border-white dark:border-gray-800 shadow-sm"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2">
                          <h3 className={`font-semibold truncate ${
                            entry.isCurrentUser ? 'text-blue-600 dark:text-blue-400' : 'text-gray-900 dark:text-gray-100'
                          }`}>
                            {entry.username}
                          </h3>
                          {entry.isCurrentUser && (
                            <Badge variant="default" size="sm">You</Badge>
                          )}
                          {entry.streak > 0 && (
                            <Badge variant="warning" size="sm">
                              <Zap className="h-3 w-3 mr-1" />
                              {entry.streak}
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center space-x-4 mt-1 text-sm text-gray-600 dark:text-gray-400">
                          <span>Level {entry.level}</span>
                          <span>{entry.badges} Badges</span>
                          <span>{entry.achievements} Achievements</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="text-right space-y-1">
                    <div className="text-xl font-bold text-gray-900 dark:text-gray-100">
                      {formatXP(entry.totalXP)}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {type === 'weekly' ? 'This Week' : 'Total XP'}
                    </div>
                    {getRankChange(entry)}
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mt-3">
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <motion.div
                      className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${(entry.totalXP / Math.max(...entries.map(e => e.totalXP))) * 100}%` }}
                      transition={{ duration: 1, delay: index * 0.1, ease: "easeOut" }}
                    />
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Show More Button */}
        {!compact && entries.length > 10 && (
          <div className="mt-6 text-center">
            <Button variant="outline" size="lg">
              Show More Players
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}