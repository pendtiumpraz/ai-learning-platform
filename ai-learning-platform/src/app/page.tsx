import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  BookOpen,
  Brain,
  Gamepad2,
  Trophy,
  Users,
  Zap,
  ArrowRight,
  Star,
  Target,
  Sparkles
} from 'lucide-react'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900/20">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10" />
        <div className="container mx-auto px-4 py-20 relative">
          <div className="text-center max-w-4xl mx-auto">
            <Badge className="mb-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white border-0">
              <Sparkles className="w-4 h-4 mr-2" />
              Powered by Advanced AI
            </Badge>
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Learn Smarter,
              <br />
              Play Harder
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Experience the future of education with AI-powered adaptive learning paths,
              gamified challenges, and personalized content that grows with you.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-lg px-8 py-6">
                <BookOpen className="w-5 h-5 mr-2" />
                Start Learning
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-8 py-6">
                <Gamepad2 className="w-5 h-5 mr-2" />
                Try Demo Games
              </Button>
            </div>
          </div>
        </div>

        {/* Floating elements */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-blue-500/20 rounded-full animate-float" />
        <div className="absolute top-40 right-20 w-16 h-16 bg-purple-500/20 rounded-full animate-float" style={{ animationDelay: '1s' }} />
        <div className="absolute bottom-20 left-1/4 w-12 h-12 bg-pink-500/20 rounded-full animate-float" style={{ animationDelay: '2s' }} />
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">
              Why Choose <span className="text-gradient">AI Learning?</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Discover how our platform transforms education through cutting-edge AI and gamification
            </p>
          </div>

          <div className="grid grid-responsive-lg gap-8">
            <Card className="group hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20">
              <CardHeader className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-blue-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Brain className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-xl">AI-Powered Learning</CardTitle>
                <CardDescription>
                  Personalized content adapted to your learning style and pace
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center"><Star className="w-4 h-4 mr-2 text-yellow-500" /> Adaptive difficulty</li>
                  <li className="flex items-center"><Star className="w-4 h-4 mr-2 text-yellow-500" /> Smart recommendations</li>
                  <li className="flex items-center"><Star className="w-4 h-4 mr-2 text-yellow-500" /> Real-time feedback</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20">
              <CardHeader className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-purple-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Gamepad2 className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-xl">Gamified Experience</CardTitle>
                <CardDescription>
                  Learn through engaging games and earn rewards as you progress
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center"><Star className="w-4 h-4 mr-2 text-yellow-500" /> XP & Levels</li>
                  <li className="flex items-center"><Star className="w-4 h-4 mr-2 text-yellow-500" /> Achievements</li>
                  <li className="flex items-center"><Star className="w-4 h-4 mr-2 text-yellow-500" /> Leaderboards</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20">
              <CardHeader className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-green-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Target className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-xl">Personalized Paths</CardTitle>
                <CardDescription>
                  Custom learning journeys designed specifically for your goals
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center"><Star className="w-4 h-4 mr-2 text-yellow-500" /> Skill assessment</li>
                  <li className="flex items-center"><Star className="w-4 h-4 mr-2 text-yellow-500" /> Goal tracking</li>
                  <li className="flex items-center"><Star className="w-4 h-4 mr-2 text-yellow-500" /> Progress analytics</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20">
              <CardHeader className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-orange-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-xl">Social Learning</CardTitle>
                <CardDescription>
                  Connect with peers and learn together in a collaborative environment
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center"><Star className="w-4 h-4 mr-2 text-yellow-500" /> Study groups</li>
                  <li className="flex items-center"><Star className="w-4 h-4 mr-2 text-yellow-500" /> Friend challenges</li>
                  <li className="flex items-center"><Star className="w-4 h-4 mr-2 text-yellow-500" /> Share progress</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Join the Learning Revolution</h2>
            <p className="text-xl opacity-90">Be part of a community that's transforming education</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">10K+</div>
              <div className="text-blue-100">Active Learners</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">50+</div>
              <div className="text-blue-100">Subjects</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">100K+</div>
              <div className="text-blue-100">Lessons</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">95%</div>
              <div className="text-blue-100">Success Rate</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <Card className="max-w-4xl mx-auto text-center p-12 border-0 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20">
            <Trophy className="w-16 h-16 mx-auto mb-6 text-yellow-500" />
            <h2 className="text-4xl font-bold mb-4">
              Ready to Start Your Learning Adventure?
            </h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join thousands of learners who are already experiencing the future of education.
              No credit card required, start your free trial today!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-lg px-8 py-6">
                <Zap className="w-5 h-5 mr-2" />
                Start Free Trial
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-8 py-6">
                View Demo
              </Button>
            </div>
          </Card>
        </div>
      </section>
    </div>
  )
}