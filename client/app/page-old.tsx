'use client'

import { useState } from 'react'
import { 
  CheckCircleIcon, 
  BoltIcon, 
  ChartBarIcon, 
  DevicePhoneMobileIcon,
  CloudIcon,
  CurrencyDollarIcon 
} from '@heroicons/react/24/outline'

export default function HomePage() {
  const [selectedPlan, setSelectedPlan] = useState('professional')

  const features = [
    {
      icon: BoltIcon,
      title: "AI-Powered Smart Replies",
      description: "Context-aware responses with LLM integration. SystemKH can't match this!",
      competitive: "SystemKH: Manual replies only"
    },
    {
      icon: ChartBarIcon,
      title: "Real-Time Analytics",
      description: "Instant WebSocket updates vs SystemKH's 30-second delays",
      competitive: "SystemKH: Slow, outdated reporting"
    },
    {
      icon: DevicePhoneMobileIcon,
      title: "Mobile-First PWA",
      description: "True app experience with offline capabilities",
      competitive: "SystemKH: Basic mobile web only"
    },
    {
      icon: CloudIcon,
      title: "Cloud-Native Architecture",
      description: "Modern scalable infrastructure built for 2025",
      competitive: "SystemKH: Legacy PHP technology"
    }
  ]

  const plans = [
    {
      name: "Free",
      price: 0,
      systemkh: "N/A",
      savings: "100%",
      features: [
        "1 Facebook Page",
        "50 Orders/Month", 
        "Basic Auto-Replies",
        "7-Day Order History"
      ],
      popular: false
    },
    {
      name: "Starter",
      price: 19,
      systemkh: 29,
      savings: "34%",
      features: [
        "3 Facebook Pages",
        "500 Orders/Month",
        "AI-Powered Replies", 
        "Advanced Analytics",
        "Email Support"
      ],
      popular: false
    },
    {
      name: "Professional", 
      price: 39,
      systemkh: 59,
      savings: "34%",
      features: [
        "10 Facebook Pages",
        "2,000 Orders/Month",
        "Multi-Channel Support",
        "Custom Integrations", 
        "Priority Support"
      ],
      popular: true
    },
    {
      name: "Enterprise",
      price: 99, 
      systemkh: 149,
      savings: "34%",
      features: [
        "Unlimited Everything",
        "White-Label Options",
        "API Access",
        "Dedicated Manager",
        "Custom Features"
      ],
      popular: false
    }
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 gradient-bg opacity-10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              🚀 <span className="text-primary-600">LiveSell Pro</span>
              <br />
              <span className="text-2xl md:text-3xl text-gray-600">
                The SystemKH Killer Platform
              </span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              AI-powered Facebook Live SaaS with <strong>34% better pricing</strong>, 
              modern technology stack, and features SystemKH doesn't have.
            </p>
            
            {/* Competitive Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              <div className="bg-white p-6 rounded-lg shadow-lg border border-success-500">
                <div className="text-3xl font-bold text-success-600">10x</div>
                <div className="text-sm text-gray-600">Faster Technology</div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-lg border border-primary-500">
                <div className="text-3xl font-bold text-primary-600">34%</div>
                <div className="text-sm text-gray-600">Better Pricing</div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-lg border border-warning-500">
                <div className="text-3xl font-bold text-warning-600">5+</div>
                <div className="text-sm text-gray-600">Exclusive Features</div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-primary-600 hover:bg-primary-700 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-colors">
                🎯 Crush SystemKH - Start Free
              </button>
              <button className="bg-white hover:bg-gray-50 text-gray-900 px-8 py-4 rounded-lg font-semibold text-lg border-2 border-gray-300 transition-colors">
                📊 See Live Demo
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              🔥 Features SystemKH Doesn't Have
            </h2>
            <p className="text-xl text-gray-600">
              Built with 2025 technology to dominate the market
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
                <div className="text-primary-600 mb-4">
                  <feature.icon className="h-8 w-8" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 mb-3">
                  {feature.description}
                </p>
                <p className="text-sm text-danger-600 font-medium">
                  {feature.competitive}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Pricing Section */}
      <div className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              💰 Pricing That Crushes SystemKH
            </h2>
            <p className="text-xl text-gray-600">
              Same features, better technology, 34% less expensive
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {plans.map((plan, index) => (
              <div 
                key={index} 
                className={`relative bg-white p-6 rounded-lg border-2 ${
                  plan.popular ? 'border-primary-500 shadow-xl' : 'border-gray-200 shadow-lg'
                } hover:shadow-xl transition-shadow`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className="bg-primary-600 text-white px-4 py-1 rounded-full text-sm font-medium">
                      🎯 Most Popular
                    </span>
                  </div>
                )}
                
                <div className="text-center mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {plan.name}
                  </h3>
                  <div className="text-4xl font-bold text-gray-900 mb-2">
                    ${plan.price}<span className="text-lg text-gray-600">/mo</span>
                  </div>
                  {plan.systemkh !== "N/A" && (
                    <div className="text-sm text-gray-500">
                      SystemKH: <span className="line-through">${plan.systemkh}/mo</span>
                      <span className="text-success-600 font-medium ml-2">
                        Save {plan.savings}!
                      </span>
                    </div>
                  )}
                </div>

                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature, fIndex) => (
                    <li key={fIndex} className="flex items-start">
                      <CheckCircleIcon className="h-5 w-5 text-success-500 mt-0.5 mr-3 flex-shrink-0" />
                      <span className="text-gray-600">{feature}</span>
                    </li>
                  ))}
                </ul>

                <button 
                  className={`w-full py-3 px-4 rounded-lg font-semibold transition-colors ${
                    plan.popular
                      ? 'bg-primary-600 hover:bg-primary-700 text-white'
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-900'
                  }`}
                >
                  {plan.price === 0 ? 'Start Free' : 'Choose Plan'}
                </button>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <p className="text-gray-600 mb-4">
              💡 <strong>Migration Bonus:</strong> Switch from SystemKH and get 3 months free!
            </p>
            <button className="bg-success-600 hover:bg-success-700 text-white px-8 py-3 rounded-lg font-semibold">
              🚀 Migrate from SystemKH Now
            </button>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-24 gradient-bg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Crush SystemKH?
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Join the revolution of AI-powered live commerce. 
            Superior technology, better pricing, exclusive features.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white hover:bg-gray-100 text-gray-900 px-8 py-4 rounded-lg font-semibold text-lg transition-colors">
              🎯 Start Free Trial
            </button>
            <button className="bg-transparent hover:bg-white/10 text-white px-8 py-4 rounded-lg font-semibold text-lg border-2 border-white transition-colors">
              📞 Book Demo Call
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}