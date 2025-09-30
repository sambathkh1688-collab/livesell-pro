// Direct API endpoint testing using fetch
console.log('🧪 Testing API Endpoints with fetch...\n')

async function testEndpoints() {
  const baseUrl = 'http://localhost:3000'
  
  // Test 1: Health endpoint
  console.log('1. Testing Health Endpoint:')
  try {
    const response = await fetch(`${baseUrl}/api/health`)
    if (response.ok) {
      const data = await response.json()
      console.log('✅ Health:', response.status, JSON.stringify(data))
    } else {
      console.log('❌ Health failed:', response.status, response.statusText)
    }
  } catch (error) {
    console.log('❌ Health error:', error.message)
  }

  // Test 2: Facebook Test endpoint (if it exists)
  console.log('\n2. Testing Facebook Test Endpoint:')
  try {
    const response = await fetch(`${baseUrl}/api/facebook/test`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ test: true })
    })
    if (response.ok) {
      const data = await response.json()
      console.log('✅ FB Test:', response.status, JSON.stringify(data))
    } else {
      console.log('❌ FB Test failed:', response.status, response.statusText)
    }
  } catch (error) {
    console.log('❌ FB Test error:', error.message)
  }

  // Test 3: OAuth endpoint with invalid data
  console.log('\n3. Testing OAuth Endpoint (invalid code):')
  try {
    const response = await fetch(`${baseUrl}/api/facebook/oauth/exchange`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        code: 'INVALID_TEST_CODE_123',
        state: 'test_state',
        redirectUri: 'http://localhost:3000/facebook/connect-success'
      })
    })
    
    const data = await response.json()
    if (response.status === 400) {
      console.log('✅ OAuth (invalid):', response.status, 'Correctly rejected invalid code')
    } else {
      console.log('⚠️ OAuth (invalid):', response.status, JSON.stringify(data))
    }
  } catch (error) {
    console.log('❌ OAuth error:', error.message)
  }

  console.log('\n🎯 API Endpoint Testing Complete!')
}

testEndpoints().catch(console.error)