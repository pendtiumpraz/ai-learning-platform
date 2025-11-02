// Simplified Authentication Service
// Uses localStorage for reliability during development

interface AuthUser {
  id: string
  email: string
  name: string
  username: string
  image?: string
  role: string
}

interface LoginResponse {
  message: string
  user: AuthUser
  token: string
}

class AuthService {
  private readonly TOKEN_KEY = 'auth-token'
  private readonly USER_KEY = 'auth-user'

  // Get current user from localStorage
  getCurrentUser(): AuthUser | null {
    try {
      const userStr = localStorage.getItem(this.USER_KEY)
      return userStr ? JSON.parse(userStr) : null
    } catch {
      return null
    }
  }

  // Get token from localStorage
  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY)
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    const token = this.getToken()
    const user = this.getCurrentUser()
    return !!(token && user)
  }

  // Login function
  async login(email: string, password: string): Promise<{ success: boolean; user?: AuthUser; error?: string }> {
    try {
      console.log('🔐 [AUTH-SERVICE] Attempting login for:', email)
      
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ email, password })
      })

      const data: LoginResponse = await response.json()

      if (response.ok && data.token) {
        console.log('✅ [AUTH-SERVICE] Login successful, storing credentials')
        
        // Store in localStorage
        localStorage.setItem(this.TOKEN_KEY, data.token)
        localStorage.setItem(this.USER_KEY, JSON.stringify(data.user))
        
        return { success: true, user: data.user }
      } else {
        console.log('❌ [AUTH-SERVICE] Login failed:', data.message)
        return { success: false, error: data.message || 'Login failed' }
      }
    } catch (error) {
      console.error('❌ [AUTH-SERVICE] Login error:', error)
      return { success: false, error: 'Network error. Please try again.' }
    }
  }

  // Logout function
  async logout(): Promise<void> {
    try {
      console.log('🔐 [AUTH-SERVICE] Logging out')
      
      // Call logout API
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include'
      })
    } catch (error) {
      console.error('❌ [AUTH-SERVICE] Logout API error:', error)
    } finally {
      // Always clear local storage
      localStorage.removeItem(this.TOKEN_KEY)
      localStorage.removeItem(this.USER_KEY)
      console.log('✅ [AUTH-SERVICE] Credentials cleared from localStorage')
    }
  }

  // Verify token with server
  async verifyToken(): Promise<boolean> {
    try {
      const token = this.getToken()
      if (!token) return false

      console.log('🔍 [AUTH-SERVICE] Verifying token with server')
      
      const response = await fetch('/api/auth/me', {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        console.log('✅ [AUTH-SERVICE] Token verified:', data.user?.email)
        
        // Update user data if needed
        if (data.user) {
          localStorage.setItem(this.USER_KEY, JSON.stringify(data.user))
        }
        
        return true
      } else {
        console.log('❌ [AUTH-SERVICE] Token verification failed:', response.status)
        this.logout() // Clear invalid credentials
        return false
      }
    } catch (error) {
      console.error('❌ [AUTH-SERVICE] Token verification error:', error)
      return false
    }
  }
}

// Export singleton instance
export const authService = new AuthService()

// Export types and functions for easy use
export type { AuthUser, LoginResponse }
export { AuthService }