import { Metadata } from 'next';
import { LevelFiveLearning } from '@/components/agent-learning/levels/level-five-learning';
import { getLearningPathByLevel } from '@/lib/agent-framework/learning-service';

export const metadata: Metadata = {
  title: 'Level 5: Enterprise Agent Orchestration - AI Learning Platform',
  description: 'Master enterprise-scale agent deployment, monitoring, and orchestration for production systems',
};

export default async function LevelFivePage() {
  const learningPath = await getLearningPathByLevel(5);

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="bg-red-100 text-red-800 px-4 py-2 rounded-full font-semibold">
              Level 5
            </div>
            <h1 className="text-3xl font-bold text-gray-900">
              Enterprise Agent Orchestration
            </h1>
          </div>
          <p className="text-lg text-gray-600 max-w-3xl">
            Become an expert in deploying, scaling, and managing enterprise-grade agent systems
            with advanced monitoring, security, and orchestration capabilities.
          </p>
        </div>

        <LevelFiveLearning learningPath={learningPath} />
      </div>
    </div>
  );
}