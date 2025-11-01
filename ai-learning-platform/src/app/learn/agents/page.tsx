import { Metadata } from 'next';
import { AgentLearningDashboard } from '@/components/agent-learning/agent-learning-dashboard';
import { getLearningPaths } from '@/lib/agent-framework/learning-service';

export const metadata: Metadata = {
  title: 'AI Agents & Agentic Systems - AI Learning Platform',
  description: 'Master the art of building AI agents and agentic systems from basic prompt-based agents to enterprise-scale orchestration',
};

export default async function AgentsLearningPage() {
  const learningPaths = await getLearningPaths();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            AI Agents & Agentic Systems
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl">
            Master the art of building intelligent AI agents and sophisticated agentic systems.
            Learn from basic prompt-based agents to enterprise-scale multi-agent orchestration.
          </p>
        </div>

        <AgentLearningDashboard learningPaths={learningPaths} />
      </div>
    </div>
  );
}