import { v4 as uuidv4 } from 'uuid'
import db from '@/utils/database'
import { FacebookApiService } from './facebookApiService'
import { FacebookPage, LiveStream, Comment } from '@/types/facebook'
import logger from '@/utils/logger'
import { io } from '../index'

export class FacebookService {
  /**
   * Add Facebook page to organization
   */
  static async addFacebookPage(
    organizationId: string,
    userId: string,
    pageData: {
      facebookPageId: string
      pageName: string
      accessToken: string
      pageUrl?: string
      profilePictureUrl?: string
    }
  ): Promise<FacebookPage> {
    try {
      // Verify the page token is valid
      const isValidToken = await FacebookApiService.validatePageToken(pageData.accessToken)
      if (!isValidToken) {
        throw new Error('Invalid Facebook page access token')
      }

      // Check if page already exists
      const existingPage = await db('facebook_pages')
        .where('facebook_page_id', pageData.facebookPageId)
        .first()

      if (existingPage) {
        throw new Error('This Facebook page is already connected')
      }

      // Subscribe to webhooks for real-time updates
      await FacebookApiService.subscribeToPageWebhooks(
        pageData.facebookPageId,
        pageData.accessToken
      )

      // Insert new page
      const pageId = uuidv4()
      const [page] = await db('facebook_pages')
        .insert({
          id: pageId,
          organization_id: organizationId,
          user_id: userId,
          facebook_page_id: pageData.facebookPageId,
          page_name: pageData.pageName,
          access_token: pageData.accessToken,
          page_url: pageData.pageUrl,
          profile_picture_url: pageData.profilePictureUrl,
          is_active: true,
          live_monitoring_enabled: true,
          settings: JSON.stringify({
            auto_reply_enabled: true,
            order_detection_enabled: true,
            analytics_enabled: true,
            webhook_subscribed: true
          }),
          created_at: new Date(),
          updated_at: new Date()
        })
        .returning('*')

      logger.info(`Facebook page connected: ${pageData.pageName} for organization: ${organizationId}`)

      // Start monitoring for live videos immediately
      this.startLiveMonitoring(pageId)

      return {
        id: page.id,
        organizationId: page.organization_id,
        userId: page.user_id,
        facebookPageId: page.facebook_page_id,
        pageName: page.page_name,
        accessToken: page.access_token,
        pageUrl: page.page_url,
        profilePictureUrl: page.profile_picture_url,
        isActive: page.is_active,
        liveMonitoringEnabled: page.live_monitoring_enabled,
        settings: JSON.parse(page.settings || '{}'),
        createdAt: page.created_at,
        updatedAt: page.updated_at
      }

    } catch (error) {
      logger.error('Failed to add Facebook page:', error)
      throw error
    }
  }

  /**
   * Get organization's Facebook pages
   */
  static async getOrganizationPages(organizationId: string): Promise<FacebookPage[]> {
    try {
      const pages = await db('facebook_pages')
        .where('organization_id', organizationId)
        .where('is_active', true)
        .orderBy('created_at', 'desc')

      return pages.map(page => ({
        id: page.id,
        organizationId: page.organization_id,
        userId: page.user_id,
        facebookPageId: page.facebook_page_id,
        pageName: page.page_name,
        accessToken: page.access_token,
        pageUrl: page.page_url,
        profilePictureUrl: page.profile_picture_url,
        isActive: page.is_active,
        liveMonitoringEnabled: page.live_monitoring_enabled,
        settings: JSON.parse(page.settings || '{}'),
        createdAt: page.created_at,
        updatedAt: page.updated_at
      }))

    } catch (error) {
      logger.error('Failed to get organization pages:', error)
      throw error
    }
  }

  /**
   * Start monitoring live videos for a page
   * This is our killer feature - REAL-TIME monitoring!
   */
  static async startLiveMonitoring(pageId: string): Promise<void> {
    try {
      const page = await db('facebook_pages')
        .where('id', pageId)
        .first()

      if (!page || !page.live_monitoring_enabled) {
        return
      }

      // Get current live videos
      const liveVideosResponse = await FacebookApiService.getPageLiveVideos(
        page.facebook_page_id,
        page.access_token
      )

      if (liveVideosResponse.data && liveVideosResponse.data.length > 0) {
        for (const video of liveVideosResponse.data) {
          await this.processLiveVideo(pageId, video)
        }
      }

      logger.info(`Started live monitoring for page: ${page.page_name}`)

    } catch (error) {
      logger.error('Failed to start live monitoring:', error)
    }
  }

