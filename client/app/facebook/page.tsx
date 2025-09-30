'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useSocket } from '../../hooks/useSocket'

interface FacebookPage {
  id: string
  name: string
  profilePicture: string
  isConnected: boolean
  liveStreams: number
  totalOrders: number
  revenue: number
}

interface LiveStream {
  id: string
  title: string
  status: 'LIVE' | 'ENDED'
  viewers: number
  comments: number
  orders: number
  revenue: number
  startTime: string
}

export default function FacebookIntegrationPage() {
  const [isVisible, setIsVisible] = useState(false)
  const [connecting, setConnecting] = useState(false)
  const [selectedPage, setSelectedPage] = useState<FacebookPage | null>(null)
  
  // Demo data to show the beauty of the interface
  const [pages, setPages] = useState<FacebookPage[]>([
    {
      id: '1',
      name: 'SystemKH Destroyer Store',
      profilePicture: '🏪',
      isConnected: true,
      liveStreams: 5,
      totalOrders: 234,
      revenue: 12580.50
    },
    {
      id: '2', 
      name: 'LiveSell Pro Demo',
      profilePicture: '🚀',
      isConnected: true,
      liveStreams: 12,
      totalOrders: 567,
      revenue: 28940.75
    }
  ])

  const [liveStreams, setLiveStreams] = useState<LiveStream[]>([
    {
      id: '1',
      title: 'LIVE: Flash Sale - 50% OFF Everything!',
      status: 'LIVE',
      viewers: 1247,
      comments: 89,
      orders: 23,
      revenue: 1876.50,
      startTime: '2:34:12'
    },
    {
      id: '2',
      title: 'Product Launch - New Collection 2024',
      status: 'ENDED',
      viewers: 892,
      comments: 156,
      orders: 34,
      revenue: 2340.25,
      startTime: '1:45:30'
    }
  ])

  useEffect(() => {
    setIsVisible(true)
    if (pages.length > 0) {
      setSelectedPage(pages[0])
    }
  }, [])

  const connectFacebook = async () => {
    setConnecting(true)
    
    // Facebook OAuth Configuration  
    const FACEBOOK_APP_ID = '835145810930761'
    const REDIRECT_URI = encodeURIComponent('http://localhost:3000/facebook/connect-success')
    const SCOPE = encodeURIComponent('pages_read_engagement,pages_manage_posts,pages_show_list')
    
    // Build Facebook OAuth URL
    const facebookAuthUrl = `https://www.facebook.com/v18.0/dialog/oauth?` +
      `client_id=${FACEBOOK_APP_ID}&` +
      `redirect_uri=${REDIRECT_URI}&` +
      `scope=${SCOPE}&` +
      `response_type=code&` +
      `state=facebook_oauth_${Date.now()}`
    
    // Redirect to Facebook OAuth
    window.location.href = facebookAuthUrl
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 relative overflow-hidden">
      {/* Ultra-Modern Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute top-10 left-10 w-96 h-96 bg-gradient-to-r from-blue-400/10 via-purple-400/10 to-pink-400/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/3 right-20 w-80 h-80 bg-gradient-to-r from-emerald-400/8 via-cyan-400/8 to-blue-400/8 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
        <div className="absolute bottom-20 left-1/3 w-72 h-72 bg-gradient-to-r from-pink-400/8 via-orange-400/8 to-red-400/8 rounded-full blur-3xl animate-pulse" style={{animationDelay: '4s'}}></div>
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:60px_60px] animate-pulse"></div>
        
        {/* Floating Elements */}
        <div className="absolute top-1/4 left-1/4 w-3 h-3 bg-blue-400 rounded-full animate-bounce opacity-30"></div>
        <div className="absolute top-3/4 right-1/4 w-2 h-2 bg-purple-400 rounded-full animate-bounce opacity-30" style={{animationDelay: '1s'}}></div>
        <div className="absolute top-1/2 left-3/4 w-2.5 h-2.5 bg-emerald-400 rounded-full animate-bounce opacity-30" style={{animationDelay: '2s'}}></div>
      </div>

      {/* Navigation */}
      <nav className="relative z-50 p-6 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="text-4xl animate-pulse group-hover:scale-110 transition-transform">🚀</div>
            <span className="text-3xl font-black bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              LiveSell Pro
            </span>
          </Link>
          <div className="hidden md:flex items-center space-x-6">
            <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-blue-400 px-4 py-2 rounded-2xl border border-blue-500/40 backdrop-blur-sm flex items-center space-x-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
              <span className="font-medium">Facebook Integration</span>
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
          </div>
        </div>
      </nav>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        {/* Epic Header Section */}
        <div className={`text-center mb-16 transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <div className="inline-flex items-center space-x-3 bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30 rounded-full px-8 py-3 mb-8">
            <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
            <span className="text-blue-400 font-bold text-lg">Facebook Live Commerce Hub</span>
            <div className="w-3 h-3 bg-purple-500 rounded-full animate-pulse" style={{animationDelay: '0.5s'}}></div>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-black mb-6 leading-tight">
            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent animate-pulse">
              Facebook Live
            </span>
            <br />
            <span className="bg-gradient-to-r from-emerald-400 via-cyan-400 to-blue-400 bg-clip-text text-transparent">
              Revenue Machine
            </span>
          </h1>
          
          <p className="text-2xl text-gray-300 max-w-4xl mx-auto mb-8">
            Advanced Facebook monitoring that makes SystemKH look like they're using Internet Explorer from 2003
          </p>

          {/* Advanced Live Indicators */}
          <div className="flex flex-wrap justify-center gap-6 mb-8">
            <div className="bg-red-500/20 border border-red-500/30 rounded-2xl px-6 py-3 flex items-center space-x-3 backdrop-blur-sm">
              <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
              <span className="text-red-400 font-bold">2 Live Streams Active</span>
              <span className="bg-red-500/30 text-red-300 px-2 py-1 rounded-full text-xs font-bold">🔥 HOT</span>
            </div>
            <div className="bg-emerald-500/20 border border-emerald-500/30 rounded-2xl px-6 py-3 flex items-center space-x-3 backdrop-blur-sm">
              <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse"></div>
              <span className="text-emerald-400 font-bold">5-Second Updates</span>
              <span className="bg-emerald-500/30 text-emerald-300 px-2 py-1 rounded-full text-xs font-bold">6X FASTER</span>
            </div>
            <div className="bg-blue-500/20 border border-blue-500/30 rounded-2xl px-6 py-3 flex items-center space-x-3 backdrop-blur-sm">
              <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
              <span className="text-blue-400 font-bold">AI Detection Active</span>
              <span className="bg-blue-500/30 text-blue-300 px-2 py-1 rounded-full text-xs font-bold">🤖 SMART</span>
            </div>
          </div>
        </div>

        {pages.length === 0 ? (
          /* Ultimate No Pages Connected State */
          <div className={`transition-all duration-1000 delay-300 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 via-purple-400/20 to-pink-400/20 rounded-3xl blur-2xl group-hover:blur-3xl transition-all"></div>
              <div className="relative bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-xl rounded-3xl p-16 border border-white/20 shadow-2xl text-center max-w-6xl mx-auto">
                <div className="text-9xl mb-10 animate-bounce">📘</div>
                <h2 className="text-4xl md:text-5xl font-black text-white mb-8">
                  <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                    Connect Your Facebook Empire
                  </span>
                </h2>
                <p className="text-2xl text-gray-300 mb-12 max-w-4xl mx-auto leading-relaxed">
                  Link your Facebook business pages and start monitoring live videos with technology so advanced, 
                  it makes SystemKH developers question their life choices.
                </p>
                
                {/* Epic Feature Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                  <div className="group/feature relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/20 to-green-400/20 rounded-3xl blur-lg group-hover/feature:blur-xl transition-all"></div>
                    <div className="relative bg-gradient-to-br from-emerald-500/20 to-green-500/20 p-8 rounded-3xl border border-emerald-500/40 hover:scale-105 transition-all duration-300">
                      <div className="text-6xl mb-6 group-hover/feature:scale-110 transition-transform">⚡</div>
                      <div className="text-emerald-400 font-black text-2xl mb-4">Lightning Speed</div>
                      <div className="text-gray-300 text-lg leading-relaxed">5-second real-time updates vs SystemKH's embarrassing 30+ second delays</div>
                      <div className="mt-6 bg-emerald-500/30 text-emerald-300 px-4 py-2 rounded-full text-sm font-bold border border-emerald-400/50">
                        6X FASTER
                      </div>
                    </div>
                  </div>
                  
                  <div className="group/feature relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-3xl blur-lg group-hover/feature:blur-xl transition-all"></div>
                    <div className="relative bg-gradient-to-br from-blue-500/20 to-purple-500/20 p-8 rounded-3xl border border-blue-500/40 hover:scale-105 transition-all duration-300">
                      <div className="text-6xl mb-6 group-hover/feature:scale-110 transition-transform">🤖</div>
                      <div className="text-blue-400 font-black text-2xl mb-4">AI-Powered</div>
                      <div className="text-gray-300 text-lg leading-relaxed">Smart order detection and analytics that SystemKH doesn't even know exists</div>
                      <div className="mt-6 bg-blue-500/30 text-blue-300 px-4 py-2 rounded-full text-sm font-bold border border-blue-400/50">
                        EXCLUSIVE
                      </div>
                    </div>
                  </div>
                  
                  <div className="group/feature relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-pink-400/20 to-red-400/20 rounded-3xl blur-lg group-hover/feature:blur-xl transition-all"></div>
                    <div className="relative bg-gradient-to-br from-pink-500/20 to-red-500/20 p-8 rounded-3xl border border-pink-500/40 hover:scale-105 transition-all duration-300">
                      <div className="text-6xl mb-6 group-hover/feature:scale-110 transition-transform">📈</div>
                      <div className="text-pink-400 font-black text-2xl mb-4">Advanced Analytics</div>
                      <div className="text-gray-300 text-lg leading-relaxed">Revenue insights and engagement metrics that make SystemKH look amateur</div>
                      <div className="mt-6 bg-pink-500/30 text-pink-300 px-4 py-2 rounded-full text-sm font-bold border border-pink-400/50">
                        PROFESSIONAL
                      </div>
                    </div>
                  </div>
                </div>

                <button
                  onClick={connectFacebook}
                  disabled={connecting}
                  className="group relative px-16 py-8 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 disabled:from-gray-600 disabled:to-gray-700 text-white font-black text-2xl rounded-3xl transition-all duration-300 shadow-2xl hover:shadow-blue-500/50 hover:scale-105 transform disabled:scale-100"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-3xl blur-xl group-hover:blur-2xl transition-all"></div>
                  <span className="relative z-10 flex items-center justify-center">
                    {connecting ? (
                      <>
                        <div className="spinner mr-4"></div>
                        Connecting to Facebook...
                      </>
                    ) : (
                      <>
                        📘 Connect Facebook & Obliterate SystemKH
                        <svg className="ml-4 w-8 h-8 group-hover:translate-x-2 transition-transform" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </>
                    )}
                  </span>
                </button>

                <div className="mt-12 text-gray-400 text-lg">
                  <p>🔒 Secure OAuth 2.0 • ⚡ Instant Setup • 🏆 Premium Features</p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Enhanced Connected Pages Dashboard */
          <div className="grid grid-cols-1 xl:grid-cols-4 gap-10">
            {/* Modern Pages Sidebar */}
            <div className={`xl:col-span-1 transition-all duration-1000 delay-300 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-gray-600/20 to-gray-800/20 rounded-3xl blur-lg group-hover:blur-xl transition-all"></div>
                <div className="relative bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-2xl">
                  <div className="flex items-center justify-between mb-8">
                    <h3 className="text-2xl font-black text-white">Facebook Pages</h3>
                    <span className="bg-emerald-500/30 text-emerald-300 px-4 py-2 rounded-full text-sm font-bold border border-emerald-400/50">
                      {pages.length} ACTIVE
                    </span>
                  </div>
                  
                  <div className="space-y-4">
                    {pages.map((page, index) => (
                      <div
                        key={page.id}
                        onClick={() => setSelectedPage(page)}
                        className={`group/page p-6 rounded-2xl cursor-pointer transition-all duration-300 ${
                          selectedPage?.id === page.id
                            ? 'bg-gradient-to-r from-emerald-500/30 to-green-500/30 border border-emerald-500/50 scale-105'
                            : 'bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 hover:scale-102'
                        }`}
                      >
                        <div className="flex items-center space-x-4">
                          <div className="text-3xl group-hover/page:scale-110 transition-transform">{page.profilePicture}</div>
                          <div className="flex-1 min-w-0">
                            <div className="text-white font-bold text-lg truncate">{page.name}</div>
                            <div className="text-sm text-gray-400 flex items-center space-x-3 mt-2">
                              <span className="flex items-center">
                                <div className="w-2 h-2 bg-red-400 rounded-full mr-2 animate-pulse"></div>
                                {page.liveStreams} LIVE
                              </span>
                              <span className="flex items-center">
                                <div className="w-2 h-2 bg-emerald-400 rounded-full mr-2"></div>
                                ${page.revenue.toLocaleString()}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="mt-4 grid grid-cols-2 gap-3">
                          <div className="bg-blue-500/20 border border-blue-500/30 rounded-xl p-3 text-center">
                            <div className="text-blue-400 font-bold text-lg">{page.totalOrders}</div>
                            <div className="text-blue-300 text-xs font-medium">Orders</div>
                          </div>
                          <div className="bg-emerald-500/20 border border-emerald-500/30 rounded-xl p-3 text-center">
                            <div className="text-emerald-400 font-bold text-lg">{page.liveStreams}</div>
                            <div className="text-emerald-300 text-xs font-medium">Streams</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={connectFacebook}
                    className="mt-8 w-full bg-gradient-to-r from-blue-500/20 to-purple-500/20 hover:from-blue-500/30 hover:to-purple-500/30 text-blue-400 py-4 px-6 rounded-2xl border border-blue-500/30 hover:border-blue-400/50 transition-all duration-300 font-bold flex items-center justify-center group hover:scale-105"
                  >
                    <span>➕</span>
                    <span className="ml-2">Add Another Page</span>
                    <svg className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            {/* Enhanced Main Dashboard */}
            <div className={`xl:col-span-3 space-y-10 transition-all duration-1000 delay-500 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
              {/* Epic Stats Overview */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                <div className="group relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/20 to-green-400/20 rounded-2xl blur-lg group-hover:blur-xl transition-all"></div>
                  <div className="relative bg-gradient-to-br from-emerald-500/20 to-green-500/20 backdrop-blur-xl rounded-2xl p-8 border border-emerald-500/40 hover:scale-105 transition-all duration-300">
                    <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">📈</div>
                    <div className="text-3xl font-black text-emerald-400 mb-2">${selectedPage?.revenue.toLocaleString()}</div>
                    <div className="text-gray-400 font-medium">Total Revenue</div>
                    <div className="mt-4 h-2 bg-emerald-900/50 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-emerald-400 to-green-400 rounded-full w-4/5 animate-pulse"></div>
                    </div>
                  </div>
                </div>
                
                <div className="group relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-cyan-400/20 rounded-2xl blur-lg group-hover:blur-xl transition-all"></div>
                  <div className="relative bg-gradient-to-br from-blue-500/20 to-cyan-500/20 backdrop-blur-xl rounded-2xl p-8 border border-blue-500/40 hover:scale-105 transition-all duration-300">
                    <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">🛒</div>
                    <div className="text-3xl font-black text-blue-400 mb-2">{selectedPage?.totalOrders}</div>
                    <div className="text-gray-400 font-medium">Total Orders</div>
                    <div className="mt-4 h-2 bg-blue-900/50 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full w-3/4 animate-pulse"></div>
                    </div>
                  </div>
                </div>
                
                <div className="group relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-400/20 to-pink-400/20 rounded-2xl blur-lg group-hover:blur-xl transition-all"></div>
                  <div className="relative bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-xl rounded-2xl p-8 border border-purple-500/40 hover:scale-105 transition-all duration-300">
                    <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">📺</div>
                    <div className="text-3xl font-black text-purple-400 mb-2">{selectedPage?.liveStreams}</div>
                    <div className="text-gray-400 font-medium">Live Streams</div>
                    <div className="mt-4 h-2 bg-purple-900/50 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-purple-400 to-pink-400 rounded-full w-2/3 animate-pulse"></div>
                    </div>
                  </div>
                </div>
                
                <div className="group relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-orange-400/20 to-red-400/20 rounded-2xl blur-lg group-hover:blur-xl transition-all"></div>
                  <div className="relative bg-gradient-to-br from-orange-500/20 to-red-500/20 backdrop-blur-xl rounded-2xl p-8 border border-orange-500/40 hover:scale-105 transition-all duration-300">
                    <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">⚡</div>
                    <div className="text-3xl font-black text-orange-400 mb-2">5s</div>
                    <div className="text-gray-400 font-medium">Update Speed</div>
                    <div className="mt-4 h-2 bg-orange-900/50 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-orange-400 to-red-400 rounded-full w-full animate-pulse"></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Epic Live Streams & Activity */}
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-gray-600/20 to-gray-800/20 rounded-3xl blur-lg group-hover:blur-xl transition-all"></div>
                <div className="relative bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-xl rounded-3xl p-10 border border-white/20 shadow-2xl">
                  <div className="flex items-center justify-between mb-10">
                    <h3 className="text-3xl font-black text-white">Live Streams & Revenue Activity</h3>
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-emerald-400 rounded-full animate-pulse"></div>
                        <span className="text-emerald-400 font-bold">Real-time monitoring</span>
                      </div>
                      <div className="bg-red-500/30 text-red-300 px-4 py-2 rounded-full text-sm font-bold border border-red-400/50 animate-pulse">
                        🔥 LIVE NOW
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    {liveStreams.map((stream, index) => (
                      <div key={stream.id} className={`group/stream bg-gradient-to-r from-gray-700/50 to-gray-800/50 rounded-2xl p-8 border border-white/20 transition-all duration-500 hover:scale-[1.02] hover:bg-gradient-to-r hover:from-gray-600/50 hover:to-gray-700/50`}>
                        <div className="flex items-start justify-between mb-6">
                          <div className="flex-1">
                            <div className="flex items-center space-x-4 mb-3">
                              <h4 className="font-black text-white text-xl group-hover/stream:text-emerald-400 transition-colors">{stream.title}</h4>
                              <div className="flex items-center space-x-2">
                                <span className={`px-4 py-2 rounded-full text-sm font-black border ${
                                  stream.status === 'LIVE' 
                                    ? 'bg-red-500/30 text-red-300 border-red-400/50 animate-pulse' 
                                    : 'bg-gray-500/30 text-gray-300 border-gray-400/50'
                                }`}>
                                  {stream.status === 'LIVE' ? '🔴 LIVE' : '⚫ ENDED'}
                                </span>
                                {stream.status === 'LIVE' && (
                                  <span className="bg-orange-500/30 text-orange-300 px-3 py-2 rounded-full text-sm font-bold border border-orange-400/50">
                                    🔥 HOT
                                  </span>
                                )}
                              </div>
                            </div>
                            <div className="text-gray-400 font-medium text-lg">
                              📘 {selectedPage?.name} • Duration: {stream.startTime}
                            </div>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-4 gap-8">
                          <div className="text-center group/stat">
                            <div className="text-3xl font-black text-blue-400 group-hover/stat:scale-110 transition-transform">{stream.viewers.toLocaleString()}</div>
                            <div className="text-sm text-gray-400 font-medium mt-1">Live Viewers</div>
                            <div className="mt-3 h-1.5 bg-blue-900/50 rounded-full overflow-hidden">
                              <div className="h-full bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full w-4/5 animate-pulse"></div>
                            </div>
                          </div>
                          <div className="text-center group/stat">
                            <div className="text-3xl font-black text-purple-400 group-hover/stat:scale-110 transition-transform">{stream.comments}</div>
                            <div className="text-sm text-gray-400 font-medium mt-1">Comments</div>
                            <div className="mt-3 h-1.5 bg-purple-900/50 rounded-full overflow-hidden">
                              <div className="h-full bg-gradient-to-r from-purple-400 to-pink-400 rounded-full w-3/4 animate-pulse"></div>
                            </div>
                          </div>
                          <div className="text-center group/stat">
                            <div className="text-3xl font-black text-emerald-400 group-hover/stat:scale-110 transition-transform">{stream.orders}</div>
                            <div className="text-sm text-gray-400 font-medium mt-1">Orders</div>
                            <div className="mt-3 h-1.5 bg-emerald-900/50 rounded-full overflow-hidden">
                              <div className="h-full bg-gradient-to-r from-emerald-400 to-green-400 rounded-full w-2/3 animate-pulse"></div>
                            </div>
                          </div>
                          <div className="text-center group/stat">
                            <div className="text-3xl font-black text-orange-400 group-hover/stat:scale-110 transition-transform">${stream.revenue.toLocaleString()}</div>
                            <div className="text-sm text-gray-400 font-medium mt-1">Revenue</div>
                            <div className="mt-3 h-1.5 bg-orange-900/50 rounded-full overflow-hidden">
                              <div className="h-full bg-gradient-to-r from-orange-400 to-red-400 rounded-full w-5/6 animate-pulse"></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Ultimate Competitive Advantage Footer */}
        <div className={`text-center mt-20 transition-all duration-1000 delay-700 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 via-purple-400/20 to-pink-400/20 rounded-3xl blur-2xl group-hover:blur-3xl transition-all"></div>
            <div className="relative bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 border border-blue-500/30 rounded-3xl px-12 py-10 max-w-6xl mx-auto backdrop-blur-xl">
              <div className="mb-8">
                <h3 className="text-4xl font-black text-blue-400 mb-4">🏆 Facebook Integration Superiority</h3>
                <p className="text-xl text-gray-300 max-w-4xl mx-auto">
                  While SystemKH users are still manually refreshing their browsers, you're already counting the profits
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="group/comp bg-gradient-to-br from-emerald-500/20 to-green-500/20 rounded-2xl p-8 border border-emerald-500/40 hover:scale-105 transition-all">
                  <div className="text-5xl mb-6 group-hover/comp:scale-110 transition-transform">⚡</div>
                  <div className="font-black text-emerald-400 text-xl mb-3">6x Faster Updates</div>
                  <div className="text-gray-300 leading-relaxed">5-second real-time monitoring vs SystemKH's embarrassing 30+ second delays</div>
                  <div className="mt-6 bg-emerald-500/30 text-emerald-300 px-4 py-2 rounded-full text-sm font-bold border border-emerald-400/50">
                    REAL-TIME
                  </div>
                </div>
                
                <div className="group/comp bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-2xl p-8 border border-blue-500/40 hover:scale-105 transition-all">
                  <div className="text-5xl mb-6 group-hover/comp:scale-110 transition-transform">🤖</div>
                  <div className="font-black text-blue-400 text-xl mb-3">AI-Powered Detection</div>
                  <div className="text-gray-300 leading-relaxed">Smart order recognition and analytics that SystemKH doesn't even know exists</div>
                  <div className="mt-6 bg-blue-500/30 text-blue-300 px-4 py-2 rounded-full text-sm font-bold border border-blue-400/50">
                    EXCLUSIVE
                  </div>
                </div>
                
                <div className="group/comp bg-gradient-to-br from-pink-500/20 to-red-500/20 rounded-2xl p-8 border border-pink-500/40 hover:scale-105 transition-all">
                  <div className="text-5xl mb-6 group-hover/comp:scale-110 transition-transform">💰</div>
                  <div className="font-black text-pink-400 text-xl mb-3">34% Better Value</div>
                  <div className="text-gray-300 leading-relaxed">Save $10/month vs SystemKH while getting superior features and performance</div>
                  <div className="mt-6 bg-pink-500/30 text-pink-300 px-4 py-2 rounded-full text-sm font-bold border border-pink-400/50">
                    BEST DEAL
                  </div>
                </div>
              </div>

              <div className="mt-10 flex flex-wrap justify-center gap-6">
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
                  href="/realtime"
                  className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 hover:from-blue-500/30 hover:to-purple-500/30 text-blue-400 px-8 py-4 rounded-2xl border border-blue-500/40 hover:border-blue-400/60 transition-all font-bold flex items-center space-x-2 group"
                >
                  <span>⚡</span>
                  <span>Real-time Power</span>
                  <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}