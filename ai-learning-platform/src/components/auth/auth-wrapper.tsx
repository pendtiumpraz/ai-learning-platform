"use client"

import React, { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { AlertCircle, BookOpen, Lock } from 'lucide-react'
import Link from 'next/link'

interface AuthWrapperProps {
  children: React.ReactNode
  title?: string
  description?: string
}

export default function AuthWrapper({ children, title = "Learning Content", description = "Please sign in to access this content" }: AuthWrapperProps) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [, setUser] = useState<any>(null)

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      // Enhanced cookie logging for debugging
      console.log('🔍 [AUTH-DEBUG] Starting auth check...')
      console.log('🔍 [AUTH-DEBUG] Document cookie:', document.cookie)
      
      // Simple token check first - just check if auth token exists
      const cookies = document.cookie.split(';')
      console.log('🔍 [AUTH-DEBUG] Parsed cookies:', cookies)
      
      const authCookie = cookies.find(cookie => cookie.trim().startsWith('auth-token='))
      console.log('🔍 [AUTH-DEBUG] Found auth cookie:', authCookie)

      if (!authCookie) {
        console.log('❌ [AUTH-DEBUG] No auth token found in cookies')
        console.log('❌ [AUTH-DEBUG] All cookies:', cookies.map(c => c.trim()))
        setIsAuthenticated(false)
        setIsLoading(false)
        return
      }

      // Token exists, now try to validate it with API
      console.log('🔍 [AUTH-DEBUG] Making API request to /api/auth/me')
      const response = await fetch('/api/auth/me', {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Cache-Control': 'no-cache'
        }
      })

      console.log('🔍 [AUTH-DEBUG] API response status:', response.status)
      console.log('🔍 [AUTH-DEBUG] API response headers:', Object.fromEntries(response.headers.entries()))

      if (response.ok) {
        const data = await response.json()
        console.log('✅ [AUTH-DEBUG] Auth check successful:', data.user?.email)
        setIsAuthenticated(true)
        setUser(data.user)
      } else {
        const errorText = await response.text()
        console.log('❌ [AUTH-DEBUG] API auth check failed, status:', response.status)
        console.log('❌ [AUTH-DEBUG] Error response:', errorText)
        setIsAuthenticated(false)
      }

    } catch (error) {
      console.error('❌ [AUTH-DEBUG] Auth check failed with exception:', error)
      console.error('❌ [AUTH-DEBUG] Error details:', {
        name: (error as any)?.name,
        message: (error as any)?.message,
        stack: (error as any)?.stack
      })
      setIsAuthenticated(false)
    } finally {
      console.log('🔍 [AUTH-DEBUG] Auth check completed, setting loading to false')
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Checking authentication...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mb-4">
              <Lock className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Authentication Required
            </CardTitle>
            <CardDescription className="text-gray-600">
              {description}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-medium text-blue-900">Why sign in?</h4>
                  <ul className="text-sm text-blue-700 mt-1 space-y-1">
                    <li>• Track your learning progress</li>
                    <li>• Save your tutorial progress</li>
                    <li>• Access personalized content</li>
                    <li>• Earn certificates and achievements</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="flex flex-col space-y-3">
              <Link href="/auth" className="w-full">
                <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white">
                  Sign In to Continue
                </Button>
              </Link>

              <div className="text-center text-sm text-gray-600">
                Don't have an account?{' '}
                <Link href="/auth" className="text-blue-600 hover:text-blue-800 font-medium">
                  Sign up for free
                </Link>
              </div>
            </div>

            <div className="border-t pt-4">
              <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
                <BookOpen className="w-4 h-4" />
                <span>Access {title.toLowerCase()} and more</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <>
      {children}
    </>
  )
}