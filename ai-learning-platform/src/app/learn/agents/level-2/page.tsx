import { Metadata } from 'next';
import { LevelTwoLearning } from '@/components/agent-learning/levels/level-two-learning';
import { getLearningPathByLevel } from '@/lib/agent-framework/learning-service';

export const metadata: Metadata = {
  title: 'Level 2: Tool-Using Agents - AI Learning Platform',
  description: 'Build advanced agents that can use tools, call functions, and integrate with external APIs',
};

export default async function LevelTwoPage() {
  const learningPath = await getLearningPathByLevel(2);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="bg-blue-100 text-blue-800 px-4 py-2 rounded-full font-semibold">
              Level 2
            </div>
            <h1 className="text-3xl font-bold text-gray-900">
              Tool-Using Agents
            </h1>
          </div>
          <p className="text-lg text-gray-600 max-w-3xl">
            Transform your agents into powerful tools that can interact with external systems,
            call APIs, search the web, and perform complex operations through function calling.
          </p>
        </div>

        <LevelTwoLearning learningPath={learningPath} />
      </div>
    </div>
  );
}