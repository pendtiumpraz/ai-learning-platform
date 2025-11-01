import Link from 'next/link';
import { BookOpen, Code, Trophy, Zap, Users, Target } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Master <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">Large Language Models</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Interactive learning platform for LLM integration, prompt engineering, and AI development.
              Progress from basics to advanced implementation through hands-on exercises.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/learn/llm"
                className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-105 shadow-lg"
              >
                Start Learning
              </Link>
              <Link
                href="/playground"
                className="px-8 py-4 bg-white text-gray-900 font-semibold rounded-lg border-2 border-gray-300 hover:border-gray-400 transition-all transform hover:scale-105 shadow-lg"
              >
                Try Playground
              </Link>
            </div>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-blue-200 rounded-full opacity-20 animate-float"></div>
        <div className="absolute top-40 right-20 w-16 h-16 bg-purple-200 rounded-full opacity-20 animate-float" style={{animationDelay: '1s'}}></div>
        <div className="absolute bottom-10 left-1/4 w-24 h-24 bg-pink-200 rounded-full opacity-20 animate-float" style={{animationDelay: '2s'}}></div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-16">
          Why Choose Our Platform?
        </h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <BookOpen className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Progressive Learning</h3>
            <p className="text-gray-600">
              5 levels from beginner to expert, carefully structured to build your LLM skills step by step.
            </p>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
              <Code className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Interactive Playground</h3>
            <p className="text-gray-600">
              Real-time code editor with syntax highlighting and live LLM API testing for hands-on practice.
            </p>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
              <Target className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Prompt Engineering</h3>
            <p className="text-gray-600">
              Master advanced prompting techniques with guided tutorials and real-world examples.
            </p>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mb-4">
              <Trophy className="w-6 h-6 text-yellow-600" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Gamified Learning</h3>
            <p className="text-gray-600">
              Earn XP, unlock achievements, and climb leaderboards while learning valuable AI skills.
            </p>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
              <Zap className="w-6 h-6 text-red-600" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Real-time Feedback</h3>
            <p className="text-gray-600">
              Get instant validation and helpful hints as you work through exercises and challenges.
            </p>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
            <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
              <Users className="w-6 h-6 text-indigo-600" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Community Driven</h3>
            <p className="text-gray-600">
              Learn with others, share solutions, and participate in collaborative challenges.
            </p>
          </div>
        </div>
      </div>

      {/* Learning Levels Preview */}
      <div className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-4">
            Learning Path
          </h2>
          <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
            Master LLM development through our carefully structured 5-level program
          </p>

          <div className="grid md:grid-cols-5 gap-6">
            {[
              { level: 1, title: "LLM Basics", desc: "API setup, text generation", color: "from-green-400 to-green-600" },
              { level: 2, title: "Prompt Engineering", desc: "System messages, temperature", color: "from-blue-400 to-blue-600" },
              { level: 3, title: "Advanced Prompting", desc: "Few-shot, function calling", color: "from-purple-400 to-purple-600" },
              { level: 4, title: "Production", desc: "Error handling, optimization", color: "from-orange-400 to-orange-600" },
              { level: 5, title: "Custom Models", desc: "Fine-tuning, deployment", color: "from-red-400 to-red-600" }
            ].map((item) => (
              <div key={item.level} className="text-center">
                <div className={`w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r ${item.color} flex items-center justify-center text-white font-bold text-xl shadow-lg`}>
                  {item.level}
                </div>
                <h3 className="font-semibold mb-2">{item.title}</h3>
                <p className="text-sm text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 py-20">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Master LLM Development?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of learners advancing their AI skills
          </p>
          <Link
            href="/learn/llm"
            className="inline-block px-8 py-4 bg-white text-gray-900 font-semibold rounded-lg hover:bg-gray-100 transition-all transform hover:scale-105 shadow-xl"
          >
            Get Started Now
          </Link>
        </div>
      </div>
    </div>
  );
}