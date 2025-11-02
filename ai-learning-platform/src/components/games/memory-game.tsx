"use client"

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Clock, Brain, Target, Zap, RotateCcw, Eye, EyeOff } from 'lucide-react'
import { GameResult } from '@/types/game'

interface MemoryCard {
  id: string
  content: string
  category: string
  isFlipped: boolean
  isMatched: boolean
}

interface MemoryGameProps {
  onGameComplete: (result: GameResult) => void
  onGameExit: () => void
  difficulty: 'easy' | 'medium' | 'hard'
}

const MEMORY_CONTENT = {
  easy: [
    { content: 'AI', category: 'Technology' },
    { content: 'HTML', category: 'Programming' },
    { content: 'CSS', category: 'Programming' },
    { content: 'JS', category: 'Programming' },
    { content: 'API', category: 'Technology' },
    { content: 'SQL', category: 'Database' }
  ],
  medium: [
    { content: 'React', category: 'Framework' },
    { content: 'Node', category: 'Runtime' },
    { content: 'Mongo', category: 'Database' },
    { content: 'Docker', category: 'Container' },
    { content: 'Git', category: 'Version Control' },
    { content: 'AWS', category: 'Cloud' },
    { content: 'Redux', category: 'State Management' },
    { content: 'GraphQL', category: 'API' }
  ],
  hard: [
    { content: 'Kubernetes', category: 'Container Orchestration' },
    { content: 'TensorFlow', category: 'Machine Learning' },
    { content: 'Microservices', category: 'Architecture' },
    { content: 'Authentication', category: 'Security' },
    { content: 'Load Balancing', category: 'Networking' },
    { content: 'Continuous Integration', category: 'DevOps' },
    { content: 'Progressive Web App', category: 'Web Technology' },
    { content: 'Serverless Computing', category: 'Cloud Architecture' },
    { content: 'Blockchain', category: 'Distributed Systems' },
    { content: 'Machine Learning', category: 'AI' }
  ]
}

