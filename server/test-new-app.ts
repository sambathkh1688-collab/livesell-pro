// Quick test for new Facebook App credentials
import dotenv from 'dotenv'
import axios from 'axios'

dotenv.config()

async function testNewFacebookApp() {
  console.log('🧪 Testing New Facebook App Configuration...\n')
  
  const appId = process.env.FACEBOOK_APP_ID
  const appSecret = process.env.FACEBOOK_APP_SECRET
  
  console.log('📋 New App Configuration:')
  console.log(`   App ID: ${appId}`)
  console.log(`   App Secret: ${appSecret ? appSecret.substring(0, 8) + '...' : 'NOT SET'}`)
  
  if (!appId || !appSecret) {
    console.log('❌ Missing Facebook App credentials in .env file')
    return
  }
  
  try {
    // Test app access token generation
    console.log('\n🔑 Testing App Access Token Generation...')
    const response = await axios.get('https://graph.facebook.com/v18.0/oauth/access_token', {
      params: {
        client_id: appId,
        client_secret: appSecret,
        grant_type: 'client_credentials'
      }
    })
    
    const accessToken = response.data.access_token
    console.log(`✅ Success! Access Token: ${accessToken.substring(0, 20)}...`)
    
    // Test app info retrieval
    console.log('\n📱 Testing App Info Retrieval...')
    const appResponse = await axios.get(`https://graph.facebook.com/v18.0/${appId}`, {
      params: {
        access_token: accessToken,
        fields: 'id,name,category'
      }
    })
    
    console.log('✅ App Details Retrieved:')
    console.log(`   Name: ${appResponse.data.name}`)
    console.log(`   ID: ${appResponse.data.id}`)
    console.log(`   Category: ${appResponse.data.category}`)
    
    console.log('\n🎉 NEW FACEBOOK APP CONFIGURATION IS WORKING!')
    console.log('✅ Ready to configure OAuth redirect URIs in Facebook App settings')
    
  } catch (error: any) {
    console.log('\n❌ Configuration Test Failed')
    if (error.response?.data?.error) {
      const fbError = error.response.data.error
      console.log('Facebook Error:')
      console.log(`   Code: ${fbError.code}`)
      console.log(`   Type: ${fbError.type}`)
      console.log(`   Message: ${fbError.message}`)
    } else {
      console.log('Error:', error.message)
    }
  }
}

testNewFacebookApp().catch(console.error)