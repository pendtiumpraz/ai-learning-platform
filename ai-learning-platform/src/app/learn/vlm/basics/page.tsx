'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { ArrowLeft, RotateCcw, CheckCircle, Code, BookOpen, Upload, Image as ImageIcon } from 'lucide-react'

export default function VLMBasicsPage() {
  const [currentLesson, setCurrentLesson] = useState(0)
  const [completedLessons, setCompletedLessons] = useState<number[]>([])

  const lessons = [
    {
      id: 1,
      title: 'Introduction to Vision Language Models',
      description: 'Understanding what VLMs are and how they combine vision and language',
      duration: '20 min',
      content: {
        theory: 'Vision Language Models are AI systems that can both understand images and communicate about them using natural language. They bridge the gap between computer vision and natural language processing.',
        concepts: ['Multi-modal AI', 'Vision-Language Fusion', 'Visual Reasoning', 'Cross-modal Attention'],
        codeExample: `// Basic VLM API call
const analyzeImage = async (imageUrl, question) => {
  const response = await fetch('/api/vlm/analyze', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      image: imageUrl,
      prompt: question
    })
  });
  return response.json();
};`
      }
    },
    {
      id: 2,
      title: 'Image Analysis Fundamentals',
      description: 'Learn how VLMs analyze and understand image content',
      duration: '25 min',
      content: {
        theory: 'Image analysis in VLMs involves extracting features, identifying objects, understanding spatial relationships, and generating natural language descriptions of what the model "sees".',
        concepts: ['Object Detection', 'Feature Extraction', 'Scene Understanding', 'Spatial Relationships'],
        codeExample: `// Describe an image
const description = await analyzeImage(
  'https://example.com/image.jpg',
  'Describe what you see in this image in detail.'
);
console.log(description.text);
// Output: "This is a beautiful sunset over a mountain range..."`
      }
    },
    {
      id: 3,
      title: 'Object Detection and Recognition',
      description: 'Identify and locate objects within images using VLMs',
      duration: '30 min',
      content: {
        theory: 'Object detection combines computer vision techniques with language understanding to identify, classify, and locate multiple objects within an image.',
        concepts: ['Bounding Boxes', 'Classification', 'Confidence Scores', 'Multi-object Detection'],
        codeExample: `// Detect objects in image
const objects = await analyzeImage(
  imageUrl,
  'List all objects you can see and their locations.'
);
// Response includes object names, positions, and confidence levels
console.log(objects.items);`
      }
    },
    {
      id: 4,
      title: 'Scene Understanding and Context',
      description: 'Comprehend complex scenes and contextual relationships',
      duration: '25 min',
      content: {
        theory: 'Scene understanding goes beyond object detection to comprehend the overall context, activities, relationships, and meaning within visual scenes.',
        concepts: ['Context Analysis', 'Activity Recognition', 'Relationship Mapping', 'Semantic Understanding'],
        codeExample: `// Understand scene context
const context = await analyzeImage(
  imageUrl,
  'What is happening in this scene? Who are the people and what are they doing?'
);
console.log(context.analysis);`
      }
    },
    {
      id: 5,
      title: 'Visual Question Answering',
      description: 'Ask questions about images and get intelligent answers',
      duration: '20 min',
      content: {
        theory: 'Visual Question Answering (VQA) allows users to ask natural language questions about images and receive precise answers based on visual content.',
        concepts: ['Question Processing', 'Visual Reasoning', 'Answer Generation', 'Confidence Scoring'],
        codeExample: `// Ask questions about images
const answer = await analyzeImage(
  imageUrl,
  'What color is the car? How many people are in the image?'
);
console.log(answer.response);`
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
        <Link href="/learn/vlm">
          <Button variant="outline" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to VLM
          </Button>
        </Link>
        <div className="flex-1">
          <h1 className="text-3xl font-bold">VLM Basics</h1>
          <p className="text-muted-foreground">Learn the fundamentals of Vision Language Models</p>
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
                        ? 'bg-green-50 border-l-4 border-green-500'
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
                <div className="p-2 bg-green-100 rounded-lg">
                  <BookOpen className="w-6 h-6 text-green-600" />
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

              {/* Interactive Demo Section */}
              <div className="bg-green-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold mb-3">Try It Yourself</h3>
                <p className="text-muted-foreground mb-4">
                  Ready to practice what you've learned? Upload an image and ask questions to see VLM in action.
                </p>
                <Link href="/learn/vlm/playground">
                  <Button>
                    <ImageIcon className="w-4 h-4 mr-2" />
                    Open Vision Playground
                  </Button>
                </Link>
              </div>

              {/* Exercise Section */}
              <div className="bg-blue-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold mb-3">Practice Exercise</h3>
                <div className="space-y-3">
                  <p className="text-muted-foreground">
                    Try these exercises to reinforce your learning:
                  </p>
                  <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                    <li>Upload a photo and ask the VLM to describe it in detail</li>
                    <li>Ask specific questions about objects, colors, and actions in the image</li>
                    <li>Test the model's ability to count objects in complex scenes</li>
                    <li>Explore the model's understanding of spatial relationships</li>
                  </ul>
                  <Link href="/learn/vlm/playground">
                    <Button variant="outline" size="sm">
                      <Upload className="w-4 h-4 mr-2" />
                      Start Practice
                    </Button>
                  </Link>
                </div>
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