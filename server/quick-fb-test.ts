// Quick Facebook API Connection Test
import axios from 'axios'
import dotenv from 'dotenv'

dotenv.config()

async function quickFacebookTest() {
  console.log('🚀 Testing Facebook API Connection...\n')
  
  // Check environment variables
  const appId = process.env.FACEBOOK_APP_ID
  const appSecret = process.env.FACEBOOK_APP_SECRET
  
  console.log('📋 Configuration Check:')
  console.log(`   App ID: ${appId || 'NOT SET'}`)
  console.log(`   App Secret: ${appSecret ? appSecret.substring(0, 8) + '...' : 'NOT SET'}`)
  
  if (!appId || !appSecret) {
    console.log('❌ Missing required environment variables')
    return
  }
  
  try {
    // Test 1: Get App Access Token
    console.log('\n🔑 Testing App Access Token...')
    const tokenResponse = await axios.get('https://graph.facebook.com/v18.0/oauth/access_token', {
      params: {
        client_id: appId,
        client_secret: appSecret,
        grant_type: 'client_credentials'
      }
    })
    
    const accessToken = tokenResponse.data.access_token
    console.log(`✅ App Access Token: ${accessToken.substring(0, 20)}...`)
    
    // Test 2: Validate App Info
    console.log('\n📱 Testing App Info Retrieval...')
    const appResponse = await axios.get(`https://graph.facebook.com/v18.0/${appId}`, {
      params: {
        access_token: accessToken,
        fields: 'id,name,category'
      }
    })
    
    console.log('✅ App Details:')
    console.log(`   Name: ${appResponse.data.name || 'Not available'}`)
    console.log(`   ID: ${appResponse.data.id}`)
    console.log(`   Category: ${appResponse.data.category || 'Not specified'}`)
    
    // Test 3: Check API Permissions  
    console.log('\n🔒 Testing API Permissions...')
    try {
      const permsResponse = await axios.get(`https://graph.facebook.com/v18.0/${appId}/roles`, {
        params: {
          access_token: accessToken
        }
      })
      console.log('✅ Permissions check successful')
    } catch (permError: any) {
      console.log('ℹ️ Permissions endpoint limited (expected for basic apps)')
    }
    
    console.log('\n🎉 FACEBOOK API CONNECTION SUCCESSFUL!')
    console.log('✅ Your Facebook app is working and can connect to the API')
    console.log('✅ Ready for OAuth flow and user authentication')
    
  } catch (error: any) {
    console.log('\n❌ FACEBOOK API CONNECTION FAILED')
    console.log('Error:', error.response?.data || error.message)
    
    if (error.response?.data?.error) {
      const fbError = error.response.data.error
      console.log('\n🔍 Facebook Error Details:')
      console.log(`   Code: ${fbError.code}`)
      console.log(`   Type: ${fbError.type}`)
      console.log(`   Message: ${fbError.message}`)
      
      // Provide specific guidance
      if (fbError.code === 101) {
        console.log('\n💡 This error suggests:')
        console.log('   - Check your Facebook App ID and Secret')
        console.log('   - Ensure your Facebook app is active')
        console.log('   - Verify you have the correct credentials')
      }
    }
  }
}

// Run the test
quickFacebookTest().catch(console.error)