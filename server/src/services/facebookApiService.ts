import axios from 'axios'
import logger from '@/utils/logger'
import { FacebookApiResponse, LiveStream, Comment } from '@/types/facebook'

export class FacebookApiService {
  private static readonly BASE_URL = 'https://graph.facebook.com/v18.0'
  private static readonly APP_ID = process.env.FACEBOOK_APP_ID
  private static readonly APP_SECRET = process.env.FACEBOOK_APP_SECRET

  // Debug method to check environment variables
  private static checkEnvironment(): void {
    if (!this.APP_ID) {
      throw new Error('FACEBOOK_APP_ID environment variable is not set')
    }
    if (!this.APP_SECRET) {
      throw new Error('FACEBOOK_APP_SECRET environment variable is not set')
    }
  }

  /**
   * Get app access token for Facebook API calls
   */
  private static async getAppAccessToken(): Promise<string> {
    try {
      // Check environment variables first
      this.checkEnvironment()
      
      logger.info('Requesting Facebook app access token', {
        appId: this.APP_ID,
        hasSecret: !!this.APP_SECRET
      })
      
      const response = await axios.get(
        `${this.BASE_URL}/oauth/access_token`,
        {
          params: {
            client_id: this.APP_ID,
            client_secret: this.APP_SECRET,
            grant_type: 'client_credentials'
          }
        }
      )
      return response.data.access_token
    } catch (error) {
      logger.error('Failed to get app access token:', error)
      throw new Error('Facebook API authentication failed')
    }
  }

  /**
   * Verify webhook signature from Facebook
   */
  static verifyWebhookSignature(payload: string, signature: string): boolean {
    try {
      // Check if app secret is available
      if (!this.APP_SECRET) {
        logger.error('FACEBOOK_APP_SECRET is not configured for webhook verification')
        return false
      }
      
      const crypto = require('crypto')
      const expectedSignature = crypto
        .createHmac('sha256', this.APP_SECRET)
        .update(payload)
        .digest('hex')
      
      return signature === `sha256=${expectedSignature}`
    } catch (error) {
      logger.error('Webhook signature verification failed:', error)
      return false
    }
  }

  /**
   * Exchange authorization code for access token
   */
  static async exchangeCodeForToken(code: string, redirectUri: string): Promise<{ access_token: string; token_type: string }> {
    try {
      // Debug log the credentials
      console.log('🔧 DEBUG - OAuth Exchange Parameters:')
      console.log(`   App ID: ${this.APP_ID}`)
      console.log(`   App Secret: ${this.APP_SECRET ? this.APP_SECRET.substring(0, 8) + '...' : 'NOT SET'}`)
      console.log(`   Redirect URI: ${redirectUri}`)
      console.log(`   Code: ${code ? code.substring(0, 10) + '...' : 'NOT SET'}`)

      if (!this.APP_ID || !this.APP_SECRET) {
        throw new Error('Facebook App credentials not properly configured')
      }

      const response = await axios.get(
        `${this.BASE_URL}/oauth/access_token`,
        {
          params: {
            client_id: this.APP_ID,
            client_secret: this.APP_SECRET,
            redirect_uri: redirectUri,
            code: code
          }
        }
      )
      
      console.log('✅ OAuth exchange successful')
      return response.data
    } catch (error: any) {
      logger.error('Failed to exchange code for token:', error.response?.data || error.message)
      console.log('❌ Full error details:', {
        url: `${this.BASE_URL}/oauth/access_token`,
        params: {
          client_id: this.APP_ID,
          client_secret: this.APP_SECRET ? 'SET' : 'NOT SET',
          redirect_uri: redirectUri,
          code: code ? 'SET' : 'NOT SET'
        },
        error: error.response?.data || error.message
      })
      throw new Error('Failed to exchange authorization code for access token')
    }
  }

  /**
   * Get user's Facebook pages (during setup)
   */
  static async getUserPages(userAccessToken: string): Promise<FacebookApiResponse> {
    try {
      const response = await axios.get(
        `${this.BASE_URL}/me/accounts`,
        {
          params: {
            access_token: userAccessToken,
            fields: 'id,name,access_token,picture,link,category'
          }
        }
      )
      return response.data
    } catch (error: any) {
      logger.error('Failed to get user pages:', error.response?.data || error.message)
      throw new Error('Failed to fetch Facebook pages')
    }
  }

