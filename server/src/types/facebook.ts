export interface FacebookPage {
  id: string
  organizationId: string
  userId: string
  facebookPageId: string
  pageName: string
  accessToken: string
  pageUrl?: string
  profilePictureUrl?: string
  isActive: boolean
  liveMonitoringEnabled: boolean
  settings: Record<string, any>
  createdAt: Date
  updatedAt: Date
}

export interface LiveStream {
  id: string
  facebookPageId: string
  facebookLiveId: string
  title?: string
  description?: string
  status: 'LIVE' | 'ENDED' | 'SCHEDULED_UNPUBLISHED'
  startedAt?: Date
  endedAt?: Date
  viewerCount: number
  totalComments: number
  totalOrders: number
  totalRevenue: number
  metadata: Record<string, any>
  createdAt: Date
  updatedAt: Date
}

export interface Comment {
  id: string
  liveStreamId: string
  facebookCommentId: string
  facebookUserId: string
  userName: string
  userAvatarUrl?: string
  message: string
  commentedAt: Date
  isOrder: boolean
  isProcessed: boolean
  hasReply: boolean
  aiAnalysis: Record<string, any>
  createdAt: Date
  updatedAt: Date
}

export interface FacebookWebhookData {
  object: string
  entry: Array<{
    id: string
    time: number
    changes?: Array<{
      field: string
      value: any
    }>
    messaging?: Array<any>
  }>
}

export interface FacebookApiResponse<T = any> {
  data?: T
  error?: {
    message: string
    type: string
    code: number
  }
  paging?: {
    cursors: {
      before: string
      after: string
    }
    next?: string
    previous?: string
  }
}