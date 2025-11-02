"use client"

import React, { useState, useEffect, useCallback } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Clock, BookOpen, Target, Zap, CheckCircle, XCircle, Lightbulb, Star } from 'lucide-react'
import { GameResult } from '@/types/game'

interface WordChallengeProps {
  onGameComplete: (result: GameResult) => void
  onGameExit: () => void
  difficulty: 'easy' | 'medium' | 'hard'
}

const WORD_CHALLENGES = {
  easy: [
    {
      word: 'AI',
      hint: 'Kecerdasan buatan dalam bahasa Inggris',
      answer: 'Artificial Intelligence',
      options: ['Artificial Intelligence', 'Automated Interface', 'Advanced Integration', 'Algorithmic Intelligence'],
      category: 'technology'
    },
    {
      word: 'HTML',
      hint: 'Bahasa markup untuk web',
      answer: 'HyperText Markup Language',
      options: ['HyperText Markup Language', 'High Tech Modern Language', 'Home Tool Markup Language', 'Hyperlink and Text Markup Language'],
      category: 'programming'
    }
  ],
  medium: [
    {
      word: 'API',
      hint: 'Interface untuk komunikasi antar software',
      answer: 'Application Programming Interface',
      options: ['Application Programming Interface', 'Automated Process Integration', 'Advanced Program Interface', 'Application Process Integration'],
      category: 'programming'
    }
  ],
  hard: [
    {
      word: 'HTTP',
      hint: 'Protocol untuk web communication',
      answer: 'HyperText Transfer Protocol',
      options: ['HyperText Transfer Protocol', 'High Tech Transfer Protocol', 'Home Tool Transfer Protocol', 'Hyperlink Text Transfer Protocol'],
      category: 'networking'
    }
  ]
}

interface ChallengeWord {
  word: string
  hint: string
  answer: string
  options: string[]
  category: string
}

