'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useSocket } from '../../hooks/useSocket'

interface LiveComment {
  id: string
  user_name: string
  message: string
  posted_at: string
  platform: 'facebook' | 'youtube' | 'tiktok'
  isOrder?: boolean
  orderValue?: number
}

interface LiveMetrics {
  totalViewers: number
  activeStreams: number
  commentsPerMinute: number
  ordersPerMinute: number
  revenuePerMinute: number
  engagementRate: number
}

export default function RealTimePage() {
  const [isVisible, setIsVisible] = useState(false)
  const [metrics, setMetrics] = useState<LiveMetrics>({
    totalViewers: 5847,
    activeStreams: 12,
    commentsPerMinute: 34,
    ordersPerMinute: 7,
    revenuePerMinute: 284.50,
    engagementRate: 8.7
  })

  const [comments, setComments] = useState<LiveComment[]>([
    {
      id: '1',
      user_name: 'Sarah Chen',
      message: 'Just ordered the blue iPhone case! 📱',
      posted_at: '2 seconds ago',
      platform: 'facebook',
      isOrder: true,
      orderValue: 29.99
    },
    {
      id: '2',
      user_name: 'Mike Johnson',
      message: 'This live stream is so much better than SystemKH 🔥',
      posted_at: '5 seconds ago',
      platform: 'facebook'
    },
    {
      id: '3',
      user_name: 'Emma Wilson',
      message: 'How much for the wireless headphones?',
      posted_at: '8 seconds ago',
      platform: 'facebook'
    },
    {
      id: '4',
      user_name: 'David Lee',
      message: 'Ordered 2x phone cases! Lightning fast checkout ⚡',
      posted_at: '12 seconds ago',
      platform: 'facebook',
      isOrder: true,
      orderValue: 59.98
    }
  ])

  useEffect(() => {
    setIsVisible(true)
    
    // Simulate real-time updates
    const interval = setInterval(() => {
      // Update metrics
      setMetrics(prev => ({
        ...prev,
        totalViewers: prev.totalViewers + Math.floor(Math.random() * 20) - 10,
        commentsPerMinute: prev.commentsPerMinute + Math.floor(Math.random() * 6) - 3,
        ordersPerMinute: prev.ordersPerMinute + Math.floor(Math.random() * 3) - 1,
        revenuePerMinute: prev.revenuePerMinute + Math.random() * 50 - 25
      }))

      // Add new comments occasionally
      if (Math.random() > 0.6) {
        const newMessages = [
          'This real-time feature is incredible! 🚀',
          'Just placed an order! So smooth ✨',
          'SystemKH could never do this 😂',
          'Love the instant notifications!',
          'Best live commerce platform ever!',
          'Ordering right now! 🛒'
        ]
        
        const newComment: LiveComment = {
          id: Date.now().toString(),
          user_name: ['Alex', 'Jordan', 'Taylor', 'Casey', 'Riley'][Math.floor(Math.random() * 5)] + ' ' + ['Smith', 'Johnson', 'Brown', 'Davis', 'Wilson'][Math.floor(Math.random() * 5)],
          message: newMessages[Math.floor(Math.random() * newMessages.length)],
          posted_at: 'Just now',
          platform: 'facebook',
          isOrder: Math.random() > 0.7,
          orderValue: Math.random() > 0.7 ? Math.floor(Math.random() * 100) + 20 : undefined
        }
        
        setComments(prev => [newComment, ...prev.slice(0, 19)])
      }
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'facebook': return '📘'
      case 'youtube': return '📺'
      case 'tiktok': return '🎵'
      default: return '💬'
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 relative overflow-hidden">
      {/* Epic Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute top-10 left-10 w-96 h-96 bg-gradient-to-r from-purple-400/10 via-pink-400/10 to-red-400/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/3 right-20 w-80 h-80 bg-gradient-to-r from-emerald-400/8 via-cyan-400/8 to-blue-400/8 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
        <div className="absolute bottom-20 left-1/3 w-72 h-72 bg-gradient-to-r from-orange-400/8 via-yellow-400/8 to-red-400/8 rounded-full blur-3xl animate-pulse" style={{animationDelay: '4s'}}></div>
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:60px_60px] animate-pulse"></div>
        
        {/* Floating Elements */}
        <div className="absolute top-1/4 left-1/4 w-3 h-3 bg-purple-400 rounded-full animate-bounce opacity-30"></div>
        <div className="absolute top-3/4 right-1/4 w-2 h-2 bg-pink-400 rounded-full animate-bounce opacity-30" style={{animationDelay: '1s'}}></div>
        <div className="absolute top-1/2 left-3/4 w-2.5 h-2.5 bg-emerald-400 rounded-full animate-bounce opacity-30" style={{animationDelay: '2s'}}></div>
      </div>

      {/* Navigation */}
      <nav className="relative z-50 p-6 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="text-4xl animate-pulse group-hover:scale-110 transition-transform">🚀</div>
            <span className="text-3xl font-black bg-gradient-to-r from-purple-400 via-pink-400 to-red-400 bg-clip-text text-transparent">
              LiveSell Pro
            </span>
          </Link>
          <div className="hidden md:flex items-center space-x-6">
            <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-400 px-4 py-2 rounded-2xl border border-purple-500/40 backdrop-blur-sm flex items-center space-x-2">
              <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
              <span className="font-medium">Real-time Monitoring</span>
            </div>
            <Link 
              href="/dashboard" 
              className="bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 px-6 py-3 rounded-2xl border border-emerald-500/30 hover:border-emerald-400/50 transition-all backdrop-blur-sm font-medium flex items-center space-x-2 group"
            >
              <span>📊</span>
              <span>Dashboard</span>
              <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </Link>
            <Link 
              href="/facebook" 
              className="bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 px-6 py-3 rounded-2xl border border-blue-500/30 hover:border-blue-400/50 transition-all backdrop-blur-sm font-medium flex items-center space-x-2 group"
            >
              <span>📘</span>
              <span>Facebook</span>
              <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </Link>
          </div>
        </div>
      </nav>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        {/* Epic Header Section */}
        <div className={`text-center mb-16 transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <div className="inline-flex items-center space-x-3 bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-full px-8 py-3 mb-8">
            <div className="w-3 h-3 bg-purple-500 rounded-full animate-pulse"></div>
            <span className="text-purple-400 font-bold text-lg">Real-Time Live Commerce</span>
            <div className="w-3 h-3 bg-pink-500 rounded-full animate-pulse" style={{animationDelay: '0.5s'}}></div>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-black mb-6 leading-tight">
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-red-400 bg-clip-text text-transparent animate-pulse">
              Lightning Speed
            </span>
            <br />
            <span className="bg-gradient-to-r from-emerald-400 via-cyan-400 to-blue-400 bg-clip-text text-transparent">
              Real-Time Magic
            </span>
          </h1>
          
          <p className="text-2xl text-gray-300 max-w-4xl mx-auto mb-8">
            Experience 5-second real-time updates that make SystemKH look like they're running on dial-up internet
          </p>

          {/* Live Status Indicators */}
          <div className="flex flex-wrap justify-center gap-6 mb-8">
            <div className="bg-red-500/20 border border-red-500/30 rounded-2xl px-6 py-3 flex items-center space-x-3 backdrop-blur-sm">
              <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
              <span className="text-red-400 font-bold">{metrics.activeStreams} Live Streams</span>
              <span className="bg-red-500/30 text-red-300 px-2 py-1 rounded-full text-xs font-bold">🔴 LIVE</span>
            </div>
            <div className="bg-emerald-500/20 border border-emerald-500/30 rounded-2xl px-6 py-3 flex items-center space-x-3 backdrop-blur-sm">
              <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse"></div>
              <span className="text-emerald-400 font-bold">{metrics.totalViewers.toLocaleString()} Live Viewers</span>
              <span className="bg-emerald-500/30 text-emerald-300 px-2 py-1 rounded-full text-xs font-bold">👥 ACTIVE</span>
            </div>
            <div className="bg-purple-500/20 border border-purple-500/30 rounded-2xl px-6 py-3 flex items-center space-x-3 backdrop-blur-sm">
              <div className="w-3 h-3 bg-purple-500 rounded-full animate-pulse"></div>
              <span className="text-purple-400 font-bold">5s Updates</span>
              <span className="bg-purple-500/30 text-purple-300 px-2 py-1 rounded-full text-xs font-bold">⚡ FAST</span>
            </div>
          </div>
        </div>

        {/* Live Metrics Dashboard */}
        <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16 transition-all duration-1000 delay-200 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <div className="group relative">
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/20 to-green-400/20 rounded-3xl blur-lg group-hover:blur-xl transition-all"></div>
            <div className="relative bg-gradient-to-br from-emerald-500/20 to-green-500/20 backdrop-blur-xl rounded-3xl p-8 border border-emerald-500/40 shadow-2xl hover:scale-105 transition-all duration-300">
              <div className="flex items-center justify-between mb-6">
                <div className="text-5xl group-hover:scale-110 transition-transform">💬</div>
                <div className="text-right">
                  <div className="text-3xl font-black text-emerald-400 mb-1">{metrics.commentsPerMinute}</div>
                  <div className="text-gray-400 font-medium">Comments/Min</div>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="text-emerald-400 font-bold">Real-time stream</div>
                <div className="bg-emerald-500/30 text-emerald-300 px-3 py-1.5 rounded-full text-xs font-bold border border-emerald-400/50">
                  LIVE
                </div>
              </div>
              <div className="mt-4 h-2 bg-emerald-900/50 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-emerald-400 to-green-400 rounded-full w-4/5 animate-pulse"></div>
              </div>
            </div>
          </div>

          <div className="group relative">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-400/20 to-pink-400/20 rounded-3xl blur-lg group-hover:blur-xl transition-all"></div>
            <div className="relative bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-xl rounded-3xl p-8 border border-purple-500/40 shadow-2xl hover:scale-105 transition-all duration-300">
              <div className="flex items-center justify-between mb-6">
                <div className="text-5xl group-hover:scale-110 transition-transform">🛒</div>
                <div className="text-right">
                  <div className="text-3xl font-black text-purple-400 mb-1">{metrics.ordersPerMinute}</div>
                  <div className="text-gray-400 font-medium">Orders/Min</div>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="text-purple-400 font-bold">Live orders</div>
                <div className="bg-purple-500/30 text-purple-300 px-3 py-1.5 rounded-full text-xs font-bold border border-purple-400/50">
                  🔥 HOT
                </div>
              </div>
              <div className="mt-4 h-2 bg-purple-900/50 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-purple-400 to-pink-400 rounded-full w-3/4 animate-pulse"></div>
              </div>
            </div>
          </div>

          <div className="group relative">
            <div className="absolute inset-0 bg-gradient-to-r from-orange-400/20 to-red-400/20 rounded-3xl blur-lg group-hover:blur-xl transition-all"></div>
            <div className="relative bg-gradient-to-br from-orange-500/20 to-red-500/20 backdrop-blur-xl rounded-3xl p-8 border border-orange-500/40 shadow-2xl hover:scale-105 transition-all duration-300">
              <div className="flex items-center justify-between mb-6">
                <div className="text-5xl group-hover:scale-110 transition-transform">💰</div>
                <div className="text-right">
                  <div className="text-3xl font-black text-orange-400 mb-1">${metrics.revenuePerMinute.toFixed(0)}</div>
                  <div className="text-gray-400 font-medium">Revenue/Min</div>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="text-orange-400 font-bold">Live revenue</div>
                <div className="bg-orange-500/30 text-orange-300 px-3 py-1.5 rounded-full text-xs font-bold border border-orange-400/50">
                  💸 MONEY
                </div>
              </div>
              <div className="mt-4 h-2 bg-orange-900/50 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-orange-400 to-red-400 rounded-full w-5/6 animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Live Comments Feed */}
        <div className={`transition-all duration-1000 delay-400 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-gray-600/20 to-gray-800/20 rounded-3xl blur-lg group-hover:blur-xl transition-all"></div>
            <div className="relative bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-xl rounded-3xl p-10 border border-white/20 shadow-2xl">
              <div className="flex items-center justify-between mb-10">
                <h3 className="text-3xl font-black text-white">Live Comments & Orders Stream</h3>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-emerald-400 rounded-full animate-pulse"></div>
                    <span className="text-emerald-400 font-bold">Real-time Updates</span>
                  </div>
                  <div className="bg-emerald-500/30 text-emerald-300 px-4 py-2 rounded-full text-sm font-bold border border-emerald-400/50">
                    ⚡ 5s REFRESH
                  </div>
                </div>
              </div>

              <div className="space-y-4 max-h-96 overflow-y-auto custom-scrollbar">
                {comments.map((comment, index) => (
                  <div key={comment.id} className={`group/comment flex items-start space-x-4 p-6 rounded-2xl transition-all duration-300 hover:scale-[1.02] ${
                    comment.isOrder 
                      ? 'bg-gradient-to-r from-emerald-500/20 to-green-500/20 border border-emerald-500/40' 
                      : 'bg-white/5 border border-white/20'
                  } hover:bg-opacity-80`}>
                    <div className="text-3xl group-hover/comment:scale-110 transition-transform">
                      {comment.isOrder ? '🛒' : getPlatformIcon(comment.platform)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-3 mb-2">
                        <div className={`font-bold text-lg ${comment.isOrder ? 'text-emerald-400' : 'text-white'}`}>
                          {comment.user_name}
                        </div>
                        {comment.isOrder && (
                          <div className="bg-emerald-500/30 text-emerald-300 px-3 py-1 rounded-full text-xs font-bold border border-emerald-400/50">
                            💰 ORDER
                          </div>
                        )}
                        <div className="text-gray-500 text-sm">{comment.posted_at}</div>
                      </div>
                      <div className={`text-lg ${comment.isOrder ? 'text-emerald-300' : 'text-gray-300'} mb-2`}>
                        {comment.message}
                      </div>
                      {comment.orderValue && (
                        <div className="text-emerald-400 font-black text-xl">
                          +${comment.orderValue}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Ultimate SystemKH Comparison */}
        <div className={`text-center mt-20 transition-all duration-1000 delay-600 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-400/20 via-pink-400/20 to-red-400/20 rounded-3xl blur-2xl group-hover:blur-3xl transition-all"></div>
            <div className="relative bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-red-500/10 border border-purple-500/30 rounded-3xl px-12 py-10 max-w-6xl mx-auto backdrop-blur-xl">
              <div className="mb-8">
                <h3 className="text-4xl font-black text-purple-400 mb-4">🏆 Real-Time Performance Domination</h3>
                <p className="text-xl text-gray-300 max-w-4xl mx-auto">
                  While SystemKH users wait 30+ seconds for updates, you're already processing the next wave of orders
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                <div className="group/comp bg-gradient-to-br from-emerald-500/20 to-green-500/20 rounded-2xl p-6 border border-emerald-500/40 hover:scale-105 transition-all">
                  <div className="text-4xl mb-4 group-hover/comp:scale-110 transition-transform">⚡</div>
                  <div className="font-black text-emerald-400 text-lg mb-2">5 Second Updates</div>
                  <div className="text-gray-300 text-sm">vs SystemKH's 30+ seconds</div>
                  <div className="mt-3 text-emerald-400 font-bold text-xs">6X FASTER</div>
                </div>
                
                <div className="group/comp bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-2xl p-6 border border-purple-500/40 hover:scale-105 transition-all">
                  <div className="text-4xl mb-4 group-hover/comp:scale-110 transition-transform">🔄</div>
                  <div className="font-black text-purple-400 text-lg mb-2">Auto-Refresh</div>
                  <div className="text-gray-300 text-sm">vs manual refresh needed</div>
                  <div className="mt-3 text-purple-400 font-bold text-xs">AUTOMATIC</div>
                </div>
                
                <div className="group/comp bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-2xl p-6 border border-blue-500/40 hover:scale-105 transition-all">
                  <div className="text-4xl mb-4 group-hover/comp:scale-110 transition-transform">🤖</div>
                  <div className="font-black text-blue-400 text-lg mb-2">AI Detection</div>
                  <div className="text-gray-300 text-sm">vs basic text parsing</div>
                  <div className="mt-3 text-blue-400 font-bold text-xs">SMART</div>
                </div>
                
                <div className="group/comp bg-gradient-to-br from-orange-500/20 to-red-500/20 rounded-2xl p-6 border border-orange-500/40 hover:scale-105 transition-all">
                  <div className="text-4xl mb-4 group-hover/comp:scale-110 transition-transform">💰</div>
                  <div className="font-black text-orange-400 text-lg mb-2">Live Revenue</div>
                  <div className="text-gray-300 text-sm">vs delayed reporting</div>
                  <div className="mt-3 text-orange-400 font-bold text-xs">INSTANT</div>
                </div>
              </div>

              <div className="mt-8 flex flex-wrap justify-center gap-4">
                <Link 
                  href="/dashboard"
                  className="bg-gradient-to-r from-emerald-500/20 to-green-500/20 hover:from-emerald-500/30 hover:to-green-500/30 text-emerald-400 px-8 py-4 rounded-2xl border border-emerald-500/40 hover:border-emerald-400/60 transition-all font-bold flex items-center space-x-2 group"
                >
                  <span>📊</span>
                  <span>Dashboard</span>
                  <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </Link>
                
                <Link 
                  href="/facebook"
                  className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 hover:from-blue-500/30 hover:to-purple-500/30 text-blue-400 px-8 py-4 rounded-2xl border border-blue-500/40 hover:border-blue-400/60 transition-all font-bold flex items-center space-x-2 group"
                >
                  <span>📘</span>
                  <span>Facebook Integration</span>
                  <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: linear-gradient(to bottom, #8b5cf6, #ec4899);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(to bottom, #7c3aed, #db2777);
        }
      `}</style>
    </div>
  )
}