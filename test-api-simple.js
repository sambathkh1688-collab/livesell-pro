// Simple API test
const http = require('http')

function testAPI() {
  console.log('🧪 Testing API endpoints...\n')
  
  // Test health endpoint
  const healthReq = http.get('http://localhost:3000/api/health', (res) => {
    let data = ''
    res.on('data', (chunk) => data += chunk)
    res.on('end', () => {
      console.log('✅ Health endpoint:', res.statusCode, data)
      testOAuth()
    })
  })
  
  healthReq.on('error', (err) => {
    console.log('❌ Health endpoint error:', err.message)
    testOAuth()
  })
}

function testOAuth() {
  // Test OAuth with invalid code
  const postData = JSON.stringify({
    code: 'INVALID_TEST_CODE',
    state: 'test_123',
    redirectUri: 'http://localhost:3000/facebook/connect-success'
  })
  
  const options = {
    hostname: 'localhost',
    port: 3000,
    path: '/api/facebook/oauth/exchange',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(postData)
    }
  }
  
  const req = http.request(options, (res) => {
    let data = ''
    res.on('data', (chunk) => data += chunk)
    res.on('end', () => {
      console.log('✅ OAuth endpoint (invalid code):', res.statusCode, data)
      console.log('\n🎯 API Tests Complete!')
    })
  })
  
  req.on('error', (err) => {
    console.log('❌ OAuth endpoint error:', err.message)
    console.log('\n🎯 API Tests Complete!')
  })
  
  req.write(postData)
  req.end()
}

testAPI()