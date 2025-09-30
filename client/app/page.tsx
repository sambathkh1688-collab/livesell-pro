'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function HomePage() {
  const [isVisible, setIsVisible] = useState(false)
  const [activeFeature, setActiveFeature] = useState(0)

  useEffect(() => {
    setIsVisible(true)
    
    // Auto-rotate features
    const interval = setInterval(() => {
      setActiveFeature(prev => (prev + 1) % 4)
    }, 3000)
    
    return () => clearInterval(interval)
  }, [])

  const features = [
    { icon: '🤖', title: 'AI-Powered', desc: 'Smart automation SystemKH lacks' },
    { icon: '⚡', title: '6x Faster', desc: '5-sec updates vs 30+ seconds' },
    { icon: '💰', title: '34% Cheaper', desc: 'Better pricing, superior features' },
    { icon: '📱', title: 'Mobile-First', desc: 'Perfect PWA experience' }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-500/5 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      {/* Beautiful Navigation */}
      <nav className="relative z-10 bg-white/5 backdrop-blur-xl border-b border-white/10 shadow-2xl">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-r from-emerald-400 via-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg animate-pulse">
                <span className="text-white font-bold text-2xl">🚀</span>
              </div>
              <div>
                <span className="text-white font-black text-2xl bg-gradient-to-r from-emerald-400 to-blue-500 bg-clip-text text-transparent">LiveSell Pro</span>
                <div className="text-xs text-emerald-400 font-semibold">SystemKH Killer</div>
              </div>
            </div>
            
            <div className="hidden md:flex items-center space-x-8">
              <Link href="/features" className="text-white/80 hover:text-white px-4 py-2 rounded-xl hover:bg-white/10 transition-all duration-300 font-medium">
                Features
              </Link>
              <Link href="/pricing" className="text-white/80 hover:text-white px-4 py-2 rounded-xl hover:bg-white/10 transition-all duration-300 font-medium">
                Pricing
              </Link>
              <Link href="/register" className="bg-gradient-to-r from-emerald-500 to-blue-600 hover:from-emerald-600 hover:to-blue-700 text-white px-8 py-3 rounded-xl font-bold transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105">
                Start Free Trial
              </Link>
              <Link href="/login" className="border-2 border-white/20 text-white px-8 py-3 rounded-xl hover:bg-white/10 hover:border-white/40 transition-all duration-300 font-bold backdrop-blur-sm">
                Login
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="relative z-10">
        {/* Hero Section */}
        <div className={`max-w-7xl mx-auto px-6 py-20 text-center transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <div className="mb-6">
            <span className="inline-block bg-gradient-to-r from-red-500 to-orange-500 text-white px-6 py-2 rounded-full text-sm font-bold mb-4 animate-bounce">
              🔥 SystemKH DESTROYER LAUNCHED!
            </span>
          </div>
          
          <h1 className="text-7xl md:text-8xl font-black mb-8 leading-tight">
            <span className="bg-gradient-to-r from-white via-blue-100 to-white bg-clip-text text-transparent">
              The Future of
            </span>
            <br />
            <span className="bg-gradient-to-r from-emerald-400 via-blue-500 to-purple-600 bg-clip-text text-transparent animate-pulse">
              Live Commerce
            </span>
          </h1>
          
          <p className="text-2xl text-gray-300 mb-12 max-w-4xl mx-auto leading-relaxed">
            Experience the most advanced Facebook Live selling platform ever created.
            <br />
            <span className="text-emerald-400 font-bold">34% cheaper</span> than SystemKH • 
            <span className="text-blue-400 font-bold"> 6x faster</span> • 
            <span className="text-purple-400 font-bold"> AI-powered</span>
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16">
            <Link href="/register">
              <button className="group bg-gradient-to-r from-emerald-500 via-green-500 to-emerald-600 hover:from-emerald-600 hover:via-green-600 hover:to-emerald-700 text-white px-12 py-5 rounded-2xl font-bold text-xl transition-all duration-300 shadow-2xl hover:shadow-emerald-500/25 hover:scale-110 transform">
                <span className="flex items-center justify-center gap-3">
                  🎯 Start Crushing SystemKH
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                </span>
              </button>
            </Link>
            <Link href="/login">
              <button className="group bg-gradient-to-r from-blue-500 via-purple-500 to-blue-600 hover:from-blue-600 hover:via-purple-600 hover:to-blue-700 text-white px-12 py-5 rounded-2xl font-bold text-xl transition-all duration-300 shadow-2xl hover:shadow-blue-500/25 hover:scale-110 transform">
                <span className="flex items-center justify-center gap-3">
                  🚀 Login to Dominate
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                </span>
              </button>
            </Link>
          </div>

          {/* Dynamic Features Showcase */}
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className={`p-6 rounded-2xl backdrop-blur-xl border transition-all duration-500 transform hover:scale-105 ${
                    activeFeature === index
                      ? 'bg-gradient-to-br from-white/20 to-white/5 border-emerald-400/50 shadow-xl shadow-emerald-500/20'
                      : 'bg-white/5 border-white/10 hover:bg-white/10'
                  }`}
                >
                  <div className="text-4xl mb-3">{feature.icon}</div>
                  <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
                  <p className="text-gray-300 text-sm">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Competitive Comparison Section */}
        <div className="max-w-7xl mx-auto px-6 py-20">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-black text-white mb-6">
              Why Choose <span className="text-emerald-400">LiveSell Pro</span>?
            </h2>
            <p className="text-xl text-gray-300">
              See how we absolutely destroy the competition
            </p>
          </div>

          <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/10 shadow-2xl">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="text-6xl mb-4">💀</div>
                <h3 className="text-2xl font-bold text-red-400 mb-2">SystemKH</h3>
                <ul className="text-gray-400 space-y-2">
                  <li>❌ 30+ second delays</li>
                  <li>❌ Outdated PHP technology</li>
                  <li>❌ No AI features</li>
                  <li>❌ Expensive pricing</li>
                  <li>❌ Limited to 5 pages</li>
                </ul>
              </div>
              
              <div className="text-center relative">
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 to-blue-500/20 rounded-2xl"></div>
                <div className="relative z-10 p-6">
                  <div className="text-6xl mb-4">🏆</div>
                  <h3 className="text-2xl font-bold text-emerald-400 mb-2">LiveSell Pro</h3>
                  <ul className="text-gray-200 space-y-2">
                    <li>✅ 5-second real-time updates</li>
                    <li>✅ Modern Next.js 14 tech</li>
                    <li>✅ AI-powered automation</li>
                    <li>✅ 34% cheaper pricing</li>
                    <li>✅ Unlimited pages</li>
                  </ul>
                </div>
              </div>

              <div className="text-center">
                <div className="text-6xl mb-4">📈</div>
                <h3 className="text-2xl font-bold text-blue-400 mb-2">Your Results</h3>
                <ul className="text-gray-300 space-y-2">
                  <li>🚀 6x faster performance</li>
                  <li>💰 Save $10+ per month</li>
                  <li>📊 Better analytics</li>
                  <li>🤖 AI automation</li>
                  <li>📱 Perfect mobile experience</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="max-w-7xl mx-auto px-6 py-20 text-center">
          <div className="bg-gradient-to-r from-emerald-500/10 via-blue-500/10 to-purple-500/10 backdrop-blur-xl rounded-3xl p-12 border border-white/10 shadow-2xl">
            <h2 className="text-4xl font-black text-white mb-6">
              Ready to Destroy SystemKH?
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Join thousands of successful merchants already making more money with LiveSell Pro
            </p>
            <Link href="/register">
              <button className="bg-gradient-to-r from-emerald-500 to-blue-600 hover:from-emerald-600 hover:to-blue-700 text-white px-16 py-6 rounded-2xl font-bold text-2xl transition-all duration-300 shadow-2xl hover:shadow-emerald-500/25 hover:scale-110 transform">
                🎯 Start Your Domination Today
              </button>
            </Link>
            <div className="mt-6 text-gray-400">
              <span className="text-emerald-400 font-bold">Free trial</span> • No credit card required • Setup in 2 minutes
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
