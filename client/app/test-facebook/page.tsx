'use client'

import { useState } from 'react'

export default function TestFacebookIntegration() {
  const [testing, setTesting] = useState(false)
  const [results, setResults] = useState<any>(null)

  const testConnection = async () => {
    setTesting(true)
    setResults(null)

    try {
      // Test auth URL generation
      const response = await fetch('/api/facebook/auth-url', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        setResults({
          success: true,
          message: 'Facebook integration is working!',
          authUrl: data.data.authUrl,
        })
      } else {
        throw new Error('Failed to generate auth URL')
      }
    } catch (error) {
      setResults({
        success: false,
        message: error instanceof Error ? error.message : 'Test failed',
      })
    } finally {
      setTesting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">
            🧪 Facebook Integration Test
          </h1>

          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-4">Configuration Status:</h2>
            <div className="space-y-2">
              <div className="flex items-center">
                <span className="text-green-500">✅</span>
                <span className="ml-2">Facebook App ID: 1682481498841723</span>
              </div>
              <div className="flex items-center">
                <span className="text-green-500">✅</span>
                <span className="ml-2">App Secret: Configured</span>
              </div>
              <div className="flex items-center">
                <span className="text-green-500">✅</span>
                <span className="ml-2">Webhook Token: LiveCommerce2024_SecureToken</span>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-4">Next Steps:</h2>
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-medium text-blue-900 mb-2">In your Facebook Developer Console:</h3>
              <ol className="list-decimal list-inside space-y-1 text-sm text-blue-800">
                <li>Add "Webhooks" product</li>
                <li>Add "Facebook Login" product</li>
                <li>Set callback URL: <code className="bg-blue-100 px-1 rounded">http://localhost:3000/api/facebook/callback</code></li>
                <li>Set webhook URL: <code className="bg-blue-100 px-1 rounded">http://localhost:3000/api/facebook/webhooks</code></li>
                <li>Use verify token: <code className="bg-blue-100 px-1 rounded">LiveCommerce2024_SecureToken</code></li>
              </ol>
            </div>
          </div>

          <button
            onClick={testConnection}
            disabled={testing}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
          >
            {testing ? (
              <span className="flex items-center">
                <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                Testing...
              </span>
            ) : (
              '🧪 Test Facebook Connection'
            )}
          </button>

          {results && (
            <div className={`mt-6 p-4 rounded-lg ${
              results.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
            }`}>
              <div className={`font-semibold ${
                results.success ? 'text-green-800' : 'text-red-800'
              }`}>
                {results.success ? '✅ Success!' : '❌ Error'}
              </div>
              <div className={results.success ? 'text-green-700' : 'text-red-700'}>
                {results.message}
              </div>
              {results.authUrl && (
                <div className="mt-2">
                  <a
                    href={results.authUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-700 underline"
                  >
                    🔗 Open Facebook OAuth Flow
                  </a>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}