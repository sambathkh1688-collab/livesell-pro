'use client'

import { useState, useEffect } from 'react'
import { useFacebookDashboard } from '../hooks/useFacebookDashboard'

interface FacebookAnalyticsProps {
  className?: string
}

export default function FacebookAnalytics({ className = '' }: FacebookAnalyticsProps) {
  const { stats, liveStreams, loading, error, isConnected } = useFacebookDashboard()
  const [animationStage, setAnimationStage] = useState(0)

  useEffect(() => {
    const timer = setTimeout(() => setAnimationStage(1), 100)
    return () => clearTimeout(timer)
  }, [])

  if (loading) {
    return (
      <div className={`${className} bg-gradient-to-br from-slate-800/50 to-purple-800/30 rounded-2xl p-6 border border-purple-500/20 backdrop-blur-sm`}>
        <div className="animate-pulse">
          <div className="h-6 bg-purple-400/20 rounded-xl mb-4"></div>
          <div className="space-y-3">
            <div className="h-4 bg-purple-400/10 rounded-lg"></div>
            <div className="h-4 bg-purple-400/10 rounded-lg w-3/4"></div>
            <div className="h-4 bg-purple-400/10 rounded-lg w-1/2"></div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className={`${className} bg-gradient-to-br from-red-800/30 to-slate-800/50 rounded-2xl p-6 border border-red-500/20 backdrop-blur-sm`}>
        <div className="text-red-400 text-center">
          <div className="text-2xl mb-2">⚠️</div>
          <p className="text-sm">Failed to load Facebook data</p>
          <p className="text-xs text-red-300 mt-1">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className={`${className} space-y-6`}>
      {/* Connection Status */}
      <div className={`bg-gradient-to-r from-slate-800/50 to-purple-800/30 rounded-2xl p-4 border border-purple-500/20 backdrop-blur-sm transition-all duration-700 ${
        animationStage >= 1 ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
      }`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-emerald-400' : 'bg-red-400'} animate-pulse`}></div>
            <span className="text-white font-medium">Facebook Integration</span>
          </div>
          <div className="text-xs text-gray-400">
            {isConnected ? '🟢 Real-time' : '🔴 Offline'}
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className={`bg-gradient-to-br from-emerald-800/30 to-slate-800/50 rounded-xl p-4 border border-emerald-500/20 backdrop-blur-sm transition-all duration-700 delay-100 ${
          animationStage >= 1 ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
        }`}>
          <div className="text-emerald-400 text-sm mb-1">Connected Pages</div>
          <div className="text-2xl font-bold text-white">{stats.connectedPages}</div>
          <div className="text-xs text-emerald-300">SystemKH limits pages</div>
        </div>

        <div className={`bg-gradient-to-br from-red-800/30 to-slate-800/50 rounded-xl p-4 border border-red-500/20 backdrop-blur-sm transition-all duration-700 delay-200 ${
          animationStage >= 1 ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
        }`}>
          <div className="text-red-400 text-sm mb-1">Live Streams</div>
          <div className="text-2xl font-bold text-white flex items-center">
            {stats.activeLiveStreams}
            {stats.activeLiveStreams > 0 && <span className="text-red-400 ml-2 animate-pulse">🔴</span>}
          </div>
          <div className="text-xs text-red-300">Real-time monitoring</div>
        </div>

        <div className={`bg-gradient-to-br from-blue-800/30 to-slate-800/50 rounded-xl p-4 border border-blue-500/20 backdrop-blur-sm transition-all duration-700 delay-300 ${
          animationStage >= 1 ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
        }`}>
          <div className="text-blue-400 text-sm mb-1">Total Comments</div>
          <div className="text-2xl font-bold text-white">{stats.totalComments.toLocaleString()}</div>
          <div className="text-xs text-blue-300">Auto-detected</div>
        </div>

        <div className={`bg-gradient-to-br from-purple-800/30 to-slate-800/50 rounded-xl p-4 border border-purple-500/20 backdrop-blur-sm transition-all duration-700 delay-400 ${
          animationStage >= 1 ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
        }`}>
          <div className="text-purple-400 text-sm mb-1">Engagement Rate</div>
          <div className="text-2xl font-bold text-white">{stats.engagementRate}%</div>
          <div className="text-xs text-purple-300">Live tracking</div>
        </div>
      </div>

      {/* Active Live Streams */}
      {liveStreams.length > 0 && (
        <div className={`bg-gradient-to-br from-slate-800/50 to-purple-800/30 rounded-2xl p-6 border border-purple-500/20 backdrop-blur-sm transition-all duration-700 delay-500 ${
          animationStage >= 1 ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
        }`}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-white">🔴 Live Streams</h3>
            <span className="text-xs text-purple-400 bg-purple-500/20 px-2 py-1 rounded-lg">
              {liveStreams.filter((s: any) => s.status === 'LIVE').length} active
            </span>
          </div>
          
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {liveStreams.slice(0, 5).map((stream: any, index: number) => (
              <div key={stream.streamId} className="bg-slate-700/30 rounded-xl p-3 border border-slate-600/20">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <div className={`w-2 h-2 rounded-full ${stream.status === 'LIVE' ? 'bg-red-400' : 'bg-gray-400'}`}></div>
                      <span className="text-white font-medium text-sm truncate">{stream.title}</span>
                    </div>
                    <div className="text-xs text-gray-400 mb-2">{stream.pageName}</div>
                    <div className="flex items-center space-x-4 text-xs">
                      <span className="text-emerald-400">👥 {stream.viewers}</span>
                      <span className="text-blue-400">💬 {stream.comments}</span>
                      <span className="text-purple-400">📈 {stream.engagementRate}%</span>
                      <span className="text-orange-400">⏱️ {stream.duration}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent Activity */}
      {stats.recentActivity.length > 0 && (
        <div className={`bg-gradient-to-br from-slate-800/50 to-blue-800/30 rounded-2xl p-6 border border-blue-500/20 backdrop-blur-sm transition-all duration-700 delay-600 ${
          animationStage >= 1 ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
        }`}>
          <h3 className="text-lg font-bold text-white mb-4">📊 Recent Activity</h3>
          
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {stats.recentActivity.slice(0, 8).map((activity: any, index: number) => (
              <div key={activity.id} className="flex items-center space-x-3 p-2 rounded-lg bg-slate-700/20">
                <div className="text-lg">
                  {activity.type === 'comment' && '💬'}
                  {activity.type === 'live_start' && '🔴'}
                  {activity.type === 'live_end' && '⚫'}
                  {activity.type === 'page_connect' && '🔗'}
                  {activity.type === 'engagement' && '📈'}
                </div>
                <div className="flex-1">
                  <div className="text-sm text-white">{activity.message}</div>
                  <div className="text-xs text-gray-400 flex items-center space-x-2">
                    <span>{activity.pageName}</span>
                    <span>•</span>
                    <span>{activity.timestamp}</span>
                  </div>
                </div>
                {activity.value && (
                  <div className="text-sm text-emerald-400 font-medium">
                    {activity.value}%
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SystemKH Comparison */}
      <div className={`bg-gradient-to-r from-emerald-800/20 to-blue-800/20 rounded-2xl p-4 border border-emerald-500/30 backdrop-blur-sm transition-all duration-700 delay-700 ${
        animationStage >= 1 ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
      }`}>
        <div className="text-center">
          <div className="text-emerald-400 font-bold mb-2">🚀 LiveSell Pro vs SystemKH</div>
          <div className="text-xs text-gray-300 space-y-1">
            <div>✅ Real-time Socket.IO updates (SystemKH: 30s delays)</div>
            <div>✅ Unlimited Facebook pages (SystemKH: Limited)</div>
            <div>✅ Live engagement tracking (SystemKH: Static reports)</div>
            <div>✅ Modern React dashboard (SystemKH: Legacy interface)</div>
          </div>
        </div>
      </div>

      {/* No Data State */}
      {stats.connectedPages === 0 && (
        <div className={`bg-gradient-to-br from-yellow-800/20 to-slate-800/50 rounded-2xl p-6 border border-yellow-500/20 backdrop-blur-sm text-center transition-all duration-700 delay-300 ${
          animationStage >= 1 ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
        }`}>
          <div className="text-4xl mb-2">📘</div>
          <h3 className="text-lg font-bold text-white mb-2">Connect Your Facebook Pages</h3>
          <p className="text-gray-400 text-sm mb-4">
            Start monitoring live streams and comments in real-time
          </p>
          <a 
            href="/facebook" 
            className="inline-flex items-center px-4 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors text-sm font-medium"
          >
            🔗 Connect Facebook Pages
          </a>
        </div>
      )}
    </div>
  )
}