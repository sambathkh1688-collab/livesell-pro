'use client'

import { useEffect, useState } from 'react'
import { useFacebookErrorHandler } from '../hooks/useFacebookErrorHandler'

interface ErrorNotificationProps {
  onRetry?: () => Promise<void>
}

export default function FacebookErrorNotification({ onRetry }: ErrorNotificationProps) {
  const { error, isVisible, clearError, retry } = useFacebookErrorHandler()
  const [animationClass, setAnimationClass] = useState('')

  useEffect(() => {
    if (isVisible) {
      setAnimationClass('translate-x-0 opacity-100')
    } else {
      setAnimationClass('translate-x-full opacity-0')
    }
  }, [isVisible])

  if (!isVisible || !error) return null

  const getIconForType = (type: string) => {
    switch (type) {
      case 'auth_error': return '🔐'
      case 'api_error': return '🔧'
      case 'webhook_error': return '📡'
      case 'validation_error': return '⚠️'
      case 'network': return '🌐'
      default: return '❌'
    }
  }

  const getColorClassesForType = (type: string) => {
    switch (type) {
      case 'auth_error': return 'from-yellow-800/90 to-orange-800/90 border-yellow-500/50'
      case 'api_error': return 'from-red-800/90 to-red-900/90 border-red-500/50'
      case 'network': return 'from-blue-800/90 to-blue-900/90 border-blue-500/50'
      case 'validation_error': return 'from-purple-800/90 to-purple-900/90 border-purple-500/50'
      default: return 'from-red-800/90 to-red-900/90 border-red-500/50'
    }
  }

  const handleRetry = () => {
    if (onRetry) {
      retry(onRetry)
    }
  }

  return (
    <>
      {/* Backdrop */}
      <div className={`fixed inset-0 bg-black/20 backdrop-blur-sm z-40 transition-opacity duration-300 ${
        isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`} onClick={clearError} />
      
      {/* Error Notification */}
      <div className={`fixed top-4 right-4 max-w-md z-50 transition-all duration-500 ease-in-out transform ${animationClass}`}>
        <div className={`bg-gradient-to-br ${getColorClassesForType(error.type)} backdrop-blur-xl rounded-2xl border shadow-2xl overflow-hidden`}>
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-white/10">
            <div className="flex items-center space-x-3">
              <span className="text-2xl">{getIconForType(error.type)}</span>
              <h3 className="font-bold text-white text-lg">{error.title}</h3>
            </div>
            <button 
              onClick={clearError}
              className="text-gray-300 hover:text-white transition-colors p-1 rounded-lg hover:bg-white/10"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Content */}
          <div className="p-4">
            <p className="text-gray-200 mb-4">{error.message}</p>
            
            {/* Suggestions */}
            {error.suggestions.length > 0 && (
              <div className="mb-4">
                <h4 className="text-sm font-semibold text-gray-300 mb-2">💡 Suggestions:</h4>
                <ul className="space-y-1">
                  {error.suggestions.map((suggestion, index) => (
                    <li key={index} className="text-sm text-gray-300 flex items-start space-x-2">
                      <span className="text-emerald-400 mt-1">•</span>
                      <span>{suggestion}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center space-x-3">
              {onRetry && (
                <button
                  onClick={handleRetry}
                  className="bg-emerald-500/80 hover:bg-emerald-500 text-white px-4 py-2 rounded-xl font-medium transition-colors text-sm flex items-center space-x-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  <span>Retry</span>
                </button>
              )}
              
              <button
                onClick={clearError}
                className="bg-gray-500/50 hover:bg-gray-500/70 text-white px-4 py-2 rounded-xl font-medium transition-colors text-sm"
              >
                Dismiss
              </button>

              {error.type === 'auth_error' && (
                <a
                  href="/facebook"
                  className="bg-blue-500/80 hover:bg-blue-500 text-white px-4 py-2 rounded-xl font-medium transition-colors text-sm flex items-center space-x-2"
                >
                  <span>🔗</span>
                  <span>Reconnect</span>
                </a>
              )}
            </div>
          </div>

          {/* Progress bar for auto-dismiss */}
          {error.type !== 'auth_error' && (
            <div className="h-1 bg-white/10">
              <div className="h-full bg-gradient-to-r from-emerald-400 to-blue-400 animate-[shrink_10s_linear]"></div>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes shrink {
          from { width: 100%; }
          to { width: 0%; }
        }
        
        .animate-\\[shrink_10s_linear\\] {
          animation: shrink 10s linear;
        }
      `}</style>
    </>
  )
}