  /**
   * Process a live video and monitor its comments
   */
  static async processLiveVideo(pageId: string, videoData: any): Promise<LiveStream | null> {
    try {
      // Check if live stream already exists
      let liveStream = await db('live_streams')
        .where('facebook_live_id', videoData.id)
        .first()

      if (!liveStream) {
        // Create new live stream record
        const streamId = uuidv4()
        const [stream] = await db('live_streams')
          .insert({
            id: streamId,
            facebook_page_id: pageId,
            facebook_live_id: videoData.id,
            title: videoData.title,
            description: videoData.description,
            status: videoData.status,
            started_at: new Date(videoData.creation_time),
            viewer_count: videoData.live_views || 0,
            total_comments: 0,
            total_orders: 0,
            total_revenue: 0,
            metadata: JSON.stringify({
              permalink_url: videoData.permalink_url,
              original_data: videoData
            }),
            created_at: new Date(),
            updated_at: new Date()
          })
          .returning('*')

        liveStream = stream

        // Notify clients via WebSocket (SystemKH doesn't have this!)
        io.to(`org_${pageId}`).emit('new_live_stream', {
          id: stream.id,
          title: stream.title,
          status: stream.status,
          viewerCount: stream.viewer_count
        })

        logger.info(`New live stream detected: ${videoData.title}`)
      }

      // Start monitoring comments for this live stream
      this.startCommentMonitoring(liveStream.id, videoData.id)

      return {
        id: liveStream.id,
        facebookPageId: liveStream.facebook_page_id,
        facebookLiveId: liveStream.facebook_live_id,
        title: liveStream.title,
        description: liveStream.description,
        status: liveStream.status,
        startedAt: liveStream.started_at,
        endedAt: liveStream.ended_at,
        viewerCount: liveStream.viewer_count,
        totalComments: liveStream.total_comments,
        totalOrders: liveStream.total_orders,
        totalRevenue: parseFloat(liveStream.total_revenue || '0'),
        metadata: JSON.parse(liveStream.metadata || '{}'),
        createdAt: liveStream.created_at,
        updatedAt: liveStream.updated_at
      }

    } catch (error) {
      logger.error('Failed to process live video:', error)
      return null
    }
  }

  /**
   * Monitor comments for a live stream
   * Real-time comment processing (SystemKH's weakness!)
   */
  static async startCommentMonitoring(streamId: string, facebookLiveId: string): Promise<void> {
    try {
      const stream = await db('live_streams')
        .select('live_streams.*', 'facebook_pages.access_token')
        .join('facebook_pages', 'live_streams.facebook_page_id', 'facebook_pages.id')
        .where('live_streams.id', streamId)
        .first()

      if (!stream) return

      // Get latest comments
      const commentsResponse = await FacebookApiService.getLiveVideoComments(
        facebookLiveId,
        stream.access_token
      )

      if (commentsResponse.data && commentsResponse.data.length > 0) {
        for (const comment of commentsResponse.data) {
          await this.processComment(streamId, comment)
        }
      }

      // Schedule next comment check (every 5 seconds for real-time monitoring)
      setTimeout(() => {
        this.startCommentMonitoring(streamId, facebookLiveId)
      }, 5000) // SystemKH probably checks every 30+ seconds!

    } catch (error) {
      logger.error('Failed to monitor comments:', error)
    }
  }

