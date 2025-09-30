import express from 'express'
import next from 'next'
import cors from 'cors'
import path from 'path'
import sqlite3 from 'sqlite3'
import axios from 'axios'
import dotenv from 'dotenv'

// Load environment variables
dotenv.config({ path: './server/.env' })

const dev = process.env.NODE_ENV !== 'production'
const hostname = 'localhost'
const port = 3000

// Create Next.js app pointing to client directory
const app = next({ dev, hostname, port, dir: './client' })
const handle = app.getRequestHandler()

const FACEBOOK_APP_ID = process.env.FACEBOOK_APP_ID
const FACEBOOK_APP_SECRET = process.env.FACEBOOK_APP_SECRET

console.log('🚀 Starting Unified Facebook Integration Server...')
console.log('Environment:', dev ? 'Development' : 'Production')
console.log('Facebook App ID:', FACEBOOK_APP_ID)
console.log('Facebook App Secret:', FACEBOOK_APP_SECRET ? 'SET' : 'NOT SET')

app.prepare().then(() => {
  const server = express()

  // Middleware
  server.use(cors())
  server.use(express.json())
  server.use(express.urlencoded({ extended: true }))

  // API Routes
  
  // Health check
  server.get('/api/health', (req, res) => {
    res.json({ 
      status: 'OK', 
      timestamp: new Date().toISOString(),
      service: 'Unified Facebook Integration Server',
      version: '1.0.0'
    })
  })

  // Facebook OAuth Exchange
  server.post('/api/facebook/oauth/exchange', async (req, res) => {
    const { code, redirectUri, state } = req.body
    
    console.log('🔄 Processing Facebook OAuth exchange...')
    console.log('Code:', code?.substring(0, 20) + '...')
    console.log('State:', state)
    console.log('Redirect URI:', redirectUri)
    
    if (!code) {
      return res.status(400).json({
        success: false,
        error: 'Authorization code is required'
      })
    }

    try {
      // Exchange code for access token
      console.log('📡 Exchanging code for access token...')
      const tokenResponse = await axios.get('https://graph.facebook.com/v18.0/oauth/access_token', {
        params: {
          client_id: FACEBOOK_APP_ID,
          client_secret: FACEBOOK_APP_SECRET,
          redirect_uri: redirectUri || 'http://localhost:3000/facebook/connect-success',
          code: code
        }
      })

      const { access_token } = tokenResponse.data
      console.log('✅ Access token received:', access_token.substring(0, 50) + '...')

      // Get user info
      console.log('👤 Fetching user information...')
      const userResponse = await axios.get('https://graph.facebook.com/v18.0/me', {
        params: {
          access_token: access_token,
          fields: 'id,name,email'
        }
      })

      console.log('✅ User info retrieved:', userResponse.data.name)

      // Save to database
      console.log('💾 Saving to database...')
      const db = new sqlite3.Database('./server/livesell.db')
      
      const integrationId = 'fb_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9)
      const userInfo = userResponse.data  // Fix: Extract userInfo from response
      
      await new Promise((resolve, reject) => {
        // First try to update existing record
        db.run(`
          UPDATE facebook_integrations 
          SET access_token = ?, token_type = ?, facebook_user_name = ?, facebook_user_id = ?, is_active = ?, connected_at = datetime('now'), updated_at = datetime('now')
          WHERE user_id = ? AND organization_id = ?
        `, [access_token, 'user_access_token', userInfo.name, userInfo.id, 1, '1', 'org_1'], function(err) {
          if (err) {
            console.error('❌ Database update error:', err)
            reject(err)
          } else if (this.changes === 0) {
            // No existing record, insert new one
            db.run(`
              INSERT INTO facebook_integrations (id, user_id, organization_id, access_token, token_type, facebook_user_name, facebook_user_id, is_active, connected_at, created_at, updated_at)
              VALUES (?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'), datetime('now'))
            `, [integrationId, '1', 'org_1', access_token, 'user_access_token', userInfo.name, userInfo.id, 1], function(insertErr) {
              if (insertErr) {
                console.error('❌ Database insert error:', insertErr)
                reject(insertErr)
              } else {
                console.log('✅ New Facebook integration saved to database!')
                resolve(this)
              }
            })
          } else {
            console.log('✅ Facebook integration updated in database!')
            resolve(this)
          }
        })
      })

      // Get user's pages
      console.log('📄 Fetching user pages...')
      try {
        const pagesResponse = await axios.get('https://graph.facebook.com/v18.0/me/accounts', {
          params: {
            access_token: access_token,
            fields: 'id,name,category,access_token,tasks,fan_count'
          }
        })

        console.log('✅ Found', pagesResponse.data.data.length, 'pages')
        
        // Save pages to database
        for (const page of pagesResponse.data.data) {
          const pageRecordId = 'page_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9)
          
          await new Promise((resolve, reject) => {
            // First try to update existing page
            db.run(`
              UPDATE facebook_pages 
              SET page_name = ?, access_token = ?, category = ?, is_active = ?, updated_at = datetime('now')
              WHERE organization_id = ? AND facebook_page_id = ?
            `, [page.name, page.access_token, page.category, 1, 'org_1', page.id], function(err) {
              if (err) {
                console.error('❌ Page update error:', err)
                reject(err)
              } else if (this.changes === 0) {
                // No existing page, insert new one
                db.run(`
                  INSERT INTO facebook_pages (id, user_id, organization_id, facebook_page_id, page_name, access_token, category, is_active, created_at, updated_at)
                  VALUES (?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))
                `, [pageRecordId, '1', 'org_1', page.id, page.name, page.access_token, page.category, 1], (insertErr) => {
                  if (insertErr) {
                    console.error('❌ Page insert error:', insertErr)
                    reject(insertErr)
                  } else {
                    console.log('✅ New page saved:', page.name)
                    resolve(null)
                  }
                })
              } else {
                console.log('✅ Updated page:', page.name)
                resolve(null)
              }
            })
          })
        }
      } catch (pagesError) {
        console.log('⚠️  Could not fetch pages:', pagesError.response?.data || pagesError.message)
      }

      db.close()

      res.json({
        success: true,
        user: userResponse.data,
        message: 'Facebook integration successful!'
      })

    } catch (error) {
      console.error('❌ OAuth exchange error:', error.response?.data || error.message)
      res.status(400).json({
        success: false,
        error: 'OAuth exchange failed',
        details: error.response?.data || error.message
      })
    }
  })

  // Get Facebook integrations
  server.get('/api/facebook/integrations', (req, res) => {
    const db = new sqlite3.Database('./server/livesell.db')
    
    db.all(`SELECT * FROM facebook_integrations WHERE is_active = 1`, (err, rows) => {
      if (err) {
        console.error('❌ Database error:', err)
        res.status(500).json({ error: 'Database error' })
      } else {
        res.json({ integrations: rows })
      }
      db.close()
    })
  })

  // Get Facebook pages
  server.get('/api/facebook/pages', (req, res) => {
    const db = new sqlite3.Database('./server/livesell.db')
    
    db.all(`SELECT * FROM facebook_pages WHERE is_active = 1`, (err, rows) => {
      if (err) {
        console.error('❌ Database error:', err)
        res.status(500).json({ error: 'Database error' })
      } else {
        res.json({ pages: rows })
      }
      db.close()
    })
  })

  // Test Facebook API
  server.post('/api/facebook/test', async (req, res) => {
    try {
      // Get latest access token from database
      const db = new sqlite3.Database('./server/livesell.db')
      
      db.get(`
        SELECT access_token 
        FROM facebook_integrations 
        WHERE is_active = 1 
        ORDER BY created_at DESC 
        LIMIT 1
      `, async (err, row) => {
        if (err || !row) {
          res.status(404).json({ error: 'No Facebook integration found' })
          db.close()
          return
        }

        try {
          // Test user profile
          const userResponse = await axios.get('https://graph.facebook.com/v18.0/me', {
            params: {
              access_token: row.access_token,
              fields: 'id,name,email'
            }
          })

          // Test pages
          const pagesResponse = await axios.get('https://graph.facebook.com/v18.0/me/accounts', {
            params: {
              access_token: row.access_token,
              fields: 'id,name,category,fan_count'
            }
          })

          res.json({
            success: true,
            user: userResponse.data,
            pages: pagesResponse.data.data,
            message: 'Facebook API test successful!'
          })

        } catch (apiError) {
          res.status(400).json({
            success: false,
            error: 'Facebook API test failed',
            details: apiError.response?.data || apiError.message
          })
        }

        db.close()
      })

    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Server error',
        details: error.message
      })
    }
  })

  // Default handler for Next.js pages
  server.all('*', (req, res) => {
    return handle(req, res)
  })

  server.listen(port, () => {
    console.log(`🔥 Unified Server running on http://localhost:${port}`)
    console.log('📱 Web Interface: http://localhost:3000')
    console.log('🔗 API Base URL: http://localhost:3000/api')
    console.log('✅ All services integrated and stable!')
    console.log('\n🎯 Facebook Integration URLs:')
    console.log('   OAuth: http://localhost:3000/facebook')
    console.log('   Health: http://localhost:3000/api/health')
    console.log('   Test API: http://localhost:3000/api/facebook/test')
  })
})
.catch((ex) => {
  console.error('❌ Server startup error:', ex.stack)
  process.exit(1)
})