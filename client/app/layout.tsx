import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from './providers'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'LiveSell Pro - The Ultimate Facebook Live SaaS Platform',
  description: 'AI-powered Facebook Live commerce platform that crushes SystemKH with superior features, better pricing, and modern technology.',
  keywords: 'facebook live, ecommerce, ai powered, real-time, multi-tenant, saas, systemkh alternative',
  authors: [{ name: 'LiveSell Pro Team' }],
  creator: 'LiveSell Pro',
  publisher: 'LiveSell Pro',
  robots: 'index, follow',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://livesellpro.com',
    title: 'LiveSell Pro - Beat SystemKH with AI-Powered Live Commerce',
    description: 'The most advanced Facebook Live SaaS platform with AI automation, real-time analytics, and 34% better pricing than SystemKH.',
    siteName: 'LiveSell Pro',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'LiveSell Pro - The SystemKH Killer',
    description: 'AI-powered Facebook Live commerce platform with superior features and better pricing.',
    creator: '@livesellpro',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#3b82f6" />
      </head>
      <body className={inter.className}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}