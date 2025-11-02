import AuthWrapper from '@/components/auth/auth-wrapper'
import { authService } from '@/lib/auth'
import { Button } from '@/components/ui/button'

function DashboardContent() {
  const user = authService.getCurrentUser()
  const token = authService.getToken()

  const handleLogout = async () => {
    console.log('🔐 [DASHBOARD] Logout button clicked')
    await authService.logout()
    window.location.reload()
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h1 className="text-3xl font-bold mb-4">🎉 Authentication Test Dashboard</h1>
          
          {user ? (
            <div className="space-y-4">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h2 className="text-xl font-semibold text-green-800 mb-2">✅ Successfully Authenticated!</h2>
                <div className="text-green-700">
                  <p><strong>Name:</strong> {user.name}</p>
                  <p><strong>Email:</strong> {user.email}</p>
                  <p><strong>Username:</strong> {user.username}</p>
                  <p><strong>Role:</strong> {user.role}</p>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-semibold text-blue-800 mb-2">🔑 Authentication Details:</h3>
                <div className="text-blue-700 text-sm">
                  <p><strong>Token:</strong> {token ? `${token.substring(0, 50)}...` : 'None'}</p>
                  <p><strong>Token Length:</strong> {token?.length || 0} characters</p>
                  <p><strong>Stored in:</strong> localStorage</p>
                </div>
              </div>

              <Button 
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                🚪 Logout
              </Button>
            </div>
          ) : (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <h2 className="text-xl font-semibold text-red-800 mb-2">❌ Not Authenticated</h2>
              <p className="text-red-700">No valid authentication credentials found.</p>
            </div>
          )}
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">🧪 Test Instructions</h2>
          <ol className="list-decimal list-inside space-y-2 text-gray-700">
            <li>Navigate to <a href="/auth/login" className="text-blue-600 hover:underline">/auth/login</a></li>
            <li>Try logging in with valid credentials</li>
            <li>You should be redirected here and see your user details</li>
            <li>The AuthWrapperSimple should now work correctly!</li>
          </ol>
        </div>
      </div>
    </div>
  )
}

export default function DashboardTest() {
  return (
    <AuthWrapper title="Dashboard Test">
      <DashboardContent />
    </AuthWrapper>
  )
}