'use client';

import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Lightbulb, CheckCircle, Code, Play, RotateCcw, Eye } from 'lucide-react';
import type { TutorialStep } from '@/types';

interface PromptTutorialProps {
  tutorialId: string;
  steps: TutorialStep[];
  onComplete: () => void;
}

export default function PromptTutorial({ tutorialId, steps, onComplete }: PromptTutorialProps) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [userCode, setUserCode] = useState('');
  const [showHints, setShowHints] = useState(false);
  const [hintIndex, setHintIndex] = useState(0);
  const [showSolution, setShowSolution] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error' | 'info'; message: string } | null>(null);

  const currentStep = steps[currentStepIndex];
  const progress = ((currentStepIndex + 1) / steps.length) * 100;

  useEffect(() => {
    if (currentStep.code) {
      setUserCode(currentStep.code);
    }
  }, [currentStep]);

  const handleNext = () => {
    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
      resetStep();
    } else {
      onComplete();
    }
  };

  const handlePrevious = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1);
      resetStep();
    }
  };

  const resetStep = () => {
    setShowHints(false);
    setHintIndex(0);
    setShowSolution(false);
    setFeedback(null);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setFeedback(null);

    try {
      // Simulate validation logic
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Mock validation (replace with actual validation logic)
      const isValid = validateUserCode(userCode, currentStep);

      if (isValid) {
        setFeedback({ type: 'success', message: 'Excellent! Your solution is correct.' });
        currentStep.isCompleted = true;
      } else {
        setFeedback({ type: 'error', message: 'Not quite right. Try again or use a hint.' });
      }
    } catch (error) {
      setFeedback({ type: 'error', message: 'An error occurred while validating your code.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const validateUserCode = (code: string, step: TutorialStep): boolean => {
    // Basic validation logic (would be more sophisticated in real implementation)
    if (step.id === 'system-message') {
      return code.includes('system') && code.includes('role');
    }
    if (step.id === 'temperature-control') {
      return code.includes('temperature') && parseFloat(code.match(/temperature:\s*([\d.]+)/)?.[1] || '0') <= 1.0;
    }
    return true; // Default for demo
  };

  const showNextHint = () => {
    if (hintIndex < currentStep.hints.length - 1) {
      setHintIndex(hintIndex + 1);
    }
  };

  const resetCode = () => {
    setUserCode(currentStep.code || '');
    setFeedback(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold">Prompt Engineering Tutorial</h1>
            <div className="text-sm">
              Step {currentStepIndex + 1} of {steps.length}
            </div>
          </div>

          {/* Progress bar */}
          <div className="w-full bg-purple-300 bg-opacity-30 rounded-full h-2">
            <div
              className="bg-white h-2 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Tutorial Content */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center gap-3 mb-4">
                {currentStep.isCompleted && (
                  <CheckCircle className="w-6 h-6 text-green-600" />
                )}
                <h2 className="text-xl font-bold text-gray-900">
                  {currentStep.title}
                </h2>
              </div>

              <div className="prose max-w-none">
                <div className="text-gray-700 leading-relaxed">
                  {currentStep.content}
                </div>
              </div>

              {currentStep.explanation && (
                <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <h3 className="font-semibold text-blue-900 mb-2">Explanation</h3>
                  <p className="text-blue-800 text-sm">{currentStep.explanation}</p>
                </div>
              )}
            </div>

            {/* Code Example */}
            {currentStep.code && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Example Code</h3>
                <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
                  <code className="text-sm">{currentStep.code}</code>
                </pre>
              </div>
            )}

            {/* Navigation */}
            <div className="flex items-center justify-between">
              <button
                onClick={handlePrevious}
                disabled={currentStepIndex === 0}
                className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-4 h-4" />
                Previous
              </button>

              <button
                onClick={handleNext}
                disabled={!currentStep.isCompleted && currentStepIndex < steps.length - 1}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {currentStepIndex === steps.length - 1 ? 'Complete' : 'Next'}
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Interactive Exercise */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Your Turn - Try It Yourself
              </h3>

              {/* Code Editor */}
              <div className="mb-4">
                <textarea
                  value={userCode}
                  onChange={(e) => setUserCode(e.target.value)}
                  className="w-full h-64 p-4 font-mono text-sm bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Write your code here..."
                  spellCheck={false}
                />
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-2 mb-4">
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Play className="w-4 h-4" />
                  )}
                  Submit
                </button>

                <button
                  onClick={resetCode}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                >
                  <RotateCcw className="w-4 h-4" />
                  Reset
                </button>

                <button
                  onClick={() => setShowHints(!showHints)}
                  className="flex items-center gap-2 px-4 py-2 bg-yellow-100 text-yellow-700 rounded-lg hover:bg-yellow-200"
                >
                  <Lightbulb className="w-4 h-4" />
                  Hints ({currentStep.hints.length})
                </button>

                <button
                  onClick={() => setShowSolution(!showSolution)}
                  className="flex items-center gap-2 px-4 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200"
                >
                  <Eye className="w-4 h-4" />
                  Solution
                </button>
              </div>

              {/* Feedback */}
              {feedback && (
                <div className={`p-4 rounded-lg mb-4 ${
                  feedback.type === 'success' ? 'bg-green-50 text-green-800 border border-green-200' :
                  feedback.type === 'error' ? 'bg-red-50 text-red-800 border border-red-200' :
                  'bg-blue-50 text-blue-800 border border-blue-200'
                }`}>
                  {feedback.message}
                </div>
              )}

              {/* Hints Section */}
              {showHints && (
                <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200 mb-4">
                  <h4 className="font-semibold text-yellow-900 mb-2">Hints</h4>
                  <div className="space-y-2">
                    {currentStep.hints.slice(0, hintIndex + 1).map((hint, index) => (
                      <div key={index} className="text-yellow-800 text-sm">
                        {index + 1}. {hint}
                      </div>
                    ))}
                    {hintIndex < currentStep.hints.length - 1 && (
                      <button
                        onClick={showNextHint}
                        className="text-yellow-700 text-sm hover:text-yellow-900 font-medium"
                      >
                        Show next hint →
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* Solution Section */}
              {showSolution && (
                <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                  <h4 className="font-semibold text-purple-900 mb-2">Solution</h4>
                  <pre className="bg-purple-900 text-purple-100 p-3 rounded text-sm overflow-x-auto">
                    <code>{currentStep.code}</code>
                  </pre>
                </div>
              )}
            </div>

            {/* Quick Tips */}
            <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
              <h3 className="font-semibold text-blue-900 mb-3">Quick Tips</h3>
              <ul className="space-y-2 text-blue-800 text-sm">
                <li>• Read the instructions carefully before starting</li>
                <li>• Use the hints if you get stuck</li>
                <li>• Test your code before submitting</li>
                <li>• Learn from the solution when available</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}