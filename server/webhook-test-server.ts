// Webhook Test Server - Standalone Facebook Webhook Validator
import express from 'express'
import crypto from 'crypto'
import dotenv from 'dotenv'

dotenv.config()

const app = express()
const PORT = 5002 // Different port to avoid conflicts

// Middleware for raw body parsing (needed for webhook signature verification)
app.use('/webhook', express.raw({ type: 'application/json' }))
app.use(express.json())

const WEBHOOK_VERIFY_TOKEN = 'test_verify_token_123'
const FACEBOOK_APP_SECRET = process.env.FACEBOOK_APP_SECRET!

// Webhook verification (GET request from Facebook)
app.get('/webhook', (req, res) => {
  console.log('🔍 Facebook webhook verification request received')
  
  const mode = req.query['hub.mode']
  const token = req.query['hub.verify_token']
  const challenge = req.query['hub.challenge']
  
  console.log('   Mode:', mode)
  console.log('   Token:', token)
  console.log('   Challenge:', challenge)
  
  if (mode === 'subscribe' && token === WEBHOOK_VERIFY_TOKEN) {
    console.log('✅ Webhook verified successfully!')
    res.status(200).send(challenge)
  } else {
    console.log('❌ Webhook verification failed')
    console.log(`   Expected token: ${WEBHOOK_VERIFY_TOKEN}`)
    console.log(`   Received token: ${token}`)
    res.sendStatus(403)
  }
})

// Webhook event handler (POST request from Facebook)
app.post('/webhook', (req, res) => {
  console.log('\n📨 Facebook webhook event received!')
  
  // Verify signature
  const signature = req.headers['x-hub-signature-256'] as string
  const payload = req.body
  
  if (signature) {
    const expectedSignature = 'sha256=' + crypto
      .createHmac('sha256', FACEBOOK_APP_SECRET)
      .update(payload)
      .digest('hex')
    
    if (signature === expectedSignature) {
      console.log('✅ Webhook signature verified')
    } else {
      console.log('❌ Webhook signature verification failed')
      console.log(`   Expected: ${expectedSignature}`)
      console.log(`   Received: ${signature}`)
      return res.sendStatus(403)
    }
  } else {
    console.log('⚠️ No signature provided (acceptable for testing)')
  }
  
  // Parse webhook data
  let webhookData
  try {
    webhookData = typeof payload === 'string' ? JSON.parse(payload) : payload
    console.log('📋 Webhook data parsed successfully')
  } catch (error) {
    console.log('❌ Failed to parse webhook data:', error)
    return res.sendStatus(400)
  }
  
  // Process webhook events
  if (webhookData.object === 'page') {
    console.log('📄 Page webhook event detected')
    
    webhookData.entry?.forEach((entry: any, index: number) => {
      console.log(`\n🔍 Processing entry ${index + 1}:`)
      console.log(`   Page ID: ${entry.id}`)
      console.log(`   Time: ${new Date(entry.time).toISOString()}`)
      
      entry.changes?.forEach((change: any, changeIndex: number) => {
        console.log(`\n   📝 Change ${changeIndex + 1}:`)
        console.log(`      Field: ${change.field}`)
        console.log(`      Value:`, JSON.stringify(change.value, null, 6))
        
        // Handle different types of changes
        if (change.field === 'feed') {
          if (change.value.item === 'comment') {
            console.log('      💬 New comment detected!')
            console.log(`         Comment ID: ${change.value.comment_id}`)
            console.log(`         Post ID: ${change.value.post_id}`)
            console.log(`         Message: ${change.value.message || 'No message'}`)
          } else if (change.value.item === 'post') {
            console.log('      📝 New post detected!')
            console.log(`         Post ID: ${change.value.post_id}`)
          }
        }
      })
    })
  }
  
  // Always respond with 200 to acknowledge receipt
  console.log('\n✅ Webhook processed successfully')
  res.status(200).send('OK')
})

// Status endpoint
app.get('/', (req, res) => {
  res.json({
    status: 'Facebook Webhook Test Server Running',
    port: PORT,
    endpoints: {
      webhook_verification: 'GET /webhook',
      webhook_events: 'POST /webhook'
    },
    verify_token: WEBHOOK_VERIFY_TOKEN,
    timestamp: new Date().toISOString()
  })
})

// Test endpoint to simulate webhook
app.post('/test-webhook', (req, res) => {
  console.log('\n🧪 Simulating Facebook webhook event...')
  
  const testWebhookData = {
    object: 'page',
    entry: [{
      id: 'test_page_id_123',
      time: Date.now(),
      changes: [{
        field: 'feed',
        value: {
          item: 'comment',
          comment_id: 'test_comment_123',
          post_id: 'test_post_456',
          message: 'This is a test comment from webhook simulator',
          from: {
            id: 'test_user_789',
            name: 'Test User'
          },
          created_time: new Date().toISOString()
        }
      }]
    }]
  }
  
  // Simulate the webhook processing
  console.log('📨 Simulated webhook data:', JSON.stringify(testWebhookData, null, 2))
  
  res.json({
    message: 'Test webhook simulated successfully',
    data: testWebhookData,
    status: 'success'
  })
})

app.listen(PORT, () => {
  console.log(`
🚀 Facebook Webhook Test Server Running!

Server Details:
   Port: ${PORT}
   Webhook URL: http://localhost:${PORT}/webhook
   Verify Token: ${WEBHOOK_VERIFY_TOKEN}
   Status: http://localhost:${PORT}/

Webhook Setup Instructions:
1. Use ngrok to expose this server: ngrok http ${PORT}
2. Copy the ngrok URL (e.g., https://abc123.ngrok.io/webhook)
3. Add it to your Facebook App webhook settings
4. Use verify token: ${WEBHOOK_VERIFY_TOKEN}

Test Endpoints:
   GET  /webhook     - Facebook verification
   POST /webhook     - Receive Facebook events  
   POST /test-webhook - Simulate webhook event
   GET  /            - Server status

Ready to receive Facebook webhooks! 🎯
  `)
})

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n👋 Shutting down webhook test server...')
  process.exit(0)
})