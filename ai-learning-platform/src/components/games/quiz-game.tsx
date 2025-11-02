"use client"

import React, { useState, useEffect, useCallback } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Clock, Trophy, Target, Brain, Zap, CheckCircle, XCircle } from 'lucide-react'
import { GameQuestion, GameSession, GameResult } from '@/types/game'

interface QuizGameProps {
  onGameComplete: (result: GameResult) => void
  onGameExit: () => void
  difficulty: 'easy' | 'medium' | 'hard'
  category?: string
}

const QUIZ_QUESTIONS: Record<string, GameQuestion[]> = {
  'ai-basics': [
    {
      id: '1',
      question: 'Apa singkatan dari AI?',
      options: ['Artificial Intelligence', 'Automated Integration', 'Advanced Interface', 'Algorithmic Interaction'],
      correctAnswer: 0,
      explanation: 'AI adalah singkatan dari Artificial Intelligence (Kecerdasan Buatan)',
      category: 'ai-basics',
      difficulty: 'easy',
      points: 10,
      timeLimit: 30
    },
    {
      id: '2',
      question: 'Machine Learning adalah bagian dari?',
      options: ['Database Management', 'Artificial Intelligence', 'Web Development', 'Network Security'],
      correctAnswer: 1,
      explanation: 'Machine Learning merupakan subset dari Artificial Intelligence',
      category: 'ai-basics',
      difficulty: 'easy',
      points: 10,
      timeLimit: 30
    }
  ],
  'programming': [
    {
      id: '1',
      question: 'Manakah yang bukan bahasa pemrograman?',
      options: ['Python', 'JavaScript', 'HTML', 'Java'],
      correctAnswer: 2,
      explanation: 'HTML adalah markup language, bukan programming language',
      category: 'programming',
      difficulty: 'easy',
      points: 10,
      timeLimit: 20
    }
  ],
  'general': [
    {
      id: '1',
      question: 'Berapa jumlah planet di tata surya kita?',
      options: ['7', '8', '9', '10'],
      correctAnswer: 1,
      explanation: 'Tata surya kita memiliki 8 planet setelah Pluto diklasifikasikan ulang sebagai dwarf planet pada 2006',
      category: 'general',
      difficulty: 'easy',
      points: 10,
      timeLimit: 15
    }
  ]
}

