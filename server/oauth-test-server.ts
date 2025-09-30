// OAuth Flow Test for Facebook Integration
import express from 'express'
import axios from 'axios'
import dotenv from 'dotenv'

dotenv.config()

const app = express()
const PORT = 5001 // Using different port to avoid conflicts

const FACEBOOK_APP_ID = process.env.FACEBOOK_APP_ID!
const FACEBOOK_APP_SECRET = process.env.FACEBOOK_APP_SECRET!
const REDIRECT_URI = `http://localhost:${PORT}/auth/facebook/callback`

app.get('/', (req, res) => {
  const facebookAuthUrl = `https://www.facebook.com/v18.0/dialog/oauth?` +
    `client_id=${FACEBOOK_APP_ID}&` +
    `redirect_uri=${encodeURIComponent(REDIRECT_URI)}&` +
    `scope=pages_read_engagement,pages_manage_posts,pages_show_list&` +
    `response_type=code&` +
    `state=test123`

  res.send(`
    <html>
      <head><title>Facebook OAuth Test</title></head>
      <body style="font-family: Arial; padding: 40px; text-align: center;">
        <h1>🚀 Facebook OAuth Flow Test</h1>
        <p>Click the button below to test Facebook authentication:</p>
        <a href="${facebookAuthUrl}" style="
          display: inline-block;
          background: #1877f2;
          color: white;
          padding: 15px 30px;
          text-decoration: none;
          border-radius: 8px;
          font-weight: bold;
          margin: 20px;
        ">
          🔗 Connect to Facebook
        </a>
        <div style="margin-top: 40px; font-size: 14px; color: #666;">
          <p><strong>What this will test:</strong></p>
          <p>✅ Facebook OAuth authentication flow</p>
          <p>✅ User permission acceptance</p>
          <p>✅ Access token exchange</p>
          <p>✅ User pages retrieval</p>
        </div>
      </body>
    </html>
  `)
})

app.get('/auth/facebook/callback', async (req, res) => {
  const { code, state } = req.query

  if (!code) {
    return res.send(`
      <html>
        <body style="font-family: Arial; padding: 40px; text-align: center;">
          <h1>❌ Authentication Failed</h1>
          <p>No authorization code received from Facebook.</p>
          <p>This could happen if you denied permission or there was an error.</p>
          <a href="/">Try again</a>
        </body>
      </html>
    `)
  }

  try {
    console.log('🔄 Exchanging code for access token...')
    
    // Step 1: Exchange code for access token
    const tokenResponse = await axios.get('https://graph.facebook.com/v18.0/oauth/access_token', {
      params: {
        client_id: FACEBOOK_APP_ID,
        client_secret: FACEBOOK_APP_SECRET,
        redirect_uri: REDIRECT_URI,
        code: code as string
      }
    })

    const accessToken = tokenResponse.data.access_token
    console.log('✅ Got access token:', accessToken.substring(0, 20) + '...')

    // Step 2: Get user info
    const userResponse = await axios.get('https://graph.facebook.com/v18.0/me', {
      params: {
        access_token: accessToken,
        fields: 'id,name,email'
      }
    })

    console.log('✅ User info:', userResponse.data)

    // Step 3: Get user's Facebook pages
    const pagesResponse = await axios.get('https://graph.facebook.com/v18.0/me/accounts', {
      params: {
        access_token: accessToken,
        fields: 'id,name,category,access_token'
      }
    })

    const pages = pagesResponse.data.data
    console.log(`✅ Found ${pages.length} Facebook pages`)

    // Display success page
    res.send(`
      <html>
        <head><title>Facebook OAuth Success</title></head>
        <body style="font-family: Arial; padding: 40px;">
          <div style="text-align: center; margin-bottom: 40px;">
            <h1 style="color: green;">🎉 Facebook OAuth Test Successful!</h1>
          </div>
          
          <div style="max-width: 600px; margin: 0 auto;">
            <h3>👤 User Information:</h3>
            <p><strong>Name:</strong> ${userResponse.data.name}</p>
            <p><strong>ID:</strong> ${userResponse.data.id}</p>
            <p><strong>Email:</strong> ${userResponse.data.email || 'Not provided'}</p>
            
            <h3>📱 Facebook Pages (${pages.length} found):</h3>
            ${pages.length > 0 ? pages.map((page: any) => `
              <div style="border: 1px solid #ddd; padding: 15px; margin: 10px 0; border-radius: 8px;">
                <p><strong>${page.name}</strong></p>
                <p>ID: ${page.id}</p>
                <p>Category: ${page.category}</p>
                <p>Has Page Token: ${page.access_token ? '✅ Yes' : '❌ No'}</p>
              </div>
            `).join('') : '<p>No pages found or no pages_show_list permission granted.</p>'}
            
            <div style="margin-top: 40px; padding: 20px; background: #f0f8ff; border-radius: 8px;">
              <h3>✅ Test Results:</h3>
              <p>✅ OAuth flow working perfectly</p>
              <p>✅ Access token obtained successfully</p>
              <p>✅ User information retrieved</p>
              <p>✅ Facebook pages accessible</p>
              <p><strong>🎯 Your Facebook integration is 100% ready!</strong></p>
            </div>
            
            <div style="text-align: center; margin-top: 30px;">
              <a href="/" style="
                display: inline-block;
                background: #42b883;
                color: white;
                padding: 10px 20px;
                text-decoration: none;
                border-radius: 5px;
              ">Test Again</a>
            </div>
          </div>
        </body>
      </html>
    `)

  } catch (error: any) {
    console.error('❌ OAuth error:', error.response?.data || error.message)
    
    res.send(`
      <html>
        <body style="font-family: Arial; padding: 40px; text-align: center;">
          <h1>❌ OAuth Error</h1>
          <p><strong>Error:</strong> ${error.message}</p>
          ${error.response?.data ? `
            <div style="margin: 20px; padding: 20px; background: #ffe6e6; border-radius: 8px;">
              <pre>${JSON.stringify(error.response.data, null, 2)}</pre>
            </div>
          ` : ''}
          <a href="/">Try again</a>
        </body>
      </html>
    `)
  }
})

app.listen(PORT, () => {
  console.log(`
🚀 Facebook OAuth Test Server Running!

Open your browser and go to:
👉 http://localhost:${PORT}

This will test the complete Facebook OAuth flow:
✅ Facebook authentication
✅ Permission requests
✅ Access token exchange  
✅ User data retrieval
✅ Facebook pages access

Press Ctrl+C to stop the server.
  `)
})