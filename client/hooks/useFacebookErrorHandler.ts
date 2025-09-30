'use client'

import { useState, useCallback } from 'react'

interface FacebookErrorDisplay {
  title: string
  message: string
  suggestions: string[]
  type: string
}

interface ErrorState {
  isVisible: boolean
  error: FacebookErrorDisplay | null
}

export const useFacebookErrorHandler = () => {
  const [errorState, setErrorState] = useState<ErrorState>({
    isVisible: false,
    error: null
  })

  const handleError = useCallback((error: any) => {
    let errorDisplay: FacebookErrorDisplay

    // Handle API response errors
    if (error.response?.data?.error) {
      const apiError = error.response.data.error
      errorDisplay = {
        title: getErrorTitle(apiError.type),
        message: apiError.message,
        suggestions: apiError.suggestions || [],
        type: apiError.type?.toLowerCase() || 'error'
      }
    }
    // Handle network errors
    else if (error.code === 'NETWORK_ERROR' || error.message?.includes('fetch')) {
      errorDisplay = {
        title: 'Connection Error',
        message: 'Unable to connect to Facebook services',
        suggestions: [
          'Check your internet connection',
          'Try refreshing the page',
          'Contact support if the issue persists'
        ],
        type: 'network'
      }
    }
    // Handle generic errors
    else {
      errorDisplay = {
        title: 'Facebook Integration Error',
        message: error.message || 'An unexpected error occurred',
        suggestions: [
          'Try refreshing the page',
          'Clear your browser cache',
          'Contact support if the issue continues'
        ],
        type: 'generic'
      }
    }

    setErrorState({
      isVisible: true,
      error: errorDisplay
    })

    // Auto-hide after 10 seconds for non-critical errors
    if (errorDisplay.type !== 'auth_error') {
      setTimeout(() => {
        clearError()
      }, 10000)
    }
  }, [])

  const clearError = useCallback(() => {
    setErrorState({
      isVisible: false,
      error: null
    })
  }, [])

  const retry = useCallback((retryFunction: () => Promise<void>) => {
    clearError()
    retryFunction().catch(handleError)
  }, [handleError])

  return {
    error: errorState.error,
    isVisible: errorState.isVisible,
    handleError,
    clearError,
    retry
  }
}

function getErrorTitle(type?: string): string {
  const titles: Record<string, string> = {
    'auth_error': '🔐 Facebook Authentication Error',
    'api_error': '🔧 Facebook API Error', 
    'webhook_error': '📡 Webhook Error',
    'validation_error': '⚠️ Input Validation Error',
    'network_error': '🌐 Network Error'
  }
  return titles[type?.toLowerCase() || ''] || '❌ Facebook Integration Error'
}