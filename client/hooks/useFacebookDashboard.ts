// Facebook Dashboard Hook for real-time data integration
'use client'

import { useState, useEffect } from 'react'
import { useSocket } from './useSocket'

interface FacebookStats {
  connectedPages: number
  activeLiveStreams: number
  totalComments: number
  totalViewers: number
  engagementRate: number
  topPerformingPage: string
  recentActivity: FacebookActivity[]
}

interface FacebookActivity {
  id: string
  type: 'comment' | 'live_start' | 'live_end' | 'page_connect' | 'engagement'
  message: string
  timestamp: string
  pageName: string
  value?: number
  metadata?: any
}

interface LiveStreamMetrics {
  streamId: string
  title: string
  pageName: string
  status: 'LIVE' | 'ENDED' | 'SCHEDULED'
  viewers: number
  comments: number
  engagementRate: number
  duration: string
  peakViewers: number
  avgViewTime: string
}

export const useFacebookDashboard = () => {
  const { socket, isConnected } = useSocket()
  const [stats, setStats] = useState<FacebookStats>({
    connectedPages: 0,
    activeLiveStreams: 0,
    totalComments: 0,
    totalViewers: 0,
    engagementRate: 0,
    topPerformingPage: '',
    recentActivity: []
  })
  
  const [liveStreams, setLiveStreams] = useState<LiveStreamMetrics[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch initial dashboard data
  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      
      // Fetch Facebook pages
      const pagesResponse = await fetch('/api/facebook/pages', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })
      
      if (!pagesResponse.ok) {
        throw new Error('Failed to fetch Facebook pages')
      }
      
      const pagesData = await pagesResponse.json()
      
      // Fetch live streams
      const streamsResponse = await fetch('/api/facebook/live-streams', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })
      
      if (!streamsResponse.ok) {
        throw new Error('Failed to fetch live streams')
      }
      
      const streamsData = await streamsResponse.json()
      
      // Update stats
      setStats(prevStats => ({
        ...prevStats,
        connectedPages: pagesData.data.pages.length,
        activeLiveStreams: streamsData.data.activeStreams || 0,
        topPerformingPage: pagesData.data.pages[0]?.page_name || 'No pages connected'
      }))
      
      setLiveStreams(streamsData.data.streams || [])
      setError(null)
      
    } catch (err: any) {
      setError(err.message)
      console.error('Dashboard data fetch error:', err)
    } finally {
      setLoading(false)
    }
  }

  // Set up real-time event listeners
  useEffect(() => {
    if (socket && isConnected) {
      // Join dashboard room for real-time updates
      socket.emit('join-room', 'dashboard')
      
      // Listen for new comments
      socket.on('new_comment', (data: any) => {
        setStats(prev => ({
          ...prev,
          totalComments: prev.totalComments + 1,
          recentActivity: [
            {
              id: Date.now().toString(),
              type: 'comment',
              message: `New comment: "${data.message?.substring(0, 50)}..."`,
              timestamp: new Date().toLocaleTimeString(),
              pageName: data.pageName || 'Unknown Page',
              metadata: data
            },
            ...prev.recentActivity.slice(0, 9) // Keep last 10 activities
          ]
        }))
      })
      
      // Listen for new live streams
      socket.on('new_live_stream', (data: any) => {
        setStats(prev => ({
          ...prev,
          activeLiveStreams: prev.activeLiveStreams + 1,
          recentActivity: [
            {
              id: Date.now().toString(),
              type: 'live_start',
              message: `Live stream started: "${data.title}"`,
              timestamp: new Date().toLocaleTimeString(),
              pageName: data.pageName || 'Unknown Page',
              metadata: data
            },
            ...prev.recentActivity.slice(0, 9)
          ]
        }))
        
        // Add to live streams list
        setLiveStreams(prev => [
          {
            streamId: data.streamId,
            title: data.title,
            pageName: data.pageName,
            status: 'LIVE',
            viewers: data.viewers || 0,
            comments: 0,
            engagementRate: 0,
            duration: '0:00:00',
            peakViewers: data.viewers || 0,
            avgViewTime: '0:00'
          },
          ...prev
        ])
      })
      
      // Listen for stream updates
      socket.on('stream_update', (data: any) => {
        setLiveStreams(prev => 
          prev.map(stream => 
            stream.streamId === data.streamId
              ? { ...stream, ...data }
              : stream
          )
        )
      })
      
      // Listen for engagement updates
      socket.on('engagement_spike', (data: any) => {
        setStats(prev => ({
          ...prev,
          recentActivity: [
            {
              id: Date.now().toString(),
              type: 'engagement',
              message: `High engagement on "${data.streamTitle}"`,
              timestamp: new Date().toLocaleTimeString(),
              pageName: data.pageName,
              value: data.engagementRate,
              metadata: data
            },
            ...prev.recentActivity.slice(0, 9)
          ]
        }))
      })
      
      return () => {
        socket.off('new_comment')
        socket.off('new_live_stream')
        socket.off('stream_update')
        socket.off('engagement_spike')
      }
    }
  }, [socket, isConnected])

  // Initial data fetch
  useEffect(() => {
    fetchDashboardData()
    
    // Refresh data every 30 seconds
    const interval = setInterval(fetchDashboardData, 30000)
    return () => clearInterval(interval)
  }, [])

  // Calculate engagement rate
  useEffect(() => {
    if (stats.totalViewers > 0) {
      const rate = (stats.totalComments / stats.totalViewers) * 100
      setStats(prev => ({ ...prev, engagementRate: Math.round(rate * 100) / 100 }))
    }
  }, [stats.totalComments, stats.totalViewers])

  return {
    stats,
    liveStreams,
    loading,
    error,
    isConnected,
    refreshData: fetchDashboardData
  }
}