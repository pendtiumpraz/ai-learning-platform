import { Metadata } from 'next';
import { LevelFourLearning } from '@/components/agent-learning/levels/level-four-learning';
import { getLearningPathByLevel } from '@/lib/agent-framework/learning-service';

export const metadata: Metadata = {
  title: 'Level 4: Agentic Workflows - AI Learning Platform',
  description: 'Build autonomous agentic workflows with decision-making capabilities and self-optimizing systems',
};

export default async function LevelFourPage() {
  const learningPath = await getLearningPathByLevel(4);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-red-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="bg-purple-100 text-purple-800 px-4 py-2 rounded-full font-semibold">
              Level 4
            </div>
            <h1 className="text-3xl font-bold text-gray-900">
              Agentic Workflows
            </h1>
          </div>
          <p className="text-lg text-gray-600 max-w-3xl">
            Create sophisticated autonomous systems that can make complex decisions,
            adapt to changing conditions, and optimize their own performance over time.
          </p>
        </div>

        <LevelFourLearning learningPath={learningPath} />
      </div>
    </div>
  );
}