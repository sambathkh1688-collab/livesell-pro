'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

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
    await new Promise(resolve => setTimeout(resolve, 2000))
    setConnecting(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-r from-blue-400/10 to-purple-400/10 rounded-full blur-xl animate-float"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-gradient-to-r from-emerald-400/10 to-blue-400/10 rounded-full blur-xl animate-float-delayed"></div>
        <div className="absolute bottom-20 left-1/4 w-40 h-40 bg-gradient-to-r from-pink-400/10 to-purple-400/10 rounded-full blur-xl animate-float-slow"></div>
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:50px_50px]"></div>
      </div>

      {/* Navigation */}
      <nav className="relative z-50 p-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-3">
            <div className="text-3xl animate-pulse">🚀</div>
            <span className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-blue-400 bg-clip-text text-transparent">
              LiveSell Pro
            </span>
          </Link>
          <div className="hidden md:flex items-center space-x-6">
            <span className="text-gray-300">Facebook Integration</span>
            <Link href="/dashboard" className="bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 px-4 py-2 rounded-xl border border-emerald-500/30 transition-all backdrop-blur-sm">
              Dashboard
            </Link>
          </div>
        </div>
      </nav>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        {/* Header */}
        <div className={`text-center mb-12 transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <h1 className="text-4xl md:text-6xl font-black mb-4 leading-tight">
            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Facebook Live
            </span>
            <br />
            <span className="bg-gradient-to-r from-emerald-400 to-green-400 bg-clip-text text-transparent">
              Domination Center
            </span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Real-time monitoring that makes SystemKH look like a toy from the stone age
          </p>

          {/* Live Indicators */}
          <div className="flex flex-wrap justify-center gap-4 mt-8">
            <div className="bg-red-500/20 border border-red-500/30 rounded-full px-4 py-2 flex items-center space-x-2">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
              <span className="text-red-400 font-medium text-sm">2 Live Streams Active</span>
            </div>
            <div className="bg-emerald-500/20 border border-emerald-500/30 rounded-full px-4 py-2 flex items-center space-x-2">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
              <span className="text-emerald-400 font-medium text-sm">Real-time Updates Every 5 Seconds</span>
            </div>
            <div className="bg-blue-500/20 border border-blue-500/30 rounded-full px-4 py-2 flex items-center space-x-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
              <span className="text-blue-400 font-medium text-sm">AI Detection Active</span>
            </div>
          </div>
        </div>

        {pages.length === 0 ? (
          /* No Pages Connected State */
          <div className={`transition-all duration-1000 delay-300 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-xl rounded-3xl p-12 border border-white/10 shadow-2xl text-center max-w-4xl mx-auto">
              <div className="text-8xl mb-8 animate-bounce">📘</div>
              <h2 className="text-3xl font-bold text-white mb-6">
                Connect Your Facebook Empire
              </h2>
              <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
                Link your Facebook business pages and start monitoring live videos with technology that makes SystemKH developers cry.
              </p>
              
              {/* Feature Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                <div className="bg-gradient-to-br from-emerald-500/20 to-green-500/20 p-6 rounded-2xl border border-emerald-500/30">
                  <div className="text-4xl mb-4">⚡</div>
                  <div className="text-emerald-400 font-bold text-lg mb-2">Lightning Speed</div>
                  <div className="text-gray-300 text-sm">5-second updates vs SystemKH's embarrassing 30+ seconds</div>
                </div>
                <div className="bg-gradient-to-br from-blue-500/20 to-purple-500/20 p-6 rounded-2xl border border-blue-500/30">
                  <div className="text-4xl mb-4">🤖</div>
                  <div className="text-blue-400 font-bold text-lg mb-2">AI-Powered</div>
                  <div className="text-gray-300 text-sm">Smart order detection SystemKH doesn't even know exists</div>
                </div>
                <div className="bg-gradient-to-br from-pink-500/20 to-red-500/20 p-6 rounded-2xl border border-pink-500/30">
                  <div className="text-4xl mb-4">📈</div>
                  <div className="text-pink-400 font-bold text-lg mb-2">Advanced Analytics</div>
                  <div className="text-gray-300 text-sm">Revenue insights that make SystemKH look amateur</div>
                </div>
              </div>

              <button
                onClick={connectFacebook}
                disabled={connecting}
                className="group relative px-12 py-6 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 disabled:from-gray-600 disabled:to-gray-700 text-white font-bold text-xl rounded-2xl transition-all duration-300 shadow-2xl hover:shadow-blue-500/50 hover:scale-105 transform disabled:scale-100"
              >
                <span className="relative z-10 flex items-center justify-center">
                  {connecting ? (
                    <>
                      <div className="spinner mr-3"></div>
                      Connecting to Facebook...
                    </>
                  ) : (
                    <>
                      📘 Connect Facebook & Crush SystemKH
                      <svg className="ml-3 w-6 h-6 group-hover:translate-x-1 transition-transform" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </>
                  )}
                </span>
              </button>
            </div>
          </div>
        ) : (
          /* Connected Pages Dashboard */
          <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
            {/* Pages Sidebar */}
            <div className={`xl:col-span-1 transition-all duration-1000 delay-300 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
              <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-xl rounded-3xl p-6 border border-white/10 shadow-2xl">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-white">Connected Pages</h3>
                  <span className="bg-emerald-500/20 text-emerald-400 px-3 py-1 rounded-full text-xs font-medium">
                    {pages.length} Active
                  </span>
                </div>
                
                <div className="space-y-3">
                  {pages.map((page) => (
                    <div
                      key={page.id}
                      onClick={() => setSelectedPage(page)}
                      className={`p-4 rounded-2xl cursor-pointer transition-all duration-300 ${
                        selectedPage?.id === page.id
                          ? 'bg-gradient-to-r from-emerald-500/30 to-green-500/30 border border-emerald-500/50'
                          : 'bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <div className="text-2xl">{page.profilePicture}</div>
                        <div className="flex-1 min-w-0">
                          <div className="text-white font-medium truncate">{page.name}</div>
                          <div className="text-xs text-gray-400 flex items-center space-x-2">
                            <span className="flex items-center">
                              <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full mr-1"></div>
                              {page.liveStreams} streams
                            </span>
                            <span>•</span>
                            <span>${page.revenue.toLocaleString()}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <button
                  onClick={connectFacebook}
                  className="mt-6 w-full bg-gradient-to-r from-blue-500/20 to-purple-500/20 hover:from-blue-500/30 hover:to-purple-500/30 text-blue-400 py-3 px-4 rounded-xl border border-blue-500/30 hover:border-blue-400/50 transition-all duration-300 font-medium"
                >
                  + Add Another Page
                </button>
              </div>
            </div>

            {/* Main Dashboard */}
            <div className={`xl:col-span-3 space-y-8 transition-all duration-1000 delay-500 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
              {/* Stats Overview */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-gradient-to-br from-emerald-500/20 to-green-500/20 backdrop-blur-xl rounded-2xl p-6 border border-emerald-500/30">
                  <div className="text-3xl mb-2">📈</div>
                  <div className="text-2xl font-bold text-emerald-400">${selectedPage?.revenue.toLocaleString()}</div>
                  <div className="text-gray-400 text-sm">Total Revenue</div>
                </div>
                <div className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 backdrop-blur-xl rounded-2xl p-6 border border-blue-500/30">
                  <div className="text-3xl mb-2">🛒</div>
                  <div className="text-2xl font-bold text-blue-400">{selectedPage?.totalOrders}</div>
                  <div className="text-gray-400 text-sm">Total Orders</div>
                </div>
                <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-xl rounded-2xl p-6 border border-purple-500/30">
                  <div className="text-3xl mb-2">📺</div>
                  <div className="text-2xl font-bold text-purple-400">{selectedPage?.liveStreams}</div>
                  <div className="text-gray-400 text-sm">Live Streams</div>
                </div>
                <div className="bg-gradient-to-br from-orange-500/20 to-red-500/20 backdrop-blur-xl rounded-2xl p-6 border border-orange-500/30">
                  <div className="text-3xl mb-2">⚡</div>
                  <div className="text-2xl font-bold text-orange-400">5s</div>
                  <div className="text-gray-400 text-sm">Update Speed</div>
                </div>
              </div>

              {/* Live Streams */}
              <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-xl rounded-3xl p-8 border border-white/10 shadow-2xl">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold text-white">Live Streams & Activity</h3>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                    <span className="text-emerald-400 font-medium">Real-time monitoring active</span>
                  </div>
                </div>

                <div className="space-y-4">
                  {liveStreams.map((stream) => (
                    <div key={stream.id} className="bg-gradient-to-r from-gray-700/50 to-gray-800/50 rounded-2xl p-6 border border-white/10">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h4 className="font-bold text-white text-lg">{stream.title}</h4>
                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                              stream.status === 'LIVE' 
                                ? 'bg-red-500/20 text-red-400 border border-red-500/30' 
                                : 'bg-gray-500/20 text-gray-400 border border-gray-500/30'
                            }`}>
                              {stream.status === 'LIVE' ? '🔴 LIVE' : '⚫ ENDED'}
                            </span>
                          </div>
                          <div className="text-sm text-gray-400">
                            Duration: {stream.startTime}
                          </div>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-4 gap-6">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-blue-400">{stream.viewers.toLocaleString()}</div>
                          <div className="text-xs text-gray-400">Viewers</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-purple-400">{stream.comments}</div>
                          <div className="text-xs text-gray-400">Comments</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-emerald-400">{stream.orders}</div>
                          <div className="text-xs text-gray-400">Orders</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-orange-400">${stream.revenue.toLocaleString()}</div>
                          <div className="text-xs text-gray-400">Revenue</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Competitive Advantage Footer */}
        <div className={`text-center mt-16 transition-all duration-1000 delay-700 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <div className="bg-gradient-to-r from-emerald-500/10 to-green-500/10 border border-emerald-500/20 rounded-2xl px-8 py-6 max-w-4xl mx-auto">
            <h3 className="text-xl font-bold text-emerald-400 mb-4">🏆 Why You Made the Right Choice</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
              <div className="text-gray-300">
                <div className="font-semibold text-emerald-400">6x Faster Updates</div>
                <div>5-second real-time vs SystemKH's sluggish 30+ seconds</div>
              </div>
              <div className="text-gray-300">
                <div className="font-semibold text-blue-400">AI-Powered Detection</div>
                <div>Smart order recognition SystemKH doesn't have</div>
              </div>
              <div className="text-gray-300">
                <div className="font-semibold text-purple-400">34% Better Pricing</div>
                <div>Save $10/month vs SystemKH with superior features</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}