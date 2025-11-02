'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import LandingNavbar from '@/components/landing-navbar'
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
  Sparkles,
  Check,
  Phone,
  Mail,
  MapPin,
  Shield,
  Award,
  TrendingUp,
  DollarSign,
  Cpu,
  HeartHandshake,
  GraduationCap,
  Code,
  Palette,
} from 'lucide-react'

export default function HomePage() {
  const router = useRouter()

  useEffect(() => {
    // Check if user is logged in and redirect accordingly
    const checkAuthStatus = async () => {
      try {
        const response = await fetch('/api/auth/me')
        if (response.ok) {
          // User is logged in, redirect to dashboard
          router.push('/dashboard')
        }
        // If not logged in, stay on landing page
      } catch (error) {
        // User is not logged in, stay on landing page
        console.log('User not authenticated')
      }
    }

    checkAuthStatus()
  }, [router])

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900/20">
      <LandingNavbar />

      {/* Hero Section */}
      <section id="home" className="relative overflow-hidden pt-16">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10" />
        <div className="container mx-auto px-4 py-20 relative">
          <div className="text-center max-w-5xl mx-auto">
            <Badge className="mb-6 bg-gradient-to-r from-blue-500 to-purple-600 text-white border-0 animate-pulse">
              <Sparkles className="w-4 h-4 mr-2" />
              🎉 Limited Time: Get 50% Off Premium Plans
            </Badge>
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Transform Your Learning with
              <br />
              AI-Powered Education
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-10 max-w-3xl mx-auto">
              Experience the future of education with adaptive learning paths,
              gamified challenges, and personalized content that grows with you.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Button
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-lg px-8 py-6 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
                onClick={() => router.push('/auth')}
              >
                <BookOpen className="w-5 h-5 mr-2" />
                Start Learning Free
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="text-lg px-8 py-6 border-2 hover:border-green-500 hover:text-green-600 transition-all duration-300"
                onClick={() => window.location.href = '/games'}
              >
                <Gamepad2 className="w-5 h-5 mr-2" />
                Play Games
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="text-lg px-8 py-6 border-2 hover:border-blue-500 hover:text-blue-600 transition-all duration-300"
                onClick={() => scrollToSection('pricing')}
              >
                <Trophy className="w-5 h-5 mr-2" />
                View Pricing Plans
              </Button>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-blue-600 mb-1">10K+</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Active Students</div>
              </div>
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-purple-600 mb-1">500+</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Courses Available</div>
              </div>
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-green-600 mb-1">98%</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Success Rate</div>
              </div>
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-orange-600 mb-1">24/7</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">AI Support</div>
              </div>
            </div>
          </div>
        </div>

        {/* Floating elements */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-blue-500/20 rounded-full animate-float" />
        <div className="absolute top-40 right-20 w-16 h-16 bg-purple-500/20 rounded-full animate-float" style={{ animationDelay: '1s' }} />
        <div className="absolute bottom-20 left-1/4 w-12 h-12 bg-pink-500/20 rounded-full animate-float" style={{ animationDelay: '2s' }} />
      </section>

      {/* Features Section */}
      <section id="features" className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-gradient-to-r from-green-500 to-teal-600 text-white border-0">
              <Star className="w-4 h-4 mr-2" />
              Features
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Why Choose <span className="text-gradient">AI Learning?</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Discover how our platform transforms education through cutting-edge AI and gamification
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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
                  <li className="flex items-center"><Check className="w-4 h-4 mr-2 text-green-500" /> Adaptive difficulty</li>
                  <li className="flex items-center"><Check className="w-4 h-4 mr-2 text-green-500" /> Smart recommendations</li>
                  <li className="flex items-center"><Check className="w-4 h-4 mr-2 text-green-500" /> Real-time feedback</li>
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
                  <li className="flex items-center"><Check className="w-4 h-4 mr-2 text-green-500" /> XP & Levels</li>
                  <li className="flex items-center"><Check className="w-4 h-4 mr-2 text-green-500" /> Achievements</li>
                  <li className="flex items-center"><Check className="w-4 h-4 mr-2 text-green-500" /> Leaderboards</li>
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
                  <li className="flex items-center"><Check className="w-4 h-4 mr-2 text-green-500" /> Skill assessment</li>
                  <li className="flex items-center"><Check className="w-4 h-4 mr-2 text-green-500" /> Goal tracking</li>
                  <li className="flex items-center"><Check className="w-4 h-4 mr-2 text-green-500" /> Progress analytics</li>
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
                  <li className="flex items-center"><Check className="w-4 h-4 mr-2 text-green-500" /> Study groups</li>
                  <li className="flex items-center"><Check className="w-4 h-4 mr-2 text-green-500" /> Friend challenges</li>
                  <li className="flex items-center"><Check className="w-4 h-4 mr-2 text-green-500" /> Share progress</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-pink-50 to-pink-100 dark:from-pink-900/20 dark:to-pink-800/20">
              <CardHeader className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-pink-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Shield className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-xl">Data Security</CardTitle>
                <CardDescription>
                  Your data is protected with enterprise-grade security
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center"><Check className="w-4 h-4 mr-2 text-green-500" /> End-to-end encryption</li>
                  <li className="flex items-center"><Check className="w-4 h-4 mr-2 text-green-500" /> GDPR compliant</li>
                  <li className="flex items-center"><Check className="w-4 h-4 mr-2 text-green-500" /> Privacy controls</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-teal-50 to-teal-100 dark:from-teal-900/20 dark:to-teal-800/20">
              <CardHeader className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-teal-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Award className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-xl">Expert Instructors</CardTitle>
                <CardDescription>
                  Learn from industry professionals and experienced teachers
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center"><Check className="w-4 h-4 mr-2 text-green-500" /> Certified trainers</li>
                  <li className="flex items-center"><Check className="w-4 h-4 mr-2 text-green-500" /> Live Q&A sessions</li>
                  <li className="flex items-center"><Check className="w-4 h-4 mr-2 text-green-500" /> Mentoring programs</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-gradient-to-r from-yellow-500 to-orange-600 text-white border-0">
              <DollarSign className="w-4 h-4 mr-2" />
              Pricing
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Choose Your Perfect Plan
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Start for free, upgrade when you're ready to unlock advanced features
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Free Plan */}
            <Card className="relative hover:shadow-xl transition-all duration-300 border-2 border-gray-200 dark:border-gray-700">
              <CardHeader className="text-center pb-6">
                <CardTitle className="text-2xl font-bold">Free</CardTitle>
                <div className="text-4xl font-bold text-center">
                  $0
                  <span className="text-lg text-muted-foreground">/month</span>
                </div>
                <CardDescription className="text-lg">
                  Perfect for getting started
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <ul className="space-y-3 mb-6">
                  <li className="flex items-start">
                    <Check className="w-5 h-5 mr-3 text-green-500 mt-0.5" />
                    <span className="text-sm">Access to 50+ courses</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="w-5 h-5 mr-3 text-green-500 mt-0.5" />
                    <span className="text-sm">Basic AI recommendations</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="w-5 h-5 mr-3 text-green-500 mt-0.5" />
                    <span className="text-sm">Community support</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="w-5 h-5 mr-3 text-green-500 mt-0.5" />
                    <span className="text-sm">Progress tracking</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="w-5 h-5 mr-3 text-green-500 mt-0.5" />
                    <span className="text-sm">Mobile app access</span>
                  </li>
                </ul>
                <Button
                  size="lg"
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  onClick={() => router.push('/auth')}
                >
                  Start Free Trial
                </Button>
              </CardContent>
            </Card>

            {/* Professional Plan */}
            <Card className="relative hover:shadow-xl transition-all duration-300 border-2 border-blue-500 transform scale-105">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-1 text-sm font-medium">
                  Most Popular
                </Badge>
              </div>
              <CardHeader className="text-center pb-6">
                <CardTitle className="text-2xl font-bold">Professional</CardTitle>
                <div className="text-4xl font-bold text-center">
                  $19.99
                  <span className="text-lg text-muted-foreground">/month</span>
                </div>
                <CardDescription className="text-lg">
                  For serious learners
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <ul className="space-y-3 mb-6">
                  <li className="flex items-start">
                    <Check className="w-5 h-5 mr-3 text-green-500 mt-0.5" />
                    <span className="text-sm font-medium">Everything in Free, plus:</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="w-5 h-5 mr-3 text-green-500 mt-0.5" />
                    <span className="text-sm">Unlimited course access</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="w-5 h-5 mr-3 text-green-500 mt-0.5" />
                    <span className="text-sm">Advanced AI personalization</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="w-5 h-5 mr-3 text-green-500 mt-0.5" />
                    <span className="text-sm">1-on-1 mentorship sessions</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="w-5 h-5 mr-3 text-green-500 mt-0.5" />
                    <span className="text-sm">Priority support</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="w-5 h-5 mr-3 text-green-500 mt-0.5" />
                    <span className="text-sm">Certificate of completion</span>
                  </li>
                </ul>
                <Button
                  size="lg"
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  onClick={() => router.push('/auth')}
                >
                  Start Professional Trial
                </Button>
              </CardContent>
            </Card>

            {/* Enterprise Plan */}
            <Card className="relative hover:shadow-xl transition-all duration-300 border-2 border-purple-500">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-gradient-to-r from-purple-500 to-pink-600 text-white px-4 py-1 text-sm font-medium">
                  Best Value
                </Badge>
              </div>
              <CardHeader className="text-center pb-6">
                <CardTitle className="text-2xl font-bold">Enterprise</CardTitle>
                <div className="text-4xl font-bold text-center">
                  $49.99
                  <span className="text-lg text-muted-foreground">/month</span>
                </div>
                <CardDescription className="text-lg">
                  For teams and organizations
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <ul className="space-y-3 mb-6">
                  <li className="flex items-start">
                    <Check className="w-5 h-5 mr-3 text-green-500 mt-0.5" />
                    <span className="text-sm font-medium">Everything in Professional, plus:</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="w-5 h-5 mr-3 text-green-500 mt-0.5" />
                    <span className="text-sm">Custom course creation</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="w-5 h-5 mr-3 text-green-500 mt-0.5" />
                    <span className="text-sm">White-label options</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="w-5 h-5 mr-3 text-green-500 mt-0.5" />
                    <span className="text-sm">Dedicated account manager</span>
                  </li>
                  <li className="flex-items-start">
                    <Check className="w-5 h-5 mr-3 text-green-500 mt-0.5" />
                    <span className="text-sm">API access</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="w-5 h-5 mr-3 text-green-500 mt-0.5" />
                    <span className="text-sm">Custom integrations</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="w-5 h-5 mr-3 text-green-500 mt-0.5" />
                    <span className="text-sm">24/7 phone support</span>
                  </li>
                </ul>
                <Button
                  size="lg"
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                  onClick={() => router.push('/auth')}
                >
                  Contact Sales
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="text-center mt-12">
            <Badge className="bg-gradient-to-r from-green-500 to-teal-600 text-white border-0">
              <HeartHandshake className="w-4 h-4 mr-2" />
              Money-back Guarantee
            </Badge>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
              Try any plan risk-free for 30 days. No credit card required.
            </p>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-gradient-to-r from-indigo-500 to-blue-600 text-white border-0">
              <GraduationCap className="w-4 h-4 mr-2" />
              About Us
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Empowering Learners Worldwide
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              We're on a mission to make quality education accessible to everyone through AI technology
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
            <div>
              <h3 className="text-2xl font-bold mb-6">Our Story</h3>
              <p className="text-lg text-gray-700 dark:text-gray-300 mb-6">
                Founded in 2024, AI Learning Platform emerged from a simple idea: what if education could adapt to each learner's unique needs?
                Our team of educators, data scientists, and engineers have built a platform that personalizes learning
                at scale, making education more effective and enjoyable for everyone.
              </p>
              <p className="text-lg text-gray-700 dark:text-gray-300 mb-8">
                Today, we're proud to serve thousands of learners across the globe, helping them achieve their goals
                through innovative AI-powered courses and gamified learning experiences.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button onClick={() => scrollToSection('pricing')}>
                  View Pricing
                </Button>
                <Button variant="outline" onClick={() => scrollToSection('contact')}>
                  Contact Us
                </Button>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div className="text-center p-6 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                <TrendingUp className="w-12 h-12 mx-auto mb-4 text-blue-600" />
                <div className="text-3xl font-bold text-blue-600 mb-2">10,000+</div>
                <div className="text-gray-600 dark:text-gray-400">Active Students</div>
              </div>
              <div className="text-center p-6 bg-purple-50 dark:bg-purple-900/20 rounded-xl">
                <Cpu className="w-12 h-12 mx-auto mb-4 text-purple-600" />
                <div className="text-3xl font-bold text-purple-600 mb-2">500+</div>
                <div className="text-gray-600 dark:text-gray-400">AI Courses</div>
              </div>
              <div className="text-center p-6 bg-green-50 dark:bg-green-900/20 rounded-xl">
                <Target className="w-12 h-12 mx-auto mb-4 text-green-600" />
                <div className="text-3xl font-bold text-green-600 mb-2">98%</div>
                <div className="text-gray-600 dark:text-gray-400">Success Rate</div>
              </div>
              <div className="text-center p-6 bg-orange-50 dark:bg-orange-900/20 rounded-xl">
                <Users className="w-12 h-12 mx-auto mb-4 text-orange-600" />
                <div className="text-3xl font-bold text-orange-600 mb-2">50+</div>
                <div className="text-gray-600 dark:text-gray-400">Expert Instructors</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-white/20 text-white border-0">
              <Phone className="w-4 h-4 mr-2" />
              Get in Touch
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              We're Here to Help
            </h2>
            <p className="text-xl opacity-90 max-w-2xl mx-auto">
              Have questions? We'd love to hear from you.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <Card className="p-8 text-center bg-white/10 backdrop-blur-sm border-white/20">
              <Phone className="w-12 h-12 mx-auto mb-4 text-white" />
              <h3 className="text-xl font-bold mb-4 text-white">Call Us</h3>
              <p className="text-lg text-white/90 mb-6">
                <a href="tel:+6281319504441" className="hover:text-yellow-300 transition-colors">
                  +62 813-195-0441
                </a>
              </p>
              <p className="text-sm text-white/70">
                Mon-Fri: 9AM-6PM<br />
                Sat-Sun: 10AM-4PM
              </p>
            </Card>

            <Card className="p-8 text-center bg-white/10 backdrop-blur-sm border-white/20">
              <Mail className="w-12 h-12 mx-auto mb-4 text-white" />
              <h3 className="text-xl font-bold mb-4 text-white">Email Us</h3>
              <p className="text-lg text-white/90 mb-6">
                <a href="mailto:team@ailearning.id" className="hover:text-yellow-300 transition-colors">
                  team@ailearning.id
                </a>
              </p>
              <p className="text-sm text-white/70">
                We respond within 24 hours
              </p>
            </Card>

            <Card className="p-8 text-center bg-white/10 backdrop-blur-sm border-white/20">
              <MapPin className="w-12 h-12 mx-auto mb-4 text-white" />
              <h3 className="text-xl font-bold mb-4 text-white">Visit Us</h3>
              <p className="text-lg text-white/90 mb-6">
                Jl. Sudirman No. 123<br />
                Jakarta, Indonesia 12345
              </p>
              <p className="text-sm text-white/70">
                By appointment only
              </p>
            </Card>
          </div>

          <div className="mt-16 text-center">
            <p className="text-lg opacity-90">
              Ready to start your learning journey?
            </p>
            <Button
              size="lg"
              className="mt-6 bg-white text-blue-600 hover:bg-gray-100 px-8 py-6"
              onClick={() => router.push('/auth')}
            >
              <Zap className="w-5 h-5 mr-2" />
              Start Your Free Trial Today
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20">
        <div className="container mx-auto px-4">
          <Card className="max-w-4xl mx-auto text-center p-12 border-0 shadow-2xl">
            <Trophy className="w-16 h-16 mx-auto mb-6 text-yellow-500" />
            <Badge className="mb-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white border-0">
              <Star className="w-4 h-4 mr-2" />
              Join 10,000+ Happy Learners
            </Badge>
            <h2 className="text-4xl font-bold mb-4">
              Ready to Transform Your Future?
            </h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join thousands of learners who are already experiencing the future of education.
              Start your free trial today and see the difference for yourself!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-lg px-8 py-6 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
                onClick={() => router.push('/auth')}
              >
                <Zap className="w-5 h-5 mr-2" />
                Start Your Free Trial
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="text-lg px-8 py-6 border-2 hover:border-blue-500 hover:text-blue-600 transition-all duration-300"
                onClick={() => scrollToSection('contact')}
              >
                <Phone className="w-5 h-5 mr-2" />
                Talk to Sales
              </Button>
            </div>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <Brain className="w-6 h-6 text-white" />
                </div>
                <span className="text-xl font-bold">AI Learning Platform</span>
              </div>
              <p className="text-gray-400">
                Transform your learning journey with AI-powered personalized education.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Platform</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#features" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#pricing" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#about" className="hover:text-white transition-colors">About</a></li>
                <li><a href="#contact" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Courses</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Programming</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Design</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Business</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Language</a></li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Connect</h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <a href="mailto:team@ailearning.id" className="text-gray-400 hover:text-white transition-colors">
                    <Mail className="w-5 h-5" />
                  </a>
                  <a href="tel:+6281319504441" className="text-gray-400 hover:text-white transition-colors">
                    <Phone className="w-5 h-5" />
                  </a>
                </div>
                <div className="flex space-x-4">
                  <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">
                    <BookOpen className="w-5 h-5" />
                  </a>
                  <a href="#" className="text-gray-400 hover:text-blue-600 transition-colors">
                    <Code className="w-5 h-5" />
                  </a>
                  <a href="#" className="text-gray-400 hover:text-pink-600 transition-colors">
                    <Palette className="w-5 h-5" />
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center text-center text-gray-400">
              <p>&copy; 2024 AI Learning Platform. All rights reserved.</p>
              <div className="flex space-x-6 mt-4 md:mt-0">
                <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
                <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
                <a href="#" className="hover:text-white transition-colors">Cookie Policy</a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}