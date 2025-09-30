import logger from '@/utils/logger'

export interface FacebookError {
  code: string
  message: string
  type: 'AUTH_ERROR' | 'API_ERROR' | 'WEBHOOK_ERROR' | 'VALIDATION_ERROR' | 'NETWORK_ERROR'
  details?: any
  suggestions?: string[]
}

export class FacebookErrorHandler {
  static createError(type: FacebookError['type'], code: string, message: string, details?: any, customSuggestions?: string[]): FacebookError {
    const suggestions = customSuggestions || this.getSuggestions(type, code)
    
    logger.error(`Facebook ${type}:`, { code, message, details })
    
    return {
      type,
      code,
      message,
      details,
      suggestions
    }
  }

  static handleAuthError(error: any): FacebookError {
    if (error.response?.data?.error) {
      const fbError = error.response.data.error
      
      switch (fbError.code) {
        case 190: // Invalid access token
          return this.createError('AUTH_ERROR', 'INVALID_TOKEN', 
            'Facebook access token is invalid or expired', 
            fbError,
            ['Reconnect your Facebook account', 'Check if your Facebook app is still active']
          )
          
        case 102: // Session expired
          return this.createError('AUTH_ERROR', 'SESSION_EXPIRED',
            'Your Facebook session has expired',
            fbError,
            ['Please log in to Facebook again', 'Refresh your browser and try reconnecting']
          )
          
        case 200: // Permission denied
          return this.createError('AUTH_ERROR', 'PERMISSION_DENIED',
            'Required Facebook permissions not granted',
            fbError,
            ['Grant all requested permissions when connecting Facebook', 'Contact support if permissions were denied']
          )
          
        default:
          return this.createError('AUTH_ERROR', 'UNKNOWN_AUTH_ERROR',
            fbError.message || 'Facebook authentication failed',
            fbError,
            ['Try reconnecting your Facebook account', 'Contact support if the issue persists']
          )
      }
    }

    return this.createError('AUTH_ERROR', 'AUTH_NETWORK_ERROR', 
      'Failed to connect to Facebook', 
      error.message,
      ['Check your internet connection', 'Try again in a moment', 'Ensure Facebook is accessible']
    )
  }

  static handleApiError(error: any): FacebookError {
    if (error.response?.data?.error) {
      const fbError = error.response.data.error
      
      switch (fbError.code) {
        case 4: // Rate limited
          return this.createError('API_ERROR', 'RATE_LIMITED',
            'Too many Facebook API requests',
            fbError,
            ['Wait a few minutes before trying again', 'Reduce the frequency of API calls']
          )
          
        case 10: // Permission error
          return this.createError('API_ERROR', 'INSUFFICIENT_PERMISSIONS',
            'Insufficient Facebook permissions for this action',
            fbError,
            ['Review and grant required Facebook permissions', 'Reconnect with all permissions enabled']
          )
          
        case 341: // Temporarily blocked
          return this.createError('API_ERROR', 'TEMPORARILY_BLOCKED',
            'Temporarily blocked from Facebook API',
            fbError,
            ['Wait 24 hours before trying again', 'Contact Facebook if the issue persists']
          )

        case 803: // Page access token invalid
          return this.createError('API_ERROR', 'PAGE_TOKEN_INVALID',
            'Facebook page access token is invalid',
            fbError,
            ['Reconnect the Facebook page', 'Ensure you have admin access to the page']
          )
          
        default:
          return this.createError('API_ERROR', 'FACEBOOK_API_ERROR',
            fbError.message || 'Facebook API error',
            fbError
          )
      }
    }

    if (error.code === 'ENOTFOUND' || error.code === 'ECONNREFUSED') {
      return this.createError('NETWORK_ERROR', 'CONNECTION_FAILED',
        'Cannot connect to Facebook servers',
        error,
        ['Check your internet connection', 'Verify Facebook is accessible', 'Try again later']
      )
    }

    return this.createError('API_ERROR', 'UNKNOWN_API_ERROR',
      error.message || 'Unknown Facebook API error',
      error
    )
  }

