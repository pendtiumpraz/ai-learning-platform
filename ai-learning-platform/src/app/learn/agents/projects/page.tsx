import { Metadata } from 'next';
import { AgentProjectsGallery } from '@/components/agent-learning/agent-projects-gallery';
import { getAgentProjects } from '@/lib/agent-framework/projects-service';

export const metadata: Metadata = {
  title: 'Real-World Agent Projects - AI Learning Platform',
  description: 'Explore and build real-world AI agent projects from customer service automation to content creation',
};

export default async function AgentProjectsPage() {
  const projects = await getAgentProjects();

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-red-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Real-World Agent Projects
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl">
            Build practical AI agents that solve real business problems. From customer service automation
            to intelligent data analysis, these projects will prepare you for production-ready agent development.
          </p>
        </div>

        <AgentProjectsGallery projects={projects} />
      </div>
    </div>
  );
}