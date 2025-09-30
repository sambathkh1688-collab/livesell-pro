'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import FacebookAnalytics from '../../components/FacebookAnalytics'

interface DashboardStats {
  totalRevenue: number
  totalOrders: number
  activeLiveStreams: number
  connectedPages: number
  todayRevenue: number
  todayOrders: number
  averageOrderValue: number
  conversionRate: number
}

interface RecentActivity {
  id: string
  type: 'order' | 'comment' | 'stream_start' | 'stream_end'
  message: string
  timestamp: string
  value?: number
  pageName?: string
}

interface LiveStream {
  id: string
  title: string
  pageName: string
  status: 'LIVE' | 'ENDED'
  viewers: number
  orders: number
  revenue: number
  duration: string
}

export default function DashboardPage() {
  const [isVisible, setIsVisible] = useState(false)
  const [animationDelay, setAnimationDelay] = useState(0)
  const [stats, setStats] = useState<DashboardStats>({
    totalRevenue: 125847.50,
    totalOrders: 2847,
    activeLiveStreams: 3,
    connectedPages: 8,
    todayRevenue: 4250.75,
    todayOrders: 89,
    averageOrderValue: 44.25,
    conversionRate: 3.2
  })

  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([
    {
      id: '1',
      type: 'order',
      message: 'New order: iPhone 15 Case - Blue',
      timestamp: '2 minutes ago',
      value: 29.99,
      pageName: 'SystemKH Destroyer Store'
    },
    {
      id: '2',
      type: 'comment',
      message: 'High engagement detected on live video',
      timestamp: '5 minutes ago',
      pageName: 'LiveSell Pro Demo'
    },
    {
      id: '3',
      type: 'stream_start',
      message: 'Live stream started: Flash Sale Event',
      timestamp: '12 minutes ago',
      pageName: 'SystemKH Destroyer Store'
    },
    {
      id: '4',
      type: 'order',
      message: 'New order: Wireless Headphones',
      timestamp: '15 minutes ago',
      value: 79.99,
      pageName: 'LiveSell Pro Demo'
    },
    {
      id: '5',
      type: 'stream_end',
      message: 'Live stream ended: Product Launch',
      timestamp: '23 minutes ago',
      pageName: 'Tech Store Pro'
    }
  ])

  const [activeStreams, setActiveStreams] = useState<LiveStream[]>([
    {
      id: '1',
      title: 'MEGA FLASH SALE - 70% OFF Everything!',
      pageName: 'SystemKH Destroyer Store',
      status: 'LIVE',
      viewers: 2847,
      orders: 156,
      revenue: 8950.25,
      duration: '3:42:15'
    },
    {
      id: '2',
      title: 'New iPhone Cases Collection Launch',
      pageName: 'LiveSell Pro Demo',
      status: 'LIVE',
      viewers: 1892,
      orders: 89,
      revenue: 4230.50,
      duration: '1:28:47'
    },
    {
      id: '3',
      title: 'Weekend Special - Electronics Sale',
      pageName: 'Tech Store Pro',
      status: 'LIVE',
      viewers: 956,
      orders: 34,
      revenue: 2140.75,
      duration: '0:45:22'
    }
  ])

  useEffect(() => {
    setIsVisible(true)
    
    // Staggered animations for cards
    const timer = setTimeout(() => setAnimationDelay(1), 100)
    
    // Simulate real-time updates with smooth animations
    const interval = setInterval(() => {
      setStats(prev => ({
        ...prev,
        todayRevenue: prev.todayRevenue + Math.random() * 50,
        todayOrders: prev.todayOrders + (Math.random() > 0.8 ? 1 : 0)
      }))

      // Add new activity occasionally
      if (Math.random() > 0.7) {
        const newActivity: RecentActivity = {
          id: Date.now().toString(),
          type: 'order',
          message: 'New order: Premium Product',
          timestamp: 'Just now',
          value: Math.floor(Math.random() * 100) + 20,
          pageName: 'LiveSell Pro Demo'
        }
        setRecentActivity(prev => [newActivity, ...prev.slice(0, 9)])
      }
    }, 5000)

    return () => {
      clearTimeout(timer)
      clearInterval(interval)
    }
  }, [])

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'order': return '🛒'
      case 'comment': return '💬'
      case 'stream_start': return '🔴'
      case 'stream_end': return '⚫'
      default: return '📊'
    }
  }

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'order': return 'text-emerald-400'
      case 'comment': return 'text-blue-400'
      case 'stream_start': return 'text-red-400'
      case 'stream_end': return 'text-gray-400'
      default: return 'text-purple-400'
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-950 relative overflow-hidden">
      {/* Advanced Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute top-10 left-10 w-96 h-96 bg-gradient-to-r from-emerald-400/5 via-blue-400/5 to-purple-400/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/4 right-20 w-80 h-80 bg-gradient-to-r from-pink-400/5 via-orange-400/5 to-red-400/5 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
        <div className="absolute bottom-20 left-1/3 w-72 h-72 bg-gradient-to-r from-cyan-400/5 via-teal-400/5 to-emerald-400/5 rounded-full blur-3xl animate-pulse" style={{animationDelay: '4s'}}></div>
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:60px_60px] animate-pulse"></div>
        
        {/* Floating elements */}
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-emerald-400 rounded-full animate-bounce opacity-30"></div>
        <div className="absolute top-3/4 right-1/4 w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce opacity-30" style={{animationDelay: '1s'}}></div>
        <div className="absolute top-1/2 left-3/4 w-1 h-1 bg-purple-400 rounded-full animate-bounce opacity-30" style={{animationDelay: '2s'}}></div>
      </div>

      {/* Navigation */}
      <nav className="relative z-50 p-6 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="text-4xl animate-pulse group-hover:scale-110 transition-transform">🚀</div>
            <span className="text-3xl font-black bg-gradient-to-r from-emerald-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
              LiveSell Pro
            </span>
          </Link>
          <div className="hidden md:flex items-center space-x-6">
            <div className="bg-gradient-to-r from-emerald-500/20 to-green-500/20 text-emerald-400 px-4 py-2 rounded-2xl border border-emerald-500/40 backdrop-blur-sm flex items-center space-x-2">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
              <span className="font-medium">Dashboard</span>
            </div>
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
            <Link 
              href="/realtime" 
              className="bg-purple-500/20 hover:bg-purple-500/30 text-purple-400 px-6 py-3 rounded-2xl border border-purple-500/30 hover:border-purple-400/50 transition-all backdrop-blur-sm font-medium flex items-center space-x-2 group"
            >
              <span>⚡</span>
              <span>Real-time</span>
              <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </Link>
          </div>
        </div>
      </nav>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        {/* Header Section */}
        <div className={`mb-16 transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <div className="text-center mb-8">
            <div className="inline-flex items-center space-x-3 bg-gradient-to-r from-emerald-500/20 to-blue-500/20 border border-emerald-500/30 rounded-full px-8 py-3 mb-6">
              <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse"></div>
              <span className="text-emerald-400 font-bold text-lg">Live Commerce Command Center</span>
              <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse" style={{animationDelay: '0.5s'}}></div>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-black mb-6 leading-tight">
              <span className="bg-gradient-to-r from-emerald-400 via-blue-400 to-purple-400 bg-clip-text text-transparent animate-pulse">
                Revenue
              </span>
              <br />
              <span className="bg-gradient-to-r from-pink-400 via-orange-400 to-red-400 bg-clip-text text-transparent">
                Domination
              </span>
            </h1>
            
            <p className="text-2xl text-gray-300 max-w-3xl mx-auto mb-8">
              Real-time analytics that make SystemKH look like they're using dial-up internet
            </p>

            <div className="flex flex-wrap justify-center gap-4 mb-8">
              <div className="bg-emerald-500/20 border border-emerald-500/30 rounded-2xl px-6 py-3 flex items-center space-x-2 backdrop-blur-sm">
                <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse"></div>
                <span className="text-emerald-400 font-bold">Live Monitoring Active</span>
              </div>
              <div className="bg-blue-500/20 border border-blue-500/30 rounded-2xl px-6 py-3 flex items-center space-x-2 backdrop-blur-sm">
                <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
                <span className="text-blue-400 font-bold">AI Detection ON</span>
              </div>
              <div className="bg-purple-500/20 border border-purple-500/30 rounded-2xl px-6 py-3 flex items-center space-x-2 backdrop-blur-sm">
                <div className="w-3 h-3 bg-purple-500 rounded-full animate-pulse"></div>
                <span className="text-purple-400 font-bold">Auto-Processing</span>
              </div>
            </div>
          </div>
        </div>

        {/* Epic Stats Overview */}
        <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16 transition-all duration-1000 delay-200 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <div className="group relative">
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/20 to-green-400/20 rounded-3xl blur-lg group-hover:blur-xl transition-all"></div>
            <div className="relative bg-gradient-to-br from-emerald-500/20 to-green-500/20 backdrop-blur-xl rounded-3xl p-8 border border-emerald-500/40 shadow-2xl hover:scale-105 transition-all duration-300">
              <div className="flex items-center justify-between mb-6">
                <div className="text-5xl group-hover:scale-110 transition-transform">💰</div>
                <div className="text-right">
                  <div className="text-3xl font-black text-emerald-400 mb-1">${stats.totalRevenue.toLocaleString()}</div>
                  <div className="text-gray-400 text-sm font-medium">Total Revenue</div>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="text-emerald-400 font-bold">+${stats.todayRevenue.toFixed(2)} today</div>
                <div className="bg-emerald-500/30 text-emerald-300 px-3 py-1.5 rounded-full text-xs font-bold border border-emerald-400/50">
                  ↗ +15.2%
                </div>
              </div>
              <div className="mt-4 h-2 bg-emerald-900/50 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-emerald-400 to-green-400 rounded-full w-3/4 animate-pulse"></div>
              </div>
            </div>
          </div>

          <div className="group relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-cyan-400/20 rounded-3xl blur-lg group-hover:blur-xl transition-all"></div>
            <div className="relative bg-gradient-to-br from-blue-500/20 to-cyan-500/20 backdrop-blur-xl rounded-3xl p-8 border border-blue-500/40 shadow-2xl hover:scale-105 transition-all duration-300">
              <div className="flex items-center justify-between mb-6">
                <div className="text-5xl group-hover:scale-110 transition-transform">🛒</div>
                <div className="text-right">
                  <div className="text-3xl font-black text-blue-400 mb-1">{stats.totalOrders.toLocaleString()}</div>
                  <div className="text-gray-400 text-sm font-medium">Total Orders</div>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="text-blue-400 font-bold">{stats.todayOrders} orders today</div>
                <div className="bg-blue-500/30 text-blue-300 px-3 py-1.5 rounded-full text-xs font-bold border border-blue-400/50">
                  ↗ +8.7%
                </div>
              </div>
              <div className="mt-4 h-2 bg-blue-900/50 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full w-4/5 animate-pulse"></div>
              </div>
            </div>
          </div>

          <div className="group relative">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-400/20 to-pink-400/20 rounded-3xl blur-lg group-hover:blur-xl transition-all"></div>
            <div className="relative bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-xl rounded-3xl p-8 border border-purple-500/40 shadow-2xl hover:scale-105 transition-all duration-300">
              <div className="flex items-center justify-between mb-6">
                <div className="text-5xl group-hover:scale-110 transition-transform">📺</div>
                <div className="text-right">
                  <div className="text-3xl font-black text-purple-400 mb-1">{stats.activeLiveStreams}</div>
                  <div className="text-gray-400 text-sm font-medium">Live Streams</div>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="text-purple-400 font-bold">{stats.connectedPages} pages</div>
                <div className="bg-red-500/30 text-red-300 px-3 py-1.5 rounded-full text-xs font-bold border border-red-400/50 animate-pulse">
                  🔴 LIVE
                </div>
              </div>
              <div className="mt-4 h-2 bg-purple-900/50 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-purple-400 to-pink-400 rounded-full w-3/5 animate-pulse"></div>
              </div>
            </div>
          </div>

          <div className="group relative">
            <div className="absolute inset-0 bg-gradient-to-r from-orange-400/20 to-red-400/20 rounded-3xl blur-lg group-hover:blur-xl transition-all"></div>
            <div className="relative bg-gradient-to-br from-orange-500/20 to-red-500/20 backdrop-blur-xl rounded-3xl p-8 border border-orange-500/40 shadow-2xl hover:scale-105 transition-all duration-300">
              <div className="flex items-center justify-between mb-6">
                <div className="text-5xl group-hover:scale-110 transition-transform">⚡</div>
                <div className="text-right">
                  <div className="text-3xl font-black text-orange-400 mb-1">{stats.conversionRate}%</div>
                  <div className="text-gray-400 text-sm font-medium">Conversion</div>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="text-orange-400 font-bold">${stats.averageOrderValue} AOV</div>
                <div className="bg-orange-500/30 text-orange-300 px-3 py-1.5 rounded-full text-xs font-bold border border-orange-400/50">
                  ↗ +12.3%
                </div>
              </div>
              <div className="mt-4 h-2 bg-orange-900/50 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-orange-400 to-red-400 rounded-full w-5/6 animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Facebook Analytics Section */}
        <div className={`mb-16 transition-all duration-1000 delay-300 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <div className="text-center mb-8">
            <h2 className="text-3xl font-black text-white mb-4">
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Facebook Integration Analytics
              </span>
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Advanced Facebook API monitoring with real-time engagement tracking that SystemKH can only dream of
            </p>
          </div>
          <FacebookAnalytics />
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-10">
          {/* Active Live Streams */}
          <div className={`xl:col-span-2 transition-all duration-1000 delay-400 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-gray-600/20 to-gray-800/20 rounded-3xl blur-lg group-hover:blur-xl transition-all"></div>
              <div className="relative bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-xl rounded-3xl p-10 border border-white/20 shadow-2xl">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-3xl font-black text-white">Live Revenue Streams</h3>
                  <div className="flex items-center space-x-3">
                    <div className="w-4 h-4 bg-red-500 rounded-full animate-pulse"></div>
                    <span className="text-red-400 font-bold text-lg">{activeStreams.length} Streams Live</span>
                    <div className="bg-red-500/20 text-red-300 px-4 py-2 rounded-full text-sm font-bold border border-red-400/50">
                      🔥 HOT
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  {activeStreams.map((stream, index) => (
                    <div key={stream.id} className={`group/stream bg-gradient-to-r from-gray-700/50 to-gray-800/50 rounded-2xl p-8 border border-white/20 transition-all duration-500 hover:scale-[1.02] hover:bg-gradient-to-r hover:from-gray-600/50 hover:to-gray-700/50`} style={{animationDelay: `${index * 100}ms`}}>
                      <div className="flex items-start justify-between mb-6">
                        <div className="flex-1">
                          <div className="flex items-center space-x-4 mb-3">
                            <h4 className="font-black text-white text-xl group-hover/stream:text-emerald-400 transition-colors">{stream.title}</h4>
                            <div className="flex items-center space-x-2">
                              <span className="bg-red-500/30 text-red-300 px-4 py-2 rounded-full text-sm font-black border border-red-400/50 animate-pulse">
                                🔴 LIVE
                              </span>
                              <span className="bg-blue-500/30 text-blue-300 px-4 py-2 rounded-full text-sm font-bold border border-blue-400/50">
                                ⚡ TRENDING
                              </span>
                            </div>
                          </div>
                          <div className="text-gray-400 mb-4 font-medium">
                            📘 {stream.pageName} • Duration: {stream.duration}
                          </div>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-8">
                        <div className="text-center group/stat">
                          <div className="text-3xl font-black text-blue-400 group-hover/stat:scale-110 transition-transform">{stream.viewers.toLocaleString()}</div>
                          <div className="text-sm text-gray-400 font-medium">Live Viewers</div>
                          <div className="mt-2 h-1 bg-blue-900/50 rounded-full overflow-hidden">
                            <div className="h-full bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full w-4/5 animate-pulse"></div>
                          </div>
                        </div>
                        <div className="text-center group/stat">
                          <div className="text-3xl font-black text-emerald-400 group-hover/stat:scale-110 transition-transform">{stream.orders}</div>
                          <div className="text-sm text-gray-400 font-medium">Orders</div>
                          <div className="mt-2 h-1 bg-emerald-900/50 rounded-full overflow-hidden">
                            <div className="h-full bg-gradient-to-r from-emerald-400 to-green-400 rounded-full w-3/4 animate-pulse"></div>
                          </div>
                        </div>
                        <div className="text-center group/stat">
                          <div className="text-3xl font-black text-orange-400 group-hover/stat:scale-110 transition-transform">${stream.revenue.toLocaleString()}</div>
                          <div className="text-sm text-gray-400 font-medium">Revenue</div>
                          <div className="mt-2 h-1 bg-orange-900/50 rounded-full overflow-hidden">
                            <div className="h-full bg-gradient-to-r from-orange-400 to-red-400 rounded-full w-5/6 animate-pulse"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <Link 
                  href="/facebook"
                  className="mt-8 w-full bg-gradient-to-r from-blue-500/20 to-purple-500/20 hover:from-blue-500/30 hover:to-purple-500/30 text-blue-400 py-6 px-8 rounded-2xl border border-blue-500/30 hover:border-blue-400/50 transition-all duration-300 font-bold text-lg flex items-center justify-center group hover:scale-105"
                >
                  📘 Manage Facebook Integration
                  <svg className="ml-3 w-6 h-6 group-hover:translate-x-2 transition-transform" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>

          {/* Live Activity Feed */}
          <div className={`xl:col-span-1 transition-all duration-1000 delay-600 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-gray-600/20 to-gray-800/20 rounded-3xl blur-lg group-hover:blur-xl transition-all"></div>
              <div className="relative bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-2xl">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-2xl font-black text-white">Live Activity Feed</h3>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-emerald-400 rounded-full animate-pulse"></div>
                    <span className="text-emerald-400 font-bold text-sm">REAL-TIME</span>
                  </div>
                </div>

                <div className="space-y-4 max-h-96 overflow-y-auto custom-scrollbar">
                  {recentActivity.map((activity, index) => (
                    <div key={activity.id} className={`group/activity flex items-start space-x-4 p-6 rounded-2xl bg-white/5 border border-white/20 transition-all duration-300 hover:bg-white/10 hover:scale-[1.02]`} style={{animationDelay: `${index * 50}ms`}}>
                      <div className="text-3xl group-hover/activity:scale-110 transition-transform">{getActivityIcon(activity.type)}</div>
                      <div className="flex-1 min-w-0">
                        <div className={`font-bold text-sm ${getActivityColor(activity.type)}`}>
                          {activity.message}
                        </div>
                        {activity.value && (
                          <div className="text-emerald-400 font-black text-lg mt-2 flex items-center">
                            +${activity.value}
                            <span className="ml-2 text-xs bg-emerald-500/20 text-emerald-300 px-2 py-1 rounded-full border border-emerald-400/30">
                              NEW
                            </span>
                          </div>
                        )}
                        <div className="text-xs text-gray-500 mt-2 font-medium">
                          📘 {activity.pageName} • {activity.timestamp}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 p-4 bg-gradient-to-r from-emerald-500/10 to-blue-500/10 border border-emerald-500/30 rounded-2xl">
                  <div className="text-center">
                    <div className="text-emerald-400 font-bold text-lg mb-1">Live Processing</div>
                    <div className="text-gray-400 text-sm">SystemKH users still refreshing manually 😂</div>
                    <div className="mt-3 h-2 bg-emerald-900/50 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-emerald-400 to-blue-400 rounded-full animate-pulse" style={{width: '100%'}}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Ultimate Competitive Advantage Section */}
        <div className={`text-center mt-20 transition-all duration-1000 delay-800 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/20 via-blue-400/20 to-purple-400/20 rounded-3xl blur-2xl group-hover:blur-3xl transition-all"></div>
            <div className="relative bg-gradient-to-r from-emerald-500/10 via-blue-500/10 to-purple-500/10 border border-emerald-500/30 rounded-3xl px-12 py-10 max-w-6xl mx-auto backdrop-blur-xl">
              <div className="mb-8">
                <h3 className="text-4xl font-black text-emerald-400 mb-4">🏆 SystemKH Can't Even Compete</h3>
                <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                  While they're stuck in 2019, we're delivering the future of live commerce
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                <div className="group/comp bg-gradient-to-br from-emerald-500/20 to-green-500/20 rounded-2xl p-6 border border-emerald-500/40 hover:scale-105 transition-all">
                  <div className="text-4xl mb-4 group-hover/comp:scale-110 transition-transform">⚡</div>
                  <div className="font-black text-emerald-400 text-lg mb-2">Real-Time Updates</div>
                  <div className="text-gray-300 text-sm">5-second refresh vs SystemKH's 30+ seconds</div>
                  <div className="mt-3 text-emerald-400 font-bold text-xs">6X FASTER</div>
                </div>
                
                <div className="group/comp bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-2xl p-6 border border-blue-500/40 hover:scale-105 transition-all">
                  <div className="text-4xl mb-4 group-hover/comp:scale-110 transition-transform">♾️</div>
                  <div className="font-black text-blue-400 text-lg mb-2">Unlimited Pages</div>
                  <div className="text-gray-300 text-sm">No limits vs SystemKH's 5-page restriction</div>
                  <div className="mt-3 text-blue-400 font-bold text-xs">NO LIMITS</div>
                </div>
                
                <div className="group/comp bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-2xl p-6 border border-purple-500/40 hover:scale-105 transition-all">
                  <div className="text-4xl mb-4 group-hover/comp:scale-110 transition-transform">🤖</div>
                  <div className="font-black text-purple-400 text-lg mb-2">AI Detection</div>
                  <div className="text-gray-300 text-sm">Smart order recognition they don't have</div>
                  <div className="mt-3 text-purple-400 font-bold text-xs">EXCLUSIVE</div>
                </div>
                
                <div className="group/comp bg-gradient-to-br from-orange-500/20 to-red-500/20 rounded-2xl p-6 border border-orange-500/40 hover:scale-105 transition-all">
                  <div className="text-4xl mb-4 group-hover/comp:scale-110 transition-transform">💰</div>
                  <div className="font-black text-orange-400 text-lg mb-2">Better Pricing</div>
                  <div className="text-gray-300 text-sm">34% cheaper with superior features</div>
                  <div className="mt-3 text-orange-400 font-bold text-xs">BEST VALUE</div>
                </div>
              </div>

              <div className="mt-8 flex flex-wrap justify-center gap-4">
                <Link 
                  href="/realtime"
                  className="bg-gradient-to-r from-emerald-500/20 to-green-500/20 hover:from-emerald-500/30 hover:to-green-500/30 text-emerald-400 px-8 py-4 rounded-2xl border border-emerald-500/40 hover:border-emerald-400/60 transition-all font-bold flex items-center space-x-2 group"
                >
                  <span>⚡</span>
                  <span>See Real-time Magic</span>
                  <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </Link>
                
                <Link 
                  href="/facebook"
                  className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 hover:from-blue-500/30 hover:to-purple-500/30 text-blue-400 px-8 py-4 rounded-2xl border border-blue-500/40 hover:border-blue-400/60 transition-all font-bold flex items-center space-x-2 group"
                >
                  <span>📘</span>
                  <span>Facebook Power</span>
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
          background: linear-gradient(to bottom, #10b981, #3b82f6);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(to bottom, #059669, #2563eb);
        }
      `}</style>
    </div>
  )
}