export default function MemoryGame({ onGameComplete, onGameExit, difficulty }: MemoryGameProps) {
  const [gameStarted, setGameStarted] = useState(false)
  const [cards, setCards] = useState<MemoryCard[]>([])
  const [flippedCards, setFlippedCards] = useState<string[]>([])
  const [matchedPairs, setMatchedPairs] = useState(0)
  const [moves, setMoves] = useState(0)
  const [score, setScore] = useState(0)
  const [timeRemaining, setTimeRemaining] = useState(120)
  const [gameStartTime, setGameStartTime] = useState<Date | null>(null)
  const [showCardsPreview, setShowCardsPreview] = useState(false)
  const [previewTime, setPreviewTime] = useState(0)

  const contentItems = MEMORY_CONTENT[difficulty]
  const totalPairs = contentItems.length

  useEffect(() => {
    if (gameStarted && timeRemaining > 0 && matchedPairs < totalPairs) {
      const timer = setTimeout(() => {
        setTimeRemaining(prev => prev - 1)
      }, 1000)
      return () => clearTimeout(timer)
    } else if (timeRemaining === 0 || matchedPairs === totalPairs) {
      completeGame()
    }
    return undefined
  }, [gameStarted, timeRemaining, matchedPairs, totalPairs])

  useEffect(() => {
    if (showCardsPreview && previewTime > 0) {
      const timer = setTimeout(() => {
        setPreviewTime(prev => prev - 1)
      }, 1000)
      return () => clearTimeout(timer)
    } else if (showCardsPreview && previewTime === 0) {
      setShowCardsPreview(false)
      hideAllCards()
    }
    return undefined
  }, [showCardsPreview, previewTime])

  const initializeGame = () => {
    const gameCards: MemoryCard[] = []

    contentItems.forEach((item, index) => {
      gameCards.push({
        id: `${index}-a`,
        content: item.content,
        category: item.category,
        isFlipped: false,
        isMatched: false
      })
      gameCards.push({
        id: `${index}-b`,
        content: item.content,
        category: item.category,
        isFlipped: false,
        isMatched: false
      })
    })

    // Shuffle cards
    const shuffled = gameCards.sort(() => Math.random() - 0.5)
    setCards(shuffled)
    setGameStarted(true)
    setGameStartTime(new Date())
    setMatchedPairs(0)
    setMoves(0)
    setScore(0)
    setTimeRemaining(120)

    // Show preview at start
    setShowCardsPreview(true)
    setPreviewTime(difficulty === 'easy' ? 5 : difficulty === 'medium' ? 7 : 10)
  }

  const hideAllCards = () => {
    setCards(prev => prev.map(card => ({ ...card, isFlipped: false })))
  }

  const handleCardClick = (cardId: string) => {
    if (showCardsPreview) return

    const card = cards.find(c => c.id === cardId)
    if (!card || card.isFlipped || card.isMatched || flippedCards.length >= 2) return

    const newFlippedCards = [...flippedCards, cardId]
    setFlippedCards(newFlippedCards)
    setMoves(prev => prev + 1)

    // Flip the card
    setCards(prev => prev.map(c =>
      c.id === cardId ? { ...c, isFlipped: true } : c
    ))

    if (newFlippedCards.length === 2) {
      // Check for match
      setTimeout(() => {
        checkForMatch(newFlippedCards)
      }, 1000)
    }
  }

  const checkForMatch = (flippedIds: string[]) => {
    const [firstId, secondId] = flippedIds
    const firstCard = cards.find(c => c.id === firstId)
    const secondCard = cards.find(c => c.id === secondId)

    if (firstCard && secondCard && firstCard.content === secondCard.content) {
      // Match found
      setCards(prev => prev.map(c =>
        c.id === firstId || c.id === secondId
          ? { ...c, isMatched: true }
          : c
      ))
      setMatchedPairs(prev => prev + 1)
      setScore(prev => prev + calculateMatchPoints())
    } else {
      // No match
      setCards(prev => prev.map(c =>
        c.id === firstId || c.id === secondId
          ? { ...c, isFlipped: false }
          : c
      ))
    }

    setFlippedCards([])
  }

  const calculateMatchPoints = () => {
    let basePoints = difficulty === 'easy' ? 10 : difficulty === 'medium' ? 15 : 20
    if (timeRemaining > 60) basePoints += 5
    if (moves <= totalPairs * 2) basePoints += 5
    return basePoints
  }

  const completeGame = () => {
    if (!gameStartTime) return

    const timeSpent = Math.floor((Date.now() - gameStartTime.getTime()) / 1000)
    const accuracy = matchedPairs > 0 ? ((matchedPairs / totalPairs) * 100) : 0

    const result: GameResult = {
      sessionId: `memory-game-${Date.now()}`,
      gameType: 'memory-game',
      score: score,
      totalQuestions: totalPairs,
      correctAnswers: matchedPairs,
      timeSpent: timeSpent,
      accuracy: accuracy,
      pointsEarned: score,
      achievements: accuracy === 100 ? ['Memory Master'] : []
    }

    onGameComplete(result)
  }

  const resetGame = () => {
    initializeGame()
  }

  const getProgressPercentage = () => {
    return totalPairs > 0 ? (matchedPairs / totalPairs) * 100 : 0
  }

  const getCardColor = (card: MemoryCard) => {
    if (card.isMatched) return 'bg-green-100 border-green-500'
    if (card.isFlipped || showCardsPreview) return 'bg-blue-100 border-blue-500'
    return 'bg-gray-50 border-gray-300 hover:bg-gray-100'
  }

  if (!gameStarted) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Brain className="w-8 h-8 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold">Memory Game</CardTitle>
          <CardDescription>
            Tingkatkan memory dengan mencocokkan pasangan kartu!
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="p-4 bg-purple-50 rounded-lg">
              <Target className="w-6 h-6 text-purple-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-purple-600">{totalPairs}</div>
              <div className="text-sm text-purple-600">Pairs</div>
            </div>
            <div className="p-4 bg-blue-50 rounded-lg">
              <Clock className="w-6 h-6 text-blue-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-blue-600">2:00</div>
              <div className="text-sm text-blue-600">Time Limit</div>
            </div>
            <div className="p-4 bg-pink-50 rounded-lg">
              <Zap className="w-6 h-6 text-pink-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-pink-600">{totalPairs * 25}</div>
              <div className="text-sm text-pink-600">Max Points</div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="p-3 bg-gray-50 rounded-lg">
              <div className="text-sm font-medium text-gray-700 mb-2">How to Play:</div>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Ingat posisi kartu yang ditampilkan di awal</li>
                <li>• Klik dua kartu untuk mencocokkan pasangan</li>
                <li>• Semakin sedikit moves, semakin tinggi score</li>
                <li>• Selesaikan sebelum waktu habis!</li>
              </ul>
            </div>
          </div>

          <div className="flex gap-4">
            <Button
              onClick={initializeGame}
              className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
            >
              Mulai Game
            </Button>
            <Button variant="outline" onClick={onGameExit}>
              Kembali
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between mb-4">
          <Badge variant="secondary" className="capitalize">
            {difficulty} • Memory Challenge
          </Badge>
          <div className={`flex items-center gap-2 ${timeRemaining < 30 ? 'text-red-600' : 'text-blue-600'}`}>
            <Clock className="w-4 h-4" />
            <span className="font-mono font-bold">
              {Math.floor(timeRemaining / 60)}:{(timeRemaining % 60).toString().padStart(2, '0')}
            </span>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">
              Pairs Found: {matchedPairs}/{totalPairs}
            </span>
            <span className="font-semibold">Score: {score} • Moves: {moves}</span>
          </div>
          <Progress value={getProgressPercentage()} className="h-2" />
        </div>

        {showCardsPreview && (
          <div className="text-center p-2 bg-yellow-50 rounded-lg">
            <div className="flex items-center justify-center gap-2 text-yellow-700">
              <Eye className="w-4 h-4" />
              <span className="text-sm font-medium">
                Memorize cards! {previewTime}s remaining
              </span>
            </div>
          </div>
        )}
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="grid gap-3" style={{
          gridTemplateColumns: `repeat(${Math.ceil(Math.sqrt(cards.length))}, minmax(0, 1fr))`
        }}>
          {cards.map((card) => (
            <div
              key={card.id}
              className={`aspect-square flex items-center justify-center rounded-lg border-2 cursor-pointer transition-all transform hover:scale-105 ${getCardColor(card)}`}
              onClick={() => handleCardClick(card.id)}
            >
              {card.isFlipped || card.isMatched || showCardsPreview ? (
                <div className="text-center p-2">
                  <div className="font-bold text-lg">{card.content}</div>
                  <div className="text-xs text-gray-600 mt-1">{card.category}</div>
                </div>
              ) : (
                <div className="text-gray-400">
                  <EyeOff className="w-6 h-6" />
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="flex gap-4">
          <Button variant="outline" onClick={resetGame} className="flex items-center gap-2">
            <RotateCcw className="w-4 h-4" />
            Reset Game
          </Button>
          <Button variant="outline" onClick={onGameExit}>
            Exit Game
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}