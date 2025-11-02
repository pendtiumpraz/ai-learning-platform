'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Image, Eye, Brain, Camera, Upload, ZoomIn, Download, BookOpen, CheckCircle } from 'lucide-react';

interface VLMLesson {
  id: string;
  title: string;
  description: string;
  duration: string;
  completed: boolean;
  content: string[];
  interactiveDemo?: boolean;
}

export default function VLMBasicsPage() {
  const [currentLesson, setCurrentLesson] = useState<string>('intro');
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const [lessons, setLessons] = useState<VLMLesson[]>([
    {
      id: 'intro',
      title: 'Introduction to Vision Language Models',
      description: 'Understanding how AI models can see and understand images',
      duration: '20 min',
      completed: false,
      content: [
        'What are Vision Language Models?',
        'Evolution from Computer Vision to VLMs',
        'Key Architectures and Approaches',
        'Real-world Applications'
      ]
    },
    {
      id: 'image-processing',
      title: 'Image Processing Fundamentals',
      description: 'How VLMs process and understand visual information',
      duration: '25 min',
      completed: false,
      content: [
        'Image Encoding Techniques',
        'Feature Extraction',
        'Attention Mechanisms for Vision',
        'Multi-modal Fusion'
      ]
    },
    {
      id: 'text-generation',
      title: 'Text Generation from Images',
      description: 'Generating descriptive text and answers from visual input',
      duration: '30 min',
      completed: false,
      content: [
        'Image Captioning',
        'Visual Question Answering',
        'Detailed Image Description',
        'Contextual Understanding'
      ]
    },
    {
      id: 'visual-reasoning',
      title: 'Visual Reasoning Tasks',
      description: 'Advanced reasoning capabilities with visual information',
      duration: '35 min',
      completed: false,
      content: [
        'Object Recognition and Counting',
        'Spatial Relationships',
        'Causal Reasoning from Images',
        'Mathematical Problem Solving'
      ]
    },
    {
      id: 'implementation',
      title: 'Building VLM Applications',
      description: 'Practical implementation of VLM-powered applications',
      duration: '40 min',
      completed: false,
      interactiveDemo: true,
      content: [
        'API Integration',
        'Prompt Engineering for VLMs',
        'Error Handling and Validation',
        'Performance Optimization'
      ]
    }
  ]);

  const handleLessonComplete = (lessonId: string) => {
    setLessons(prev => prev.map(lesson =>
      lesson.id === lessonId
        ? { ...lesson, completed: !lesson.completed }
        : lesson
    ));
  };

  const currentLessonData = lessons.find(l => l.id === currentLesson);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadedImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyzeImage = async () => {
    if (!uploadedImage) return;

    setIsAnalyzing(true);
    try {
      // Simulate VLM analysis
      await new Promise(resolve => setTimeout(resolve, 2000));

      setAnalysisResult(`This image shows what appears to be a professional workspace with modern technology. I can see various elements including computing devices, office furniture, and what looks like a collaborative environment. The lighting suggests indoor daytime conditions, and the overall composition indicates a professional or educational setting. The color palette consists of neutral tones with some accent colors from digital displays.`);
    } catch (error) {
      console.error('Error analyzing image:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-teal-600 to-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center gap-4 mb-4">
            <Link
              href="/learn/vlm"
              className="flex items-center gap-2 text-teal-100 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              Back to VLM
            </Link>
          </div>
          <h1 className="text-3xl font-bold mb-2">VLM Basics</h1>
          <p className="text-teal-100">Learn the fundamentals of Vision Language Models</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Lesson Navigation */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Lessons</h2>
              <div className="space-y-2">
                {lessons.map((lesson) => (
                  <button
                    key={lesson.id}
                    onClick={() => setCurrentLesson(lesson.id)}
                    className={`w-full text-left p-3 rounded-lg transition-all ${
                      currentLesson === lesson.id
                        ? 'bg-teal-100 border-teal-500 border-2'
                        : 'bg-gray-50 hover:bg-gray-100 border-2 border-transparent'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {lesson.completed && (
                          <CheckCircle className="w-4 h-4 text-green-600" />
                        )}
                        <div>
                          <h3 className="font-medium text-gray-900">{lesson.title}</h3>
                          <p className="text-sm text-gray-600">{lesson.duration}</p>
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-white rounded-lg shadow-sm p-6 mt-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Your Progress</h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Completed</span>
                  <span className="font-medium">
                    {lessons.filter(l => l.completed).length}/{lessons.length}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-teal-600 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${(lessons.filter(l => l.completed).length / lessons.length) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Lesson Content */}
          <div className="lg:col-span-2">
            {currentLessonData && (
              <div className="bg-white rounded-lg shadow-sm p-8">
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    {currentLessonData.title}
                  </h2>
                  <p className="text-gray-600 mb-4">{currentLessonData.description}</p>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span>{currentLessonData.duration}</span>
                    <span>•</span>
                    <span>{currentLessonData.content.length} topics</span>
                    {currentLessonData.interactiveDemo && (
                      <>
                        <span>•</span>
                        <span className="text-teal-600 font-medium">Interactive Demo</span>
                      </>
                    )}
                  </div>
                </div>

                {/* Lesson Topics */}
                <div className="space-y-6">
                  {currentLessonData.content.map((topic, index) => (
                    <div key={index} className="border-l-4 border-teal-500 pl-6">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {index + 1}. {topic}
                        </h3>
                        <button className="text-sm text-teal-600 hover:text-teal-700">
                          Learn more
                        </button>
                      </div>
                      <p className="text-gray-600 mb-3">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.
                      </p>
                      <div className="flex items-center gap-3">
                        <Eye className="w-4 h-4 text-gray-400" />
                        <button className="text-sm text-teal-600 hover:text-teal-700">
                          View examples
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Interactive Demo for Implementation Lesson */}
                {currentLessonData.id === 'implementation' && (
                  <div className="mt-8 pt-6 border-t border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Interactive Demo: Image Analysis</h3>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-medium text-gray-900 mb-3">Upload Image</h4>
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                          {uploadedImage ? (
                            <div className="space-y-3">
                              <img
                                src={uploadedImage}
                                alt="Uploaded"
                                className="w-full h-48 object-cover rounded-lg"
                              />
                              <button
                                onClick={() => setUploadedImage(null)}
                                className="text-sm text-red-600 hover:text-red-700"
                              >
                                Remove image
                              </button>
                            </div>
                          ) : (
                            <div className="space-y-3">
                              <Camera className="w-12 h-12 text-gray-400 mx-auto" />
                              <label className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors cursor-pointer">
                                <Upload className="w-4 h-4 inline mr-2" />
                                Choose Image
                                <input
                                  type="file"
                                  accept="image/*"
                                  onChange={handleImageUpload}
                                  className="hidden"
                                />
                              </label>
                              <p className="text-sm text-gray-500">or drag and drop</p>
                            </div>
                          )}
                        </div>
                      </div>

                      <div>
                        <h4 className="font-medium text-gray-900 mb-3">Analysis Result</h4>
                        <div className="bg-gray-50 rounded-lg p-4 h-48 overflow-y-auto">
                          {isAnalyzing ? (
                            <div className="flex items-center justify-center h-full">
                              <div className="text-center">
                                <Brain className="w-8 h-8 text-teal-600 mx-auto mb-2 animate-pulse" />
                                <p className="text-gray-600">Analyzing image...</p>
                              </div>
                            </div>
                          ) : analysisResult ? (
                            <p className="text-gray-700">{analysisResult}</p>
                          ) : (
                            <p className="text-gray-500 text-center">Upload an image to see analysis</p>
                          )}
                        </div>
                        <button
                          onClick={handleAnalyzeImage}
                          disabled={!uploadedImage || isAnalyzing}
                          className="mt-3 w-full px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                          <Eye className="w-4 h-4" />
                          {isAnalyzing ? 'Analyzing...' : 'Analyze Image'}
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="mt-8 pt-6 border-t border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="flex gap-3">
                      <button
                        onClick={() => handleLessonComplete(currentLessonData.id)}
                        className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${
                          currentLessonData.completed
                            ? 'bg-green-100 text-green-700 hover:bg-green-200'
                            : 'bg-teal-600 text-white hover:bg-teal-700'
                        }`}
                      >
                        {currentLessonData.completed ? (
                          <>
                            <CheckCircle className="w-4 h-4" />
                            Completed
                          </>
                        ) : (
                          <>
                            <BookOpen className="w-4 h-4" />
                            Mark Complete
                          </>
                        )}
                      </button>
                      <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2">
                        <Download className="w-4 h-4" />
                        Download Notes
                      </button>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          const currentIndex = lessons.findIndex(l => l.id === currentLesson);
                          if (currentIndex > 0) {
                            setCurrentLesson(lessons[currentIndex - 1].id);
                          }
                        }}
                        className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                        disabled={lessons.findIndex(l => l.id === currentLesson) === 0}
                      >
                        Previous
                      </button>
                      <button
                        onClick={() => {
                          const currentIndex = lessons.findIndex(l => l.id === currentLesson);
                          if (currentIndex < lessons.length - 1) {
                            setCurrentLesson(lessons[currentIndex + 1].id);
                          }
                        }}
                        className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
                        disabled={lessons.findIndex(l => l.id === currentLesson) === lessons.length - 1}
                      >
                        Next
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}