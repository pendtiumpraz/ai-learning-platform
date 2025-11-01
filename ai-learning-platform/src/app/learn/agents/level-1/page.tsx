import { Metadata } from 'next';
import { LevelOneLearning } from '@/components/agent-learning/levels/level-one-learning';
import { getLearningPathByLevel } from '@/lib/agent-framework/learning-service';

export const metadata: Metadata = {
  title: 'Level 1: Basic Agent Architecture - AI Learning Platform',
  description: 'Learn the fundamentals of AI agents, prompt engineering, and basic agent architecture patterns',
};

export default async function LevelOnePage() {
  const learningPath = await getLearningPathByLevel(1);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="bg-green-100 text-green-800 px-4 py-2 rounded-full font-semibold">
              Level 1
            </div>
            <h1 className="text-3xl font-bold text-gray-900">
              Basic Agent Architecture
            </h1>
          </div>
          <p className="text-lg text-gray-600 max-w-3xl">
            Master the fundamentals of AI agents, understand prompt engineering, and learn to build
            simple but effective prompt-based agents that can solve real-world problems.
          </p>
        </div>

        <LevelOneLearning learningPath={learningPath} />
      </div>
    </div>
  );
}