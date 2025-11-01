import { Metadata } from 'next';
import { LevelThreeLearning } from '@/components/agent-learning/levels/level-three-learning';
import { getLearningPathByLevel } from '@/lib/agent-framework/learning-service';

export const metadata: Metadata = {
  title: 'Level 3: Multi-Agent Systems - AI Learning Platform',
  description: 'Design and implement multi-agent systems with communication, coordination, and collaboration patterns',
};

export default async function LevelThreePage() {
  const learningPath = await getLearningPathByLevel(3);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="bg-indigo-100 text-indigo-800 px-4 py-2 rounded-full font-semibold">
              Level 3
            </div>
            <h1 className="text-3xl font-bold text-gray-900">
              Multi-Agent Systems
            </h1>
          </div>
          <p className="text-lg text-gray-600 max-w-3xl">
            Master the art of creating teams of AI agents that can communicate, coordinate,
            and collaborate to solve complex problems beyond the capabilities of single agents.
          </p>
        </div>

        <LevelThreeLearning learningPath={learningPath} />
      </div>
    </div>
  );
}