import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import sqlite3 from 'sqlite3'
import axios from 'axios'

// Load environment variables
dotenv.config()

const app = express()
const PORT = 5000

// Middleware
app.use(cors())
app.use(express.json())

const FACEBOOK_APP_ID = process.env.FACEBOOK_APP_ID
const FACEBOOK_APP_SECRET = process.env.FACEBOOK_APP_SECRET

console.log('🚀 Starting Facebook API Test Server...')
console.log('App ID:', FACEBOOK_APP_ID)
console.log('App Secret:', FACEBOOK_APP_SECRET ? 'SET' : 'NOT SET')

// OAuth exchange endpoint
app.post('/api/facebook/oauth/exchange', async (req, res) => {
  const { code, state } = req.body
  
  console.log('🔄 Processing Facebook OAuth exchange...')
  console.log('Code:', code?.substring(0, 20) + '...')
  console.log('State:', state)
  
  try {
    // Exchange code for access token
    const tokenResponse = await axios.get('https://graph.facebook.com/v18.0/oauth/access_token', {
      params: {
        client_id: FACEBOOK_APP_ID,
        client_secret: FACEBOOK_APP_SECRET,
        redirect_uri: 'http://localhost:3000/facebook/connect-success',
        code: code
      }
    })
    
    const { access_token } = tokenResponse.data
    console.log('✅ Access token received:', access_token.substring(0, 50) + '...')
    
    // Get user info
    const userResponse = await axios.get('https://graph.facebook.com/v18.0/me', {
      params: {
        access_token: access_token,
        fields: 'id,name,email'
      }
    })
    
    console.log('✅ User info retrieved:', userResponse.data.name)
    
    // Save to database
    const db = new sqlite3.Database('./livesell.db')
    
    // Generate a unique ID for the integration
    const integrationId = 'fb_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9)
    
    db.run(`
      INSERT INTO facebook_integrations (id, user_id, organization_id, access_token, token_type, is_active, connected_at, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'), datetime('now'))
    `, [integrationId, '1', 'org_1', access_token, 'user_access_token', 1], function(err) {
      if (err) {
        console.error('❌ Database error:', err)
        res.status(500).json({ error: 'Database error' })
      } else {
        console.log('✅ Facebook integration saved to database!')
        
        // Get user's pages
        getUserPages(access_token, integrationId, db)
        
        res.json({
          success: true,
          user: userResponse.data,
          message: 'Facebook integration successful!'
        })
      }
      db.close()
    })
    
  } catch (error: any) {
    console.error('❌ OAuth exchange error:', error.response?.data || error.message)
    res.status(400).json({ 
      error: 'OAuth exchange failed',
      details: error.response?.data || error.message 
    })
  }
})

async function getUserPages(accessToken: string, integrationId: string, db: sqlite3.Database) {
  try {
    console.log('📄 Fetching user pages...')
    
    const pagesResponse = await axios.get('https://graph.facebook.com/v18.0/me/accounts', {
      params: {
        access_token: accessToken,
        fields: 'id,name,category,access_token,tasks,fan_count'
      }
    })
    
    console.log('✅ Found', pagesResponse.data.data.length, 'pages')
    
    pagesResponse.data.data.forEach((page: any) => {
      // Generate unique page ID
      const pageRecordId = 'page_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9)
      
      db.run(`
        INSERT INTO facebook_pages (id, user_id, organization_id, facebook_page_id, page_name, access_token, category, is_active, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))
      `, [pageRecordId, '1', 'org_1', page.id, page.name, page.access_token, page.category, 1], (err) => {
        if (err) {
          console.error('❌ Error saving page:', page.name, err)
        } else {
          console.log('✅ Saved page:', page.name)
        }
      })
    })
    
  } catch (error: any) {
    console.error('❌ Error fetching pages:', error.response?.data || error.message)
  }
}

// Test endpoint
app.get('/api/test', (req, res) => {
  res.json({ message: 'Facebook API Test Server is running!', timestamp: new Date().toISOString() })
})

app.listen(PORT, () => {
  console.log(`🔥 Facebook API Test Server running on http://localhost:${PORT}`)
  console.log('Ready to handle OAuth exchanges!')
})