export default function WordChallenge({ onGameComplete, onGameExit, difficulty }: WordChallengeProps) {
  const [gameStarted, setGameStarted] = useState(false)
  const [currentRound, setCurrentRound] = useState(0)
  const [score, setScore] = useState(0)
  const [correctAnswers, setCorrectAnswers] = useState(0)
  const [timeRemaining, setTimeRemaining] = useState(60)
  const [selectedOption, setSelectedOption] = useState<string | null>(null)
  const [showResult, setShowResult] = useState(false)
  const [showHint, setShowHint] = useState(false)
  const [usedHints, setUsedHints] = useState(0)
  const [gameStartTime, setGameStartTime] = useState<Date | null>(null)

  const challenges = WORD_CHALLENGES[difficulty] || WORD_CHALLENGES.easy
  const currentChallenge = challenges[currentRound] || challenges[0]

  useEffect(() => {
    if (gameStarted && timeRemaining > 0 && !showResult) {
      const timer = setTimeout(() => {
        setTimeRemaining(prev => prev - 1)
      }, 1000)
      return () => clearTimeout(timer)
    } else if (timeRemaining === 0 && !showResult) {
      handleTimeUp()
    }
  }, [gameStarted, timeRemaining, showResult])

  const startGame = () => {
    setGameStarted(true)
    setGameStartTime(new Date())
    setTimeRemaining(60)
  }

  const handleTimeUp = () => {
    setShowResult(true)
    setSelectedOption(null)
  }

  const handleOptionSelect = (option: string) => {
    if (showResult) return
    setSelectedOption(option)
    setShowResult(true)

    const isCorrect = option === currentChallenge.answer
    if (isCorrect) {
      const points = calculatePoints()
      setScore(prev => prev + points)
      setCorrectAnswers(prev => prev + 1)
    }
  }

  const calculatePoints = () => {
    let points = difficulty === 'easy' ? 10 : difficulty === 'medium' ? 15 : 20
    if (timeRemaining > 40) points += 5
    if (!showHint) points += 3
    return points
  }

  const handleShowHint = () => {
    if (!showHint && usedHints < 2) {
      setShowHint(true)
      setUsedHints(prev => prev + 1)
    }
  }

  const handleNextRound = () => {
    if (currentRound < challenges.length - 1) {
      setCurrentRound(prev => prev + 1)
      setSelectedOption(null)
      setShowResult(false)
      setShowHint(false)
      setTimeRemaining(60)
    } else {
      completeGame()
    }
  }

  const completeGame = () => {
    if (!gameStartTime) return

    const timeSpent = Math.floor((Date.now() - gameStartTime.getTime()) / 1000)
    const accuracy = (correctAnswers / challenges.length) * 100

    const result: GameResult = {
      sessionId: `word-challenge-${Date.now()}`,
      gameType: 'word-challenge',
      score: score,
      totalQuestions: challenges.length,
      correctAnswers: correctAnswers,
      timeSpent: timeSpent,
      accuracy: accuracy,
      pointsEarned: score,
      achievements: accuracy === 100 ? ['Word Master'] : []
    }

    onGameComplete(result)
  }

  const getProgressPercentage = () => ((currentRound + 1) / challenges.length) * 100

  const getOptionColor = (option: string) => {
    if (!showResult) {
      return selectedOption === option ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
    }

    if (option === currentChallenge.answer) {
      return 'border-green-500 bg-green-50'
    }

    if (selectedOption === option && option !== currentChallenge.answer) {
      return 'border-red-500 bg-red-50'
    }

    return 'border-gray-200 opacity-50'
  }

  if (!gameStarted) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-green-600 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <BookOpen className="w-8 h-8 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold">Word Challenge</CardTitle>
          <CardDescription>
            Tes vocabulary kamu dengan singkatan-singkatan teknologi!
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="p-4 bg-green-50 rounded-lg">
              <Target className="w-6 h-6 text-green-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-green-600">{challenges.length}</div>
              <div className="text-sm text-green-600">Challenges</div>
            </div>
            <div className="p-4 bg-blue-50 rounded-lg">
              <Clock className="w-6 h-6 text-blue-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-blue-600">60</div>
              <div className="text-sm text-blue-600">Seconds/Round</div>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg">
              <Star className="w-6 h-6 text-purple-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-purple-600">{difficulty === 'easy' ? 20 : difficulty === 'medium' ? 25 : 30}</div>
              <div className="text-sm text-purple-600">Max Points</div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="p-3 bg-gray-50 rounded-lg">
              <div className="text-sm font-medium text-gray-700 mb-2">How to Play:</div>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Temukan arti lengkap dari singkatan yang diberikan</li>
                <li>• Gunakan hint jika kesulitan (mengurangi points)</li>
                <li>• Jawaban lebih cepat mendapat bonus points</li>
                <li>• Pelajari singkatan teknologi yang umum digunakan</li>
              </ul>
            </div>
          </div>

          <div className="flex gap-4">
            <Button
              onClick={startGame}
              className="flex-1 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
            >
              Mulai Challenge
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
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between mb-4">
          <Badge variant="secondary" className="capitalize">
            {difficulty} • {currentChallenge.category}
          </Badge>
          <div className={`flex items-center gap-2 ${timeRemaining < 20 ? 'text-red-600' : 'text-blue-600'}`}>
            <Clock className="w-4 h-4" />
            <span className="font-mono font-bold">{timeRemaining}s</span>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">
              Round {currentRound + 1} of {challenges.length}
            </span>
            <span className="font-semibold">Score: {score}</span>
          </div>
          <Progress value={getProgressPercentage()} className="h-2" />
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="text-center space-y-4">
          <div className="text-4xl font-bold text-blue-600 mb-2">
            {currentChallenge.word}
          </div>

          <div className="text-gray-600 italic">
            "{currentChallenge.hint}"
          </div>

          <div className="flex justify-center gap-2">
            <Badge variant="outline">{currentChallenge.category}</Badge>
            <Badge variant="outline">Singkatan</Badge>
          </div>
        </div>

        <div className="grid gap-3">
          {currentChallenge.options.map((option, index) => (
            <Button
              key={index}
              variant="outline"
              className={`h-auto p-4 text-left justify-start transition-all ${getOptionColor(option)}`}
              onClick={() => handleOptionSelect(option)}
              disabled={showResult}
            >
              <div className="flex items-center justify-between w-full">
                <span>{option}</span>
                {showResult && option === currentChallenge.answer && (
                  <CheckCircle className="w-5 h-5 text-green-600" />
                )}
                {showResult && selectedOption === option && option !== currentChallenge.answer && (
                  <XCircle className="w-5 h-5 text-red-600" />
                )}
              </div>
            </Button>
          ))}
        </div>

        <div className="flex gap-3">
          {!showResult && !showHint && usedHints < 2 && (
            <Button
              variant="outline"
              onClick={handleShowHint}
              className="flex items-center gap-2"
            >
              <Lightbulb className="w-4 h-4" />
              Hint (-3 points)
            </Button>
          )}

          {showHint && !showResult && (
            <div className="flex-1 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
              <div className="flex items-start gap-2">
                <Lightbulb className="w-5 h-5 text-yellow-600 mt-0.5" />
                <div>
                  <div className="font-semibold text-yellow-900">Hint:</div>
                  <div className="text-yellow-800 text-sm">
                    {currentChallenge.answer.split(' ').map((word, index) => (
                      <span key={index}>
                        {index === 0 ? word[0] : word === 'Programming' ? 'Prog...' : word === 'Interface' ? 'Int...' : word === 'Transfer' ? 'Trans...' : word === 'Protocol' ? 'Proto...' : word[0] + '...'}{' '}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {showResult && (
          <div className="space-y-4">
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-start gap-2">
                <Zap className="w-5 h-5 text-blue-600 mt-0.5" />
                <div>
                  <div className="font-semibold text-blue-900">
                    {selectedOption === currentChallenge.answer ? 'Benar!' : 'Salah!'}
                  </div>
                  <div className="text-blue-800 text-sm">
                    Jawaban yang benar: <strong>{currentChallenge.answer}</strong>
                  </div>
                  {selectedOption === currentChallenge.answer && (
                    <div className="text-green-600 text-sm mt-1">
                      +{calculatePoints()} points
                    </div>
                  )}
                </div>
              </div>
            </div>

            <Button
              onClick={handleNextRound}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              {currentRound < challenges.length - 1 ? 'Next Round' : 'Complete Challenge'}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}