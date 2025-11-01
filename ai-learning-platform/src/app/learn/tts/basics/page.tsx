'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { ArrowLeft, Play, RotateCcw, CheckCircle, Code, BookOpen } from 'lucide-react'

export default function TTSBasicsPage() {
  const [currentLesson, setCurrentLesson] = useState(0)
  const [completedLessons, setCompletedLessons] = useState<number[]>([])

  const lessons = [
    {
      id: 1,
      title: 'Introduction to Text-to-Speech',
      description: 'Understanding what TTS is and how it works',
      duration: '15 min',
      content: {
        theory: 'Text-to-Speech (TTS) technology converts written text into spoken audio. Modern TTS systems use neural networks to generate human-like speech patterns.',
        concepts: ['Neural TTS', 'Concatenative synthesis', 'Parametric synthesis'],
        codeExample: `// Basic TTS API call
const textToSpeech = async (text, voice = 'en-US-JennyNeural') => {
  const response = await fetch('/api/tts', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text, voice })
  });
  return response.blob();
};`
      }
    },
    {
      id: 2,
      title: 'API Integration Basics',
      description: 'Learn how to integrate TTS APIs into your applications',
      duration: '20 min',
      content: {
        theory: 'Integrating TTS APIs involves making HTTP requests to speech synthesis services and handling the returned audio data.',
        concepts: ['REST API calls', 'Authentication', 'Error handling', 'Response formats'],
        codeExample: `// Handling TTS responses
try {
  const audioBlob = await textToSpeech('Hello, world!', 'en-US-AriaNeural');
  const audioUrl = URL.createObjectURL(audioBlob);
  const audio = new Audio(audioUrl);
  await audio.play();
} catch (error) {
  console.error('TTS failed:', error);
}`
      }
    },
    {
      id: 3,
      title: 'Voice Selection and Customization',
      description: 'Choose the right voice for your application',
      duration: '25 min',
      content: {
        theory: 'Different voices are optimized for different use cases. Consider factors like accent, gender, age, and speaking style.',
        concepts: ['Voice characteristics', 'Language support', 'Accent variations', 'Voice quality'],
        codeExample: `// Voice selection with preferences
const voices = {
  professional: 'en-US-GuyNeural',
  friendly: 'en-US-JennyNeural',
  narrator: 'en-US-AriaNeural'
};

const selectVoice = (style) => voices[style] || voices.professional;`
      }
    },
    {
      id: 4,
      title: 'Audio Format and Quality',
      description: 'Understanding audio formats and quality settings',
      duration: '20 min',
      content: {
        theory: 'Audio quality depends on sample rate, bit depth, and compression. Choose formats based on your use case and bandwidth constraints.',
        concepts: ['MP3 vs WAV', 'Sample rates', 'Bit depth', 'Compression'],
        codeExample: `// Audio format configuration
const audioConfig = {
  format: 'mp3', // 'mp3', 'wav', 'ogg'
  sampleRate: 24000, // 16000, 22050, 24000, 48000
  bitRate: 128000, // 64000, 96000, 128000, 192000
  channels: 1 // 1 for mono, 2 for stereo
};`
      }
    }
  ]

  const progress = (completedLessons.length / lessons.length) * 100

  const completeLesson = (lessonId: number) => {
    if (!completedLessons.includes(lessonId)) {
      setCompletedLessons([...completedLessons, lessonId])
      if (lessonId < lessons.length - 1) {
        setCurrentLesson(lessonId + 1)
      }
    }
  }

  const currentLessonData = lessons[currentLesson] ?? lessons[0] ?? {
    id: 0,
    title: 'No Lesson Available',
    description: 'Lesson content not found',
    duration: '0 min',
    content: {
      theory: 'No content available.',
      concepts: [],
      codeExample: '// No example available'
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Link href="/learn/tts">
          <Button variant="outline" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to TTS
          </Button>
        </Link>
        <div className="flex-1">
          <h1 className="text-3xl font-bold">TTS Basics</h1>
          <p className="text-muted-foreground">Learn the fundamentals of text-to-speech</p>
        </div>
        <Badge variant="secondary">Beginner</Badge>
      </div>

      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium">Progress</span>
          <span className="text-sm text-muted-foreground">
            {completedLessons.length} of {lessons.length} completed
          </span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      {/* Lesson Navigation */}
      <div className="grid lg:grid-cols-4 gap-6">
        {/* Lessons Sidebar */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Lessons</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="space-y-1">
                {lessons.map((lesson, index) => (
                  <button
                    key={lesson.id}
                    onClick={() => setCurrentLesson(index)}
                    className={`w-full text-left p-4 transition-colors ${
                      currentLesson === index
                        ? 'bg-blue-50 border-l-4 border-blue-500'
                        : 'hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      {completedLessons.includes(lesson.id) ? (
                        <CheckCircle className="w-4 h-4 text-green-500" />
                      ) : (
                        <div className="w-4 h-4 rounded-full border-2 border-gray-300" />
                      )}
                      <div className="flex-1">
                        <h3 className="font-medium text-sm">{lesson.title}</h3>
                        <p className="text-xs text-muted-foreground">{lesson.duration}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <BookOpen className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <CardTitle>{currentLessonData.title}</CardTitle>
                  <CardDescription>{currentLessonData.description}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Theory Section */}
              <div>
                <h3 className="text-lg font-semibold mb-3">Theory</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {currentLessonData.content.theory}
                </p>
              </div>

              {/* Key Concepts */}
              <div>
                <h3 className="text-lg font-semibold mb-3">Key Concepts</h3>
                <div className="flex flex-wrap gap-2">
                  {currentLessonData.content.concepts.map((concept) => (
                    <Badge key={concept} variant="outline">
                      {concept}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Code Example */}
              <div>
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <Code className="w-5 h-5" />
                  Code Example
                </h3>
                <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm overflow-x-auto">
                  <pre>{currentLessonData.content.codeExample}</pre>
                </div>
              </div>

              {/* Interactive Demo Placeholder */}
              <div className="bg-blue-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold mb-3">Try It Yourself</h3>
                <p className="text-muted-foreground mb-4">
                  Ready to practice what you've learned? Visit our interactive playground to experiment with TTS.
                </p>
                <Link href="/learn/tts/playground">
                  <Button>
                    <Play className="w-4 h-4 mr-2" />
                    Open Playground
                  </Button>
                </Link>
              </div>

              {/* Lesson Navigation */}
              <div className="flex justify-between pt-4 border-t">
                <Button
                  variant="outline"
                  onClick={() => setCurrentLesson(Math.max(0, currentLesson - 1))}
                  disabled={currentLesson === 0}
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Previous
                </Button>
                <Button
                  onClick={() => completeLesson(currentLessonData.id)}
                  disabled={completedLessons.includes(currentLessonData.id)}
                >
                  {completedLessons.includes(currentLessonData.id) ? (
                    <>
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Completed
                    </>
                  ) : (
                    <>
                      Complete Lesson
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}