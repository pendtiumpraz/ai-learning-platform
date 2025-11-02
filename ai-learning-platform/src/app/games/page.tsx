"use client"

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { GameType, GameResult } from '@/types/game'
import QuizGame from '@/components/games/quiz-game'
import WordChallenge from '@/components/games/word-challenge'
import MemoryGame from '@/components/games/memory-game'
import { Trophy, Target, Play, ArrowLeft, Star, Zap, Clock } from 'lucide-react'

const GAME_TYPES: GameType[] = [
  {
    id: 'quiz',
    name: 'Quiz Challenge',
    description: 'Tes pengetahuan umum dan teknologi dengan pertanyaan menarik',
    icon: '🧠',
    color: 'purple',
    difficulty: 'medium',
    estimatedTime: 5,
    maxPoints: 100,
    category: 'quiz'
  },
  {
    id: 'word-challenge',
    name: 'Word Challenge',
    description: 'Pelajari singkatan teknologi dan vocabulary penting',
    icon: '📚',
    color: 'green',
    difficulty: 'medium',
    estimatedTime: 8,
    maxPoints: 75,
    category: 'learning'
  },
  {
    id: 'memory-game',
    name: 'Memory Game',
    description: 'Tingkatkan memory dengan mencocokkan pasangan kartu',
    icon: '🎯',
    color: 'pink',
    difficulty: 'easy',
    estimatedTime: 3,
    maxPoints: 150,
    category: 'skill'
  }
]

export default function GamesPage() {
  const [selectedGame, setSelectedGame] = useState<GameType | null>(null)
  const [selectedDifficulty, setSelectedDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium')
  const [gameResults, setGameResults] = useState<GameResult[]>([])
  useEffect(() => {
    const saved = localStorage.getItem('gameResults')
    if (saved) {
      const results = JSON.parse(saved)
      setGameResults(results)
    }
  }, [])

  const handleGameComplete = (result: GameResult) => {
    const updatedResults = [...gameResults, result]
    setGameResults(updatedResults)
    localStorage.setItem('gameResults', JSON.stringify(updatedResults))
    setSelectedGame(null)
  }

  const handleGameExit = () => {
    setSelectedGame(null)
  }

  const getGameStats = () => {
    const totalGames = gameResults.length
    const totalPoints = gameResults.reduce((sum, result) => sum + result.pointsEarned, 0)
    const averageAccuracy = totalGames > 0
      ? gameResults.reduce((sum, result) => sum + result.accuracy, 0) / totalGames
      : 0
    const totalTime = gameResults.reduce((sum, result) => sum + result.timeSpent, 0)

    return { totalGames, totalPoints, averageAccuracy, totalTime }
  }

  const stats = getGameStats()

  const renderGameComponent = () => {
    if (!selectedGame) return null

    switch (selectedGame.id) {
      case 'quiz':
        return (
          <QuizGame
            onGameComplete={handleGameComplete}
            onGameExit={handleGameExit}
            difficulty={selectedDifficulty}
          />
        )
      case 'word-challenge':
        return (
          <WordChallenge
            onGameComplete={handleGameComplete}
            onGameExit={handleGameExit}
            difficulty={selectedDifficulty}
          />
        )
      case 'memory-game':
        return (
          <MemoryGame
            onGameComplete={handleGameComplete}
            onGameExit={handleGameExit}
            difficulty={selectedDifficulty}
          />
        )
      default:
        return null
    }
  }

  if (selectedGame) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Button
            variant="outline"
            onClick={handleGameExit}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Kembali ke Games
          </Button>
        </div>
        {renderGameComponent()}
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
            Learning Games Hub
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Tingkatkan pengetahuan dan skills kamu dengan games edukatif yang seru!
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white border-0">
            <CardContent className="p-6">
              <Trophy className="w-8 h-8 mb-3" />
              <div className="text-3xl font-bold mb-1">{stats.totalGames}</div>
              <div className="text-blue-100">Games Played</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white border-0">
            <CardContent className="p-6">
              <Star className="w-8 h-8 mb-3" />
              <div className="text-3xl font-bold mb-1">{stats.totalPoints}</div>
              <div className="text-green-100">Total Points</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white border-0">
            <CardContent className="p-6">
              <Target className="w-8 h-8 mb-3" />
              <div className="text-3xl font-bold mb-1">{stats.averageAccuracy.toFixed(1)}%</div>
              <div className="text-purple-100">Average Accuracy</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white border-0">
            <CardContent className="p-6">
              <Clock className="w-8 h-8 mb-3" />
              <div className="text-3xl font-bold mb-1">{Math.floor(stats.totalTime / 60)}m</div>
              <div className="text-orange-100">Time Played</div>
            </CardContent>
          </Card>
        </div>

        {/* Difficulty Selector */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-12">
          <h2 className="text-xl font-bold mb-4">Select Difficulty</h2>
          <div className="flex gap-4 flex-wrap">
            {(['easy', 'medium', 'hard'] as const).map((level) => (
              <Button
                key={level}
                variant={selectedDifficulty === level ? 'default' : 'outline'}
                onClick={() => setSelectedDifficulty(level)}
                className="capitalize"
              >
                {level === 'easy' && '🟢 '}
                {level === 'medium' && '🟡 '}
                {level === 'hard' && '🔴 '}
                {level}
              </Button>
            ))}
          </div>
        </div>

        {/* Games Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {GAME_TYPES.map((game) => (
            <Card
              key={game.id}
              className="group hover:shadow-xl transition-all duration-300 cursor-pointer border-2 border-transparent hover:border-blue-200"
              onClick={() => setSelectedGame(game)}
            >
              <CardHeader>
                <div className="flex items-center justify-between mb-2">
                  <div className="text-4xl">{game.icon}</div>
                  <Badge variant="secondary" className="capitalize">
                    {game.category}
                  </Badge>
                </div>
                <CardTitle className="text-xl">{game.name}</CardTitle>
                <CardDescription>{game.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-gray-500" />
                    <span>{game.estimatedTime} min</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-yellow-500" />
                    <span>{game.maxPoints} pts</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <Badge
                    variant="outline"
                    className={`capitalize ${
                      game.difficulty === 'easy'
                        ? 'border-green-500 text-green-600'
                        : game.difficulty === 'medium'
                        ? 'border-yellow-500 text-yellow-600'
                        : 'border-red-500 text-red-600'
                    }`}
                  >
                    {game.difficulty}
                  </Badge>
                  <Button className="group-hover:scale-105 transition-transform">
                    <Play className="w-4 h-4 mr-2" />
                    Play
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Recent Game Results */}
        {gameResults.length > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold mb-4">Recent Game Results</h2>
            <div className="space-y-3">
              {gameResults.slice(-5).reverse().map((result, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                    <div>
                      <div className="font-medium capitalize">{result.gameType.replace('-', ' ')}</div>
                      <div className="text-sm text-gray-500">
                        {result.correctAnswers}/{result.totalQuestions} correct • {Math.floor(result.timeSpent / 60)}m {result.timeSpent % 60}s
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-green-600">+{result.pointsEarned} pts</div>
                    <div className="text-sm text-gray-500">{result.accuracy.toFixed(0)}% accuracy</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}