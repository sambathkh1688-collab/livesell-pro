import dotenv from 'dotenv'
import axios from 'axios'

// Load environment variables
dotenv.config()

const FACEBOOK_APP_ID = process.env.FACEBOOK_APP_ID
const FACEBOOK_APP_SECRET = process.env.FACEBOOK_APP_SECRET

console.log('🚀 Facebook API Testing Suite Starting...')
console.log('App ID:', FACEBOOK_APP_ID)
console.log('App Secret:', FACEBOOK_APP_SECRET ? 'SET' : 'NOT SET')

async function testAppAccessToken() {
  console.log('\n📱 Testing App Access Token...')
  
  try {
    const response = await axios.get(`https://graph.facebook.com/oauth/access_token`, {
      params: {
        client_id: FACEBOOK_APP_ID,
        client_secret: FACEBOOK_APP_SECRET,
        grant_type: 'client_credentials'
      }
    })
    
    console.log('✅ App Access Token Retrieved Successfully!')
    console.log('Token:', response.data.access_token.substring(0, 50) + '...')
    return response.data.access_token
  } catch (error: any) {
    console.error('❌ App Access Token Error:', error.response?.data || error.message)
    return null
  }
}

async function testAppInfo(accessToken: string) {
  console.log('\n📋 Testing App Information...')
  
  try {
    const response = await axios.get(`https://graph.facebook.com/v18.0/${FACEBOOK_APP_ID}`, {
      params: {
        access_token: accessToken,
        fields: 'id,name,category,description,privacy_policy_url'
      }
    })
    
    console.log('✅ App Info Retrieved Successfully!')
    console.log('App Name:', response.data.name)
    console.log('Category:', response.data.category)
    console.log('Privacy Policy:', response.data.privacy_policy_url || 'Not set')
    return response.data
  } catch (error: any) {
    console.error('❌ App Info Error:', error.response?.data || error.message)
    return null
  }
}

async function testUserAccessTokenValidation() {
  console.log('\n👤 Testing User Access Token Validation...')
  
  // This would use a real user access token from the database
  // For now, we'll show the structure
  console.log('ℹ️  This test requires a valid user access token from OAuth flow')
  console.log('ℹ️  User tokens should be tested with: /me endpoint')
  console.log('ℹ️  User tokens should be tested with: /me/accounts (for Pages)')
}

async function testWebhookValidation() {
  console.log('\n🔗 Testing Webhook Configuration...')
  
  // Test webhook verification
  const verifyToken = process.env.FACEBOOK_WEBHOOK_VERIFY_TOKEN || 'your-verify-token'
  console.log('Webhook Verify Token:', verifyToken ? 'SET' : 'NOT SET')
  console.log('ℹ️  Webhook URL should be: https://your-domain.com/webhook/facebook')
  console.log('ℹ️  Verify token should match Facebook App webhook settings')
}

async function runAllTests() {
  console.log('🔥 Facebook API Complete Testing Suite')
  console.log('=====================================')
  
  if (!FACEBOOK_APP_ID || !FACEBOOK_APP_SECRET) {
    console.error('❌ Missing required environment variables!')
    console.error('Please check FACEBOOK_APP_ID and FACEBOOK_APP_SECRET in .env file')
    return
  }
  
  // Test 1: App Access Token
  const appToken = await testAppAccessToken()
  
  if (!appToken) {
    console.error('❌ Cannot continue without valid app access token')
    return
  }
  
  // Test 2: App Information
  await testAppInfo(appToken)
  
  // Test 3: User Token Validation (info only)
  await testUserAccessTokenValidation()
  
  // Test 4: Webhook Configuration
  await testWebhookValidation()
  
  console.log('\n🎉 Facebook API Testing Complete!')
  console.log('Next steps:')
  console.log('1. Test with real user access tokens from OAuth flow')
  console.log('2. Test Facebook Pages API with user tokens')
  console.log('3. Test posting/commenting capabilities')
  console.log('4. Set up webhook endpoints for real-time notifications')
}

// Run the tests
runAllTests().catch(console.error)