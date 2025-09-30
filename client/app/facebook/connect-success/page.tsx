'use client'

import { useEffect, useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

function FacebookConnectSuccessContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [saving, setSaving] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const code = searchParams.get('code')
    const state = searchParams.get('state')
    const error = searchParams.get('error')
    
    if (error) {
      setError(`Facebook OAuth error: ${error}`)
      setSaving(false)
      return
    }
    
    if (!code) {
      setError('No authorization code received from Facebook')
      setSaving(false)
      return
    }
    
    // Exchange code for access token
    exchangeCodeForToken(code, state)
  }, [searchParams])

  const exchangeCodeForToken = async (code: string, state: string | null) => {
    try {
      console.log('🔄 Exchanging Facebook OAuth code for access token...')
      
      // Call backend API to exchange code for access token
      const response = await fetch('/api/facebook/oauth/exchange', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          code,
          state,
          redirectUri: 'http://localhost:3000/facebook/connect-success'
        })
      })
      
      if (!response.ok) {
        throw new Error(`OAuth exchange failed: ${response.statusText}`)
      }
      
      const data = await response.json()
      
      if (data.success) {
        console.log('✅ Facebook OAuth successful!')
        console.log(`👤 User: ${data.user.name}`)
        console.log(`📱 Pages: ${data.pages.length}`)
        
        // Save to localStorage for immediate use
        localStorage.setItem('facebookAccessToken', data.accessToken)
        localStorage.setItem('facebookUser', JSON.stringify(data.user))
        localStorage.setItem('facebookPages', JSON.stringify(data.pages))
        
        setSaving(false)
        
        // Redirect to main Facebook page after 3 seconds
        setTimeout(() => {
          router.push('/facebook')
        }, 3000)
        
      } else {
        throw new Error(data.error || 'OAuth exchange failed')
      }
      
    } catch (error: any) {
      console.error('❌ Facebook OAuth failed:', error)
      setError(error.message)
      setSaving(false)
    }
  }

  const saveFacebookPages = async (accessToken: string, pages: any[]) => {
    try {
      const userToken = localStorage.getItem('accessToken')
      if (!userToken) {
        setError('Please log in again')
        setSaving(false)
        return
      }

      // Get user info from Facebook
      const userResponse = await fetch(
        `https://graph.facebook.com/v18.0/me?fields=id,name&access_token=${accessToken}`
      )
      
      if (!userResponse.ok) {
        throw new Error('Failed to get user info')
      }

      const userInfo = await userResponse.json()

      // Save to our backend
      const saveResponse = await fetch('/api/facebook/save-pages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${userToken}`,
        },
        body: JSON.stringify({
          facebookUserId: userInfo.id,
          facebookUserName: userInfo.name,
          accessToken,
          pages,
        }),
      })

      if (!saveResponse.ok) {
        const errorData = await saveResponse.json()
        throw new Error(errorData.error || 'Failed to save pages')
      }

      // Success - redirect to main Facebook page
      setTimeout(() => {
        router.push('/facebook?connected=true')
      }, 2000)

    } catch (err) {
      console.error('Save pages error:', err)
      setError(err instanceof Error ? err.message : 'Failed to save pages')
      setSaving(false)
    }
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
          <div className="text-4xl mb-4">❌</div>
          <h1 className="text-xl font-bold text-gray-900 mb-4">
            Connection Failed
          </h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => router.push('/facebook')}
            className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-gradient-to-r from-emerald-400/20 to-blue-400/20 rounded-full blur-xl animate-pulse delay-100"></div>
        <div className="absolute bottom-20 left-1/4 w-40 h-40 bg-gradient-to-r from-pink-400/20 to-purple-400/20 rounded-full blur-xl animate-pulse delay-200"></div>
      </div>

      <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl p-12 max-w-lg w-full text-center border border-white/20 relative z-10">
        {saving ? (
          <>
            <div className="text-6xl mb-6 animate-spin">🔄</div>
            <h1 className="text-3xl font-bold text-white mb-6">
              🚀 Connecting to Facebook
            </h1>
            <p className="text-blue-200 mb-8 text-lg">
              Processing your Facebook OAuth authentication...
            </p>
            <div className="flex items-center justify-center space-x-2 mb-6">
              <div className="w-3 h-3 bg-blue-400 rounded-full animate-bounce"></div>
              <div className="w-3 h-3 bg-purple-400 rounded-full animate-bounce delay-75"></div>
              <div className="w-3 h-3 bg-emerald-400 rounded-full animate-bounce delay-150"></div>
            </div>
            <div className="text-gray-300 text-sm">
              ⏳ Exchanging tokens and retrieving your Facebook pages...
            </div>
          </>
        ) : (
          <>
            <div className="text-6xl mb-6">🎉</div>
            <h1 className="text-3xl font-bold text-white mb-6">
              Facebook Connected Successfully!
            </h1>
            <p className="text-green-200 mb-8 text-lg">
              Your Facebook integration is now active and ready to crush SystemKH!
            </p>
            <div className="bg-green-500/20 border border-green-400/30 rounded-lg p-4 mb-6">
              <p className="text-green-300 font-semibold">✅ Authentication Complete</p>
              <p className="text-green-200 text-sm">Redirecting to your dashboard...</p>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default function FacebookConnectSuccess() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    }>
      <FacebookConnectSuccessContent />
    </Suspense>
  )
}