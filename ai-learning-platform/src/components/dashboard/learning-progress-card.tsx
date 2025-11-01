"use client"

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { LearningPath } from '@/types/agents'
import {
  BookOpen,
  Brain,
  Code,
  Target,
  Clock,
  TrendingUp,
  Play,
  Lock,
  CheckCircle,
  Star,
  Zap
} from 'lucide-react'

// Extended LearningPath interface for UI-specific properties
interface UILearningPath extends LearningPath {
  category: string
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
  isLocked: boolean
  icon: string
  color: string
}

interface LearningProgressCardProps {
  paths: UILearningPath[]
  onPathSelect: (pathId: string) => void
  onContinueLearning: (pathId: string, moduleId: string) => void
  compact?: boolean
}

export function LearningProgressCard({
  paths,
  onPathSelect,
  onContinueLearning,
  compact = false
}: LearningProgressCardProps) {
  const [selectedPath, setSelectedPath] = useState<string | null>(null)

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'from-green-400 to-emerald-500'
      case 'intermediate': return 'from-blue-400 to-indigo-500'
      case 'advanced': return 'from-purple-400 to-pink-500'
      case 'expert': return 'from-red-400 to-orange-500'
      default: return 'from-gray-400 to-gray-500'
    }
  }

  const getModuleIcon = (type: string) => {
    switch (type) {
      case 'video': return <Play className="h-4 w-4" />
      case 'reading': return <BookOpen className="h-4 w-4" />
      case 'exercise': return <Target className="h-4 w-4" />
      case 'project': return <Code className="h-4 w-4" />
      case 'quiz': return <Brain className="h-4 w-4" />
      default: return <BookOpen className="h-4 w-4" />
    }
  }

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'brain': return <Brain className="h-6 w-6" />
      case 'code': return <Code className="h-6 w-6" />
      case 'book': return <BookOpen className="h-6 w-6" />
      case 'target': return <Target className="h-6 w-6" />
      default: return <BookOpen className="h-6 w-6" />
    }
  }

  const activePaths = paths.filter(path => !path.isLocked && path.progress > 0)
  const completedPaths = paths.filter(path => path.progress === 100)

  if (compact) {
    return (
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center space-x-2">
            <BookOpen className="h-5 w-5" />
            <span>Learning Progress</span>
          </CardTitle>
          <CardDescription>
            {activePaths.length} active • {completedPaths.length} completed
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-3">
            {activePaths.slice(0, 3).map((path) => (
              <motion.div
                key={path.id}
                whileHover={{ scale: 1.02 }}
                className="p-3 border rounded-lg hover:shadow-md transition-all cursor-pointer"
                onClick={() => onPathSelect(path.id)}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <div className={`p-1 rounded bg-gradient-to-r ${getDifficultyColor(path.difficulty)}`}>
                      <div className="text-white text-xs">
                        {getIcon(path.icon)}
                      </div>
                    </div>
                    <span className="font-medium text-sm">{path.title}</span>
                  </div>
                  <Badge variant="secondary" size="sm">
                    {Math.round(path.progress)}%
                  </Badge>
                </div>
                <Progress
                  value={path.progress}
                  variant="success"
                  size="sm"
                />
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center space-x-2">
              <BookOpen className="h-6 w-6" />
              <span>Learning Paths</span>
            </CardTitle>
            <CardDescription className="mt-1">
              Continue your AI learning journey
            </CardDescription>
          </div>
          <div className="flex space-x-2">
            <Badge variant="outline">
              <TrendingUp className="h-3 w-3 mr-1" />
              {activePaths.length} Active
            </Badge>
            <Badge variant="success">
              <CheckCircle className="h-3 w-3 mr-1" />
              {completedPaths.length} Complete
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Current Learning Activity */}
        {paths.some(path => path.currentModule && !path.isLocked) && (
          <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
            <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">
              Continue Learning
            </h3>
            {paths.filter(path => path.currentModule && !path.isLocked).slice(0, 2).map((path) => (
              <motion.div
                key={path.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-3 last:mb-0"
              >
                <div className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg border border-blue-200 dark:border-blue-700">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg bg-gradient-to-r ${getDifficultyColor(path.difficulty)}`}>
                      <div className="text-white">
                        {getIcon(path.icon)}
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-gray-100">
                        {path.title}
                      </h4>
                      <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                        {getModuleIcon(path.currentModule!.type)}
                        <span>{path.currentModule!.title}</span>
                        <span>•</span>
                        <Clock className="h-3 w-3" />
                        <span>{path.currentModule!.duration}min</span>
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="default"
                    size="sm"
                    onClick={() => onContinueLearning(path.id, path.currentModule!.id)}
                  >
                    <Play className="h-4 w-4 mr-1" />
                    Resume
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Learning Paths Grid */}
        <div className="grid gap-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-gray-900 dark:text-gray-100">
              All Learning Paths
            </h3>
            <div className="flex space-x-2">
              {['All', 'Active', 'Completed'].map((filter) => (
                <Button
                  key={filter}
                  variant={selectedPath === filter ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setSelectedPath(filter)}
                >
                  {filter}
                </Button>
              ))}
            </div>
          </div>

          <div className="grid gap-3">
            {paths.slice(0, 4).map((path, index) => (
              <motion.div
                key={path.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02, shadow: "lg" }}
                className={`p-4 rounded-xl border-2 transition-all cursor-pointer ${
                  path.isLocked
                    ? 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 opacity-75'
                    : path.progress === 100
                    ? 'border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20'
                    : 'border-blue-200 dark:border-blue-800 bg-white dark:bg-gray-800 hover:shadow-lg'
                }`}
                onClick={() => !path.isLocked && onPathSelect(path.id)}
              >
                <div className="flex items-start space-x-4">
                  {/* Path Icon */}
                  <div className={`p-3 rounded-xl bg-gradient-to-r ${getDifficultyColor(path.difficulty)} ${
                    path.isLocked ? 'grayscale' : ''
                  } shadow-md`}>
                    <div className="text-white">
                      {getIcon(path.icon)}
                    </div>
                  </div>

                  {/* Path Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className={`font-semibold text-lg ${
                          path.isLocked
                            ? 'text-gray-500 dark:text-gray-400'
                            : 'text-gray-900 dark:text-gray-100'
                        }`}>
                          {path.title}
                        </h4>
                        <p className={`text-sm mt-1 ${
                          path.isLocked
                            ? 'text-gray-400 dark:text-gray-500'
                            : 'text-gray-600 dark:text-gray-400'
                        }`}>
                          {path.description}
                        </p>
                      </div>

                      {path.isLocked && (
                        <Lock className="h-5 w-5 text-gray-400 mt-1" />
                      )}
                    </div>

                    {/* Path Stats */}
                    <div className="flex items-center space-x-4 mt-3 text-sm">
                      <div className="flex items-center space-x-1">
                        <Badge variant="outline" size="sm">
                          {path.category}
                        </Badge>
                      </div>
                      <div className="flex items-center space-x-1 text-gray-600 dark:text-gray-400">
                        <Clock className="h-4 w-4" />
                        <span>{path.estimatedHours}h</span>
                      </div>
                      <div className="flex items-center space-x-1 text-purple-600 dark:text-purple-400">
                        <Zap className="h-4 w-4" />
                        <span>{path.xpReward} XP</span>
                      </div>
                    </div>

                    {/* Progress */}
                    {path.progress > 0 && (
                      <div className="mt-3">
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-600 dark:text-gray-400">
                            {path.completedModules}/{path.totalModules} modules
                          </span>
                          <span className="font-medium text-gray-900 dark:text-gray-100">
                            {Math.round(path.progress)}%
                          </span>
                        </div>
                        <Progress
                          value={path.progress}
                          variant={path.progress === 100 ? "success" : "default"}
                          size="sm"
                        />
                      </div>
                    )}

                    {/* Prerequisites */}
                    {path.prerequisites.length > 0 && (
                      <div className="mt-3 flex items-center space-x-2">
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          Prerequisites:
                        </span>
                        <div className="flex space-x-1">
                          {path.prerequisites.map((prereq, idx) => (
                            <Badge key={idx} variant="outline" size="sm">
                              {prereq}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Call to Action */}
                <div className="mt-4 flex items-center justify-between">
                  {path.progress === 100 ? (
                    <div className="flex items-center space-x-2 text-green-600 dark:text-green-400">
                      <CheckCircle className="h-5 w-5" />
                      <span className="font-medium">Completed</span>
                      <Star className="h-4 w-4 fill-current" />
                    </div>
                  ) : path.currentModule ? (
                    <Button
                      variant="default"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation()
                        onContinueLearning(path.id, path.currentModule!.id)
                      }}
                    >
                      <Play className="h-4 w-4 mr-1" />
                      Continue
                    </Button>
                  ) : path.isLocked ? (
                    <Button variant="outline" size="sm" disabled>
                      <Lock className="h-4 w-4 mr-1" />
                      Locked
                    </Button>
                  ) : (
                    <Button
                      variant="default"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation()
                        onPathSelect(path.id)
                      }}
                    >
                      <Play className="h-4 w-4 mr-1" />
                      Start
                    </Button>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Show More Button */}
        {paths.length > 4 && (
          <div className="text-center mt-6">
            <Button variant="outline" size="lg">
              View All Learning Paths
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}