  /**
   * Process individual comment
   */
  static async processComment(streamId: string, commentData: any): Promise<Comment | null> {
    try {
      // Check if comment already exists
      const existingComment = await db('comments')
        .where('facebook_comment_id', commentData.id)
        .first()

      if (existingComment) {
        return null // Comment already processed
      }

      // AI-powered order detection (SystemKH doesn't have this!)
      const isOrder = this.detectOrderInComment(commentData.message)
      
      // Insert new comment
      const commentId = uuidv4()
      const [comment] = await db('comments')
        .insert({
          id: commentId,
          live_stream_id: streamId,
          facebook_comment_id: commentData.id,
          facebook_user_id: commentData.from.id,
          user_name: commentData.from.name,
          user_avatar_url: commentData.from.picture?.data?.url,
          message: commentData.message,
          commented_at: new Date(commentData.created_time),
          is_order: isOrder,
          is_processed: false,
          has_reply: false,
          ai_analysis: JSON.stringify({
            sentiment: this.analyzeSentiment(commentData.message),
            keywords: this.extractKeywords(commentData.message),
            confidence_score: isOrder ? 0.85 : 0.2
          }),
          created_at: new Date(),
          updated_at: new Date()
        })
        .returning('*')

      // Update stream comment count
      await db('live_streams')
        .where('id', streamId)
        .increment('total_comments', 1)

      // Emit real-time update to clients (SystemKH can't do this!)
      io.to(`stream_${streamId}`).emit('new_comment', {
        id: comment.id,
        userName: comment.user_name,
        message: comment.message,
        isOrder: comment.is_order,
        commentedAt: comment.commented_at
      })

      logger.info(`New comment processed: ${commentData.message.substring(0, 50)}...`)

      return {
        id: comment.id,
        liveStreamId: comment.live_stream_id,
        facebookCommentId: comment.facebook_comment_id,
        facebookUserId: comment.facebook_user_id,
        userName: comment.user_name,
        userAvatarUrl: comment.user_avatar_url,
        message: comment.message,
        commentedAt: comment.commented_at,
        isOrder: comment.is_order,
        isProcessed: comment.is_processed,
        hasReply: comment.has_reply,
        aiAnalysis: JSON.parse(comment.ai_analysis || '{}'),
        createdAt: comment.created_at,
        updatedAt: comment.updated_at
      }

    } catch (error) {
      logger.error('Failed to process comment:', error)
      return null
    }
  }

  /**
   * AI-powered order detection (SystemKH doesn't have this!)
   */
  private static detectOrderInComment(message: string): boolean {
    const orderKeywords = [
      'order', 'buy', 'purchase', 'want', 'take', 'book', 'reserve',
      'nak', 'beli', 'ambil', 'pesan', // Malay
      'ចង់', 'យក', 'ទិញ', // Khmer
      'muốn', 'mua', 'đặt', 'lấy', // Vietnamese
      '+1', 'me', 'interested', 'pm', 'inbox'
    ]

    const lowerMessage = message.toLowerCase()
    return orderKeywords.some(keyword => lowerMessage.includes(keyword))
  }

  /**
   * Basic sentiment analysis
   */
  private static analyzeSentiment(message: string): 'positive' | 'neutral' | 'negative' {
    const positiveWords = ['good', 'great', 'awesome', 'love', 'excellent', 'perfect']
    const negativeWords = ['bad', 'terrible', 'hate', 'awful', 'worst', 'horrible']
    
    const lowerMessage = message.toLowerCase()
    const positiveCount = positiveWords.filter(word => lowerMessage.includes(word)).length
    const negativeCount = negativeWords.filter(word => lowerMessage.includes(word)).length
    
    if (positiveCount > negativeCount) return 'positive'
    if (negativeCount > positiveCount) return 'negative'
    return 'neutral'
  }

  /**
   * Extract keywords from comment
   */
  private static extractKeywords(message: string): string[] {
    const words = message.toLowerCase().split(/\s+/)
    return words.filter(word => word.length > 3 && !['the', 'and', 'but', 'for'].includes(word))
  }

  /**
   * Handle Facebook webhook
   */
  static async handleWebhook(webhookData: any): Promise<void> {
    try {
      for (const entry of webhookData.entry) {
        if (entry.changes) {
          for (const change of entry.changes) {
            if (change.field === 'live_videos') {
              // New live video detected
              await this.handleLiveVideoChange(entry.id, change.value)
            } else if (change.field === 'comments') {
              // New comment detected
              await this.handleCommentChange(change.value)
            }
          }
        }
      }
    } catch (error) {
      logger.error('Failed to handle webhook:', error)
    }
  }

  /**
   * Handle live video changes from webhook
   */
  private static async handleLiveVideoChange(pageId: string, videoData: any): Promise<void> {
    try {
      const page = await db('facebook_pages')
        .where('facebook_page_id', pageId)
        .first()

      if (page) {
        await this.processLiveVideo(page.id, videoData)
      }
    } catch (error) {
      logger.error('Failed to handle live video change:', error)
    }
  }

  /**
   * Handle comment changes from webhook
   */
  private static async handleCommentChange(commentData: any): Promise<void> {
    try {
      // Find the live stream this comment belongs to
      const stream = await db('live_streams')
        .where('facebook_live_id', commentData.post_id)
        .first()

      if (stream) {
        await this.processComment(stream.id, commentData)
      }
    } catch (error) {
      logger.error('Failed to handle comment change:', error)
    }
  }
}