  /**
   * Get long-lived page access token
   */
  static async getLongLivedPageToken(shortLivedToken: string): Promise<string> {
    try {
      const response = await axios.get(
        `${this.BASE_URL}/oauth/access_token`,
        {
          params: {
            grant_type: 'fb_exchange_token',
            client_id: this.APP_ID,
            client_secret: this.APP_SECRET,
            fb_exchange_token: shortLivedToken
          }
        }
      )
      return response.data.access_token
    } catch (error) {
      logger.error('Failed to get long-lived token:', error)
      throw new Error('Failed to exchange token')
    }
  }

  /**
   * Get live videos from a Facebook page
   */
  static async getPageLiveVideos(pageId: string, accessToken: string): Promise<FacebookApiResponse> {
    try {
      const response = await axios.get(
        `${this.BASE_URL}/${pageId}/live_videos`,
        {
          params: {
            access_token: accessToken,
            fields: 'id,title,description,status,creation_time,live_views,permalink_url',
            limit: 25
          }
        }
      )
      return response.data
    } catch (error: any) {
      logger.error('Failed to get live videos:', error.response?.data || error.message)
      throw new Error('Failed to fetch live videos')
    }
  }

  /**
   * Get comments from a live video
   * This is where we beat SystemKH - REAL-TIME comment fetching!
   */
  static async getLiveVideoComments(
    videoId: string, 
    accessToken: string, 
    since?: string
  ): Promise<FacebookApiResponse> {
    try {
      const params: any = {
        access_token: accessToken,
        fields: 'id,message,created_time,from{id,name,picture},parent',
        order: 'chronological',
        limit: 100 // SystemKH probably fetches less!
      }

      if (since) {
        params.since = since
      }

      const response = await axios.get(
        `${this.BASE_URL}/${videoId}/comments`,
        { params }
      )
      return response.data
    } catch (error: any) {
      logger.error('Failed to get comments:', error.response?.data || error.message)
      throw new Error('Failed to fetch comments')
    }
  }

  /**
   * Reply to a comment (AI-powered feature SystemKH doesn't have!)
   */
  static async replyToComment(
    commentId: string, 
    message: string, 
    accessToken: string
  ): Promise<FacebookApiResponse> {
    try {
      const response = await axios.post(
        `${this.BASE_URL}/${commentId}/comments`,
        {
          message: message,
          access_token: accessToken
        }
      )
      return response.data
    } catch (error: any) {
      logger.error('Failed to reply to comment:', error.response?.data || error.message)
      throw new Error('Failed to send reply')
    }
  }

  /**
   * Subscribe to page webhooks for real-time updates
   */
  static async subscribeToPageWebhooks(pageId: string, accessToken: string): Promise<boolean> {
    try {
      const appToken = await this.getAppAccessToken()
      
      const response = await axios.post(
        `${this.BASE_URL}/${pageId}/subscribed_apps`,
        {
          subscribed_fields: 'live_videos,feed,comments',
          access_token: appToken
        }
      )
      
      logger.info(`Subscribed to webhooks for page: ${pageId}`)
      return true
    } catch (error: any) {
      logger.error('Failed to subscribe to webhooks:', error.response?.data || error.message)
      return false
    }
  }

  /**
   * Get page insights (better analytics than SystemKH!)
   */
  static async getPageInsights(
    pageId: string, 
    accessToken: string, 
    metrics: string[] = ['page_views', 'page_fan_adds', 'page_engaged_users']
  ): Promise<FacebookApiResponse> {
    try {
      const response = await axios.get(
        `${this.BASE_URL}/${pageId}/insights`,
        {
          params: {
            access_token: accessToken,
            metric: metrics.join(','),
            period: 'day',
            since: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
          }
        }
      )
      return response.data
    } catch (error: any) {
      logger.error('Failed to get page insights:', error.response?.data || error.message)
      throw new Error('Failed to fetch analytics')
    }
  }

  /**
   * Validate page access token
   */
  static async validatePageToken(accessToken: string): Promise<boolean> {
    try {
      const response = await axios.get(
        `${this.BASE_URL}/me`,
        {
          params: {
            access_token: accessToken,
            fields: 'id,name'
          }
        }
      )
      return !!response.data.id
    } catch (error) {
      return false
    }
  }

  /**
   * Get live video statistics
   */
  static async getLiveVideoStats(videoId: string, accessToken: string): Promise<FacebookApiResponse> {
    try {
      const response = await axios.get(
        `${this.BASE_URL}/${videoId}`,
        {
          params: {
            access_token: accessToken,
            fields: 'live_views,status,creation_time,title,description'
          }
        }
      )
      return response.data
    } catch (error: any) {
      logger.error('Failed to get video stats:', error.response?.data || error.message)
      throw new Error('Failed to fetch video statistics')
    }
  }
}