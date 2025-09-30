/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true
  },
  env: {
    NEXT_PUBLIC_API_URL: 'https://api.adsbox.biz',
    NEXT_PUBLIC_FRONTEND_URL: 'https://adsbox.biz',
    NEXT_PUBLIC_FACEBOOK_APP_ID: '835145810930761'
  }
}

module.exports = nextConfig