export default function QuizGame({ onGameComplete, onGameExit, difficulty, category = 'general' }: QuizGameProps) {
  const [gameSession, setGameSession] = useState<GameSession | null>(null)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [showResult, setShowResult] = useState(false)
  const [timeRemaining, setTimeRemaining] = useState(30)
  const [score, setScore] = useState(0)
  const [correctAnswers, setCorrectAnswers] = useState(0)
  const [gameStarted, setGameStarted] = useState(false)

  const questions = QUIZ_QUESTIONS[category] || QUIZ_QUESTIONS['general'] || []
  const currentQuestion = gameSession?.questions?.[gameSession.currentQuestion] || questions[0]

  useEffect(() => {
    if (gameStarted && gameSession && gameSession.status === 'in_progress' && currentQuestion) {
      const timer = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            handleNextQuestion()
            return currentQuestion.timeLimit || 30
          }
          return prev - 1
        })
      }, 1000)

      return () => clearInterval(timer)
    }
    return undefined
  }, [gameStarted, gameSession, currentQuestion])

  const startGame = useCallback(() => {
    if (!questions || questions.length === 0) return
    
    const shuffledQuestions = [...questions]
      .sort(() => Math.random() - 0.5)
      .slice(0, 10)

    const session: GameSession = {
      id: `quiz-${Date.now()}`,
      userId: 'current-user', // This would come from auth context
      gameType: 'quiz',
      questions: shuffledQuestions,
      currentQuestion: 0,
      score: 0,
      answers: [],
      timeStarted: new Date(),
      status: 'in_progress',
      difficulty
    }

    setGameSession(session)
    setGameStarted(true)
    setTimeRemaining(shuffledQuestions[0]?.timeLimit || 30)
  }, [questions, difficulty])

  const handleAnswerSelect = (answerIndex: number) => {
    if (showResult || !currentQuestion) return

    setSelectedAnswer(answerIndex)
    setShowResult(true)

    const isCorrect = answerIndex === currentQuestion.correctAnswer

    if (isCorrect) {
      setScore(prev => prev + currentQuestion.points)
      setCorrectAnswers(prev => prev + 1)
    }

    // Update session
    if (gameSession) {
      const updatedSession = {
        ...gameSession,
        answers: [...gameSession.answers, answerIndex],
        score: score + (isCorrect ? currentQuestion.points : 0)
      }
      setGameSession(updatedSession)
    }
  }

  const handleNextQuestion = () => {
    if (!gameSession || !gameSession.questions) return

    if (gameSession.currentQuestion < gameSession.questions.length - 1) {
      const nextQuestion = gameSession.currentQuestion + 1
      const nextQuestionData = gameSession.questions[nextQuestion]
      if (!nextQuestionData) return
      
      const updatedSession = {
        ...gameSession,
        currentQuestion: nextQuestion
      }
      setGameSession(updatedSession)
      setSelectedAnswer(null)
      setShowResult(false)
      setTimeRemaining(nextQuestionData.timeLimit || 30)
    } else {
      // Game completed
      completeGame()
    }
  }

  const completeGame = () => {
    if (!gameSession) return

    const timeSpent = Math.floor((Date.now() - gameSession.timeStarted.getTime()) / 1000)
    const accuracy = (correctAnswers / gameSession.questions.length) * 100

    const result: GameResult = {
      sessionId: gameSession.id,
      gameType: gameSession.gameType,
      score: score,
      totalQuestions: gameSession.questions.length,
      correctAnswers: correctAnswers,
      timeSpent: timeSpent,
      accuracy: accuracy,
      pointsEarned: score,
      achievements: accuracy === 100 ? ['Perfect Score'] : []
    }

    onGameComplete(result)
  }

  const getProgressPercentage = () => {
    if (!gameSession || !gameSession.questions || gameSession.questions.length === 0) return 0
    return ((gameSession.currentQuestion + 1) / gameSession.questions.length) * 100
  }

  const getTimeColor = () => {
    if (timeRemaining > 20) return 'text-green-600'
    if (timeRemaining > 10) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getAnswerColor = (index: number) => {
    if (!showResult || !currentQuestion) {
      return selectedAnswer === index ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
    }

    if (index === currentQuestion.correctAnswer) {
      return 'border-green-500 bg-green-50'
    }

    if (selectedAnswer === index && index !== currentQuestion.correctAnswer) {
      return 'border-red-500 bg-red-50'
    }

    return 'border-gray-200 opacity-50'
  }

  if (!gameStarted) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Brain className="w-8 h-8 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold">Quiz Challenge</CardTitle>
          <CardDescription>
            Tes pengetahuan kamu dengan {questions.length} pertanyaan menarik!
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="p-4 bg-blue-50 rounded-lg">
              <Trophy className="w-6 h-6 text-blue-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-blue-600">{questions.length * 10}</div>
              <div className="text-sm text-blue-600">Max Points</div>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <Target className="w-6 h-6 text-green-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-green-600">{questions.length}</div>
              <div className="text-sm text-green-600">Questions</div>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg">
              <Clock className="w-6 h-6 text-purple-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-purple-600">~5</div>
              <div className="text-sm text-purple-600">Minutes</div>
            </div>
          </div>

          <div className="flex gap-4">
            <Button
              onClick={startGame}
              className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
            >
              Mulai Quiz
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
            {difficulty}
          </Badge>
          <div className={`flex items-center gap-2 ${getTimeColor()}`}>
            <Clock className="w-4 h-4" />
            <span className="font-mono font-bold">{timeRemaining}s</span>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">
              Question {gameSession?.currentQuestion! + 1} of {gameSession?.questions.length}
            </span>
            <span className="font-semibold">Score: {score}</span>
          </div>
          <Progress value={getProgressPercentage()} className="h-2" />
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="text-center">
          <h3 className="text-xl font-semibold mb-6">{currentQuestion?.question}</h3>
        </div>

        <div className="grid gap-3">
          {currentQuestion?.options.map((option, index) => (
            <Button
              key={index}
              variant="outline"
              className={`h-auto p-4 text-left justify-start transition-all ${getAnswerColor(index)}`}
              onClick={() => handleAnswerSelect(index)}
              disabled={showResult}
            >
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-sm font-bold ${
                    currentQuestion && index === currentQuestion.correctAnswer && showResult
                      ? 'border-green-500 bg-green-500 text-white'
                      : currentQuestion && selectedAnswer === index && index !== currentQuestion.correctAnswer && showResult
                      ? 'border-red-500 bg-red-500 text-white'
                      : 'border-gray-300'
                  }`}>
                    {String.fromCharCode(65 + index)}
                  </div>
                  <span>{option}</span>
                </div>
                {showResult && currentQuestion && index === currentQuestion.correctAnswer && (
                  <CheckCircle className="w-5 h-5 text-green-600" />
                )}
                {showResult && currentQuestion && selectedAnswer === index && index !== currentQuestion.correctAnswer && (
                  <XCircle className="w-5 h-5 text-red-600" />
                )}
              </div>
            </Button>
          ))}
        </div>

        {showResult && currentQuestion?.explanation && (
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-start gap-2">
              <Zap className="w-5 h-5 text-blue-600 mt-0.5" />
              <div>
                <div className="font-semibold text-blue-900 mb-1">Penjelasan:</div>
                <div className="text-blue-800">{currentQuestion.explanation}</div>
              </div>
            </div>
          </div>
        )}

        {showResult && (
          <Button
            onClick={handleNextQuestion}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          >
            {gameSession?.currentQuestion! < gameSession?.questions.length! - 1
              ? 'Next Question'
              : 'Complete Quiz'
            }
          </Button>
        )}
      </CardContent>
    </Card>
  )
}