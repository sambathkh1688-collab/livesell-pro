'use client'

import { useEffect, useState } from 'react'
import io, { Socket } from 'socket.io-client'

interface UseSocketReturn {
  socket: Socket | null
  isConnected: boolean
  connectionError: string | null
}

export const useSocket = (serverUrl?: string): UseSocketReturn => {
  const [socket, setSocket] = useState<Socket | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const [connectionError, setConnectionError] = useState<string | null>(null)

  useEffect(() => {
    const socketInstance = io(serverUrl || 'http://localhost:5000', {
      transports: ['websocket', 'polling'],
      timeout: 10000,
      autoConnect: true
    })

    socketInstance.on('connect', () => {
      console.log('🚀 Socket connected:', socketInstance.id)
      setIsConnected(true)
      setConnectionError(null)
    })

    socketInstance.on('disconnect', (reason) => {
      console.log('📡 Socket disconnected:', reason)
      setIsConnected(false)
    })

    socketInstance.on('connect_error', (error) => {
      console.error('❌ Socket connection error:', error)
      setConnectionError(error.message)
      setIsConnected(false)
    })

    setSocket(socketInstance)

    return () => {
      socketInstance.disconnect()
    }
  }, [serverUrl])

  return { socket, isConnected, connectionError }
}

// Hook for real-time dashboard data
export const useLiveData = () => {
  const { socket, isConnected } = useSocket()
  const [liveStats, setLiveStats] = useState({
    activeStreams: 0,
    totalComments: 0,
    viewerCount: 0,
    engagementRate: 0
  })

  useEffect(() => {
    if (!socket) return

    // Listen for real-time updates
    socket.on('stats_update', (stats) => {
      setLiveStats(stats)
    })

    socket.on('new_comment', (comment) => {
      setLiveStats(prev => ({
        ...prev,
        totalComments: prev.totalComments + 1
      }))
    })

    socket.on('viewer_update', (viewers) => {
      setLiveStats(prev => ({
        ...prev,
        viewerCount: viewers
      }))
    })

    // Join dashboard room for live updates
    socket.emit('join-room', 'dashboard')

    return () => {
      socket.off('stats_update')
      socket.off('new_comment')
      socket.off('viewer_update')
    }
  }, [socket])

  return { liveStats, isConnected }
}

// Hook for live comment stream
export const useLiveComments = (streamId?: string) => {
  const { socket, isConnected } = useSocket()
  const [comments, setComments] = useState<any[]>([])
  const [newCommentCount, setNewCommentCount] = useState(0)

  useEffect(() => {
    if (!socket || !streamId) return

    // Join specific stream room
    socket.emit('join-room', `stream-${streamId}`)

    socket.on('new_comment', (comment) => {
      setComments(prev => [comment, ...prev].slice(0, 100)) // Keep latest 100
      setNewCommentCount(prev => prev + 1)
    })

    socket.on('comment_update', (updatedComment) => {
      setComments(prev => 
        prev.map(c => c.id === updatedComment.id ? updatedComment : c)
      )
    })

    return () => {
      socket.off('new_comment')
      socket.off('comment_update')
    }
  }, [socket, streamId])

  const markCommentsAsRead = () => {
    setNewCommentCount(0)
  }

  return { 
    comments, 
    newCommentCount, 
    markCommentsAsRead, 
    isConnected 
  }
}