  static handleWebhookError(error: any, payload?: any): FacebookError {
    if (error.message?.includes('signature')) {
      return this.createError('WEBHOOK_ERROR', 'INVALID_SIGNATURE',
        'Invalid Facebook webhook signature',
        { payload, error: error.message },
        ['Check webhook verify token configuration', 'Ensure app secret is correct']
      )
    }

    if (error.message?.includes('timeout')) {
      return this.createError('WEBHOOK_ERROR', 'WEBHOOK_TIMEOUT',
        'Webhook processing timed out',
        { payload, error: error.message },
        ['Optimize webhook processing logic', 'Check server performance']
      )
    }

    return this.createError('WEBHOOK_ERROR', 'WEBHOOK_PROCESSING_ERROR',
      error.message || 'Failed to process webhook',
      { payload, error },
      ['Check webhook payload format', 'Review webhook processing logic']
    )
  }

  static handleValidationError(field: string, value: any, requirement: string): FacebookError {
    return this.createError('VALIDATION_ERROR', 'INVALID_INPUT',
      `Invalid ${field}: ${requirement}`,
      { field, value },
      [`Provide a valid ${field}`, `Ensure ${field} meets requirements: ${requirement}`]
    )
  }

  private static getSuggestions(type: FacebookError['type'], code: string): string[] {
    const commonSuggestions: Record<string, string[]> = {
      'AUTH_ERROR': [
        'Try reconnecting your Facebook account',
        'Ensure all required permissions are granted',
        'Check if your Facebook app is active'
      ],
      'API_ERROR': [
        'Check your internet connection',
        'Verify Facebook API access',
        'Try again in a few moments'
      ],
      'WEBHOOK_ERROR': [
        'Verify webhook configuration',
        'Check server logs for details',
        'Ensure webhook URL is accessible'
      ],
      'VALIDATION_ERROR': [
        'Check input parameters',
        'Verify data format requirements',
        'Review API documentation'
      ],
      'NETWORK_ERROR': [
        'Check internet connectivity',
        'Verify Facebook servers are accessible',
        'Try again later'
      ]
    }

    return commonSuggestions[type] || ['Contact support if the issue persists']
  }

  /**
   * Format error for API response
   */
  static formatApiResponse(error: FacebookError) {
    return {
      success: false,
      error: {
        type: error.type,
        code: error.code,
        message: error.message,
        suggestions: error.suggestions || []
      },
      timestamp: new Date().toISOString()
    }
  }

  /**
   * Format error for client-side display
   */
  static formatClientError(error: FacebookError) {
    return {
      title: this.getErrorTitle(error.type),
      message: error.message,
      suggestions: error.suggestions || [],
      type: error.type.toLowerCase()
    }
  }

  private static getErrorTitle(type: FacebookError['type']): string {
    const titles = {
      'AUTH_ERROR': 'Facebook Authentication Error',
      'API_ERROR': 'Facebook API Error',
      'WEBHOOK_ERROR': 'Facebook Webhook Error',
      'VALIDATION_ERROR': 'Input Validation Error',
      'NETWORK_ERROR': 'Network Connection Error'
    }
    return titles[type] || 'Facebook Integration Error'
  }

  /**
   * Check if error is recoverable
   */
  static isRecoverable(error: FacebookError): boolean {
    const recoverableCodes = [
      'RATE_LIMITED',
      'CONNECTION_FAILED',
      'WEBHOOK_TIMEOUT',
      'SESSION_EXPIRED',
      'NETWORK_ERROR'
    ]
    return recoverableCodes.includes(error.code)
  }

  /**
   * Get retry delay for recoverable errors
   */
  static getRetryDelay(error: FacebookError): number {
    const delays: Record<string, number> = {
      'RATE_LIMITED': 60000, // 1 minute
      'CONNECTION_FAILED': 5000, // 5 seconds
      'WEBHOOK_TIMEOUT': 30000, // 30 seconds
      'NETWORK_ERROR': 10000 // 10 seconds
    }
    return delays[error.code] || 30000
  }
}