import { FacebookApiService } from './src/services/facebookApiService'
import { FacebookErrorHandler } from './src/services/facebookErrorHandler'
import logger from './src/utils/logger'
import dotenv from 'dotenv'

// Load environment variables
dotenv.config()

interface TestResult {
  test: string
  success: boolean
  message: string
  data?: any
  error?: any
}

class FacebookApiTester {
  private results: TestResult[] = []

  async runAllTests(): Promise<void> {
    console.log('🚀 Starting Facebook API Integration Tests...\n')
    
    // Basic configuration tests
    await this.testConfiguration()
    
    // App access token test
    await this.testAppAccessToken()
    
    // Test user access token validation (if available)
    await this.testUserTokenValidation()
    
    // Test webhook signature verification
    await this.testWebhookSignature()
    
    // Test API error handling
    await this.testErrorHandling()
    
    // Print results
    this.printResults()
  }

  private async testConfiguration(): Promise<void> {
    console.log('📋 Testing Facebook App Configuration...')
    
    const appId = process.env.FACEBOOK_APP_ID
    const appSecret = process.env.FACEBOOK_APP_SECRET
    const webhookToken = process.env.FACEBOOK_WEBHOOK_VERIFY_TOKEN
    
    this.addResult({
      test: 'Facebook App ID Configuration',
      success: !!appId && appId.length > 0,
      message: appId ? `✅ App ID: ${appId}` : '❌ No App ID configured'
    })
    
    this.addResult({
      test: 'Facebook App Secret Configuration',
      success: !!appSecret && appSecret.length > 0,
      message: appSecret ? `✅ App Secret: ${appSecret.substring(0, 8)}...` : '❌ No App Secret configured'
    })
    
    this.addResult({
      test: 'Webhook Verify Token Configuration',
      success: !!webhookToken && webhookToken.length > 0,
      message: webhookToken ? `✅ Webhook Token: ${webhookToken.substring(0, 12)}...` : '❌ No Webhook Token configured'
    })
  }

  private async testAppAccessToken(): Promise<void> {
    console.log('\n🔑 Testing Facebook App Access Token...')
    
    try {
      // Use reflection to access private method
      const FacebookApiServiceClass = FacebookApiService as any
      const token = await FacebookApiServiceClass.getAppAccessToken()
      
      this.addResult({
        test: 'App Access Token Generation',
        success: !!token,
        message: token ? 
          `✅ Successfully generated app access token: ${token.substring(0, 20)}...` :
          '❌ Failed to generate app access token',
        data: { tokenLength: token?.length }
      })
      
      // Test token validation with Facebook's debug endpoint
      await this.validateTokenWithFacebook(token)
      
    } catch (error: any) {
      this.addResult({
        test: 'App Access Token Generation',
        success: false,
        message: `❌ Failed to generate app access token: ${error.message}`,
        error: error
      })
    }
  }

  private async validateTokenWithFacebook(token: string): Promise<void> {
    try {
      const response = await fetch(
        `https://graph.facebook.com/v18.0/debug_token?input_token=${token}&access_token=${token}`
      )
      
      const data = await response.json() as any
      
      if (data.data && data.data.is_valid) {
        this.addResult({
          test: 'Token Validation with Facebook',
          success: true,
          message: `✅ Token is valid - App: ${data.data.app_id}, Type: ${data.data.type}`,
          data: data.data
        })
      } else {
        this.addResult({
          test: 'Token Validation with Facebook',
          success: false,
          message: `❌ Invalid token response from Facebook`,
          data: data
        })
      }
    } catch (error: any) {
      this.addResult({
        test: 'Token Validation with Facebook',
        success: false,
        message: `❌ Network error validating token: ${error.message}`,
        error: error
      })
    }
  }

  private async testUserTokenValidation(): Promise<void> {
    console.log('\n👤 Testing User Token Validation...')
    
    // Test with a dummy token to ensure validation works
    const dummyToken = 'dummy_invalid_token'
    
    try {
      const isValid = await FacebookApiService.validatePageToken(dummyToken)
      
      this.addResult({
        test: 'User Token Validation Logic',
        success: !isValid, // Should return false for invalid token
        message: isValid ? 
          '❌ Token validation incorrectly passed invalid token' :
          '✅ Token validation correctly rejected invalid token'
      })
      
    } catch (error: any) {
      this.addResult({
        test: 'User Token Validation Logic',
        success: true, // Error is expected for invalid token
        message: `✅ Token validation correctly threw error for invalid token: ${error.message}`,
        error: error
      })
    }
  }

  private async testWebhookSignature(): Promise<void> {
    console.log('\n🔗 Testing Webhook Signature Verification...')
    
    const testPayload = JSON.stringify({
      object: 'page',
      entry: [
        {
          id: 'test_page_id',
          time: Date.now(),
          changes: [
            {
              value: {
                message: 'Test webhook payload'
              },
              field: 'feed'
            }
          ]
        }
      ]
    })
    
    // Generate correct signature
    const crypto = require('crypto')
    const correctSignature = 'sha256=' + crypto
      .createHmac('sha256', process.env.FACEBOOK_APP_SECRET)
      .update(testPayload)
      .digest('hex')
    
    const incorrectSignature = 'sha256=invalid_signature'
    
    // Test correct signature
    const validSignature = FacebookApiService.verifyWebhookSignature(testPayload, correctSignature)
    this.addResult({
      test: 'Webhook Signature Verification (Valid)',
      success: validSignature,
      message: validSignature ? 
        '✅ Correctly verified valid webhook signature' :
        '❌ Failed to verify valid webhook signature'
    })
    
    // Test incorrect signature
    const invalidSignature = FacebookApiService.verifyWebhookSignature(testPayload, incorrectSignature)
    this.addResult({
      test: 'Webhook Signature Verification (Invalid)',
      success: !invalidSignature,
      message: !invalidSignature ? 
        '✅ Correctly rejected invalid webhook signature' :
        '❌ Incorrectly accepted invalid webhook signature'
    })
  }

  private async testErrorHandling(): Promise<void> {
    console.log('\n🛠️ Testing Error Handling...')
    
    // Test different error types
    const testCases = [
      {
        name: 'Auth Error Handling',
        error: { response: { data: { error: { code: 190, message: 'Invalid access token' } } } },
        expectedType: 'AUTH_ERROR'
      },
      {
        name: 'Rate Limit Error Handling',
        error: { response: { data: { error: { code: 4, message: 'Too many API calls' } } } },
        expectedType: 'API_ERROR'
      },
      {
        name: 'Network Error Handling',
        error: { code: 'ECONNREFUSED', message: 'Connection refused' },
        expectedType: 'NETWORK_ERROR'
      }
    ]
    
    for (const testCase of testCases) {
      try {
        const facebookError = testCase.expectedType === 'AUTH_ERROR' ?
          FacebookErrorHandler.handleAuthError(testCase.error) :
          FacebookErrorHandler.handleApiError(testCase.error)
        
        this.addResult({
          test: testCase.name,
          success: facebookError.type === testCase.expectedType,
          message: facebookError.type === testCase.expectedType ?
            `✅ Correctly identified as ${testCase.expectedType}` :
            `❌ Expected ${testCase.expectedType}, got ${facebookError.type}`,
          data: { 
            errorType: facebookError.type,
            message: facebookError.message,
            suggestions: facebookError.suggestions?.length || 0
          }
        })
      } catch (error: any) {
        this.addResult({
          test: testCase.name,
          success: false,
          message: `❌ Error handler threw exception: ${error.message}`,
          error: error
        })
      }
    }
  }

  private addResult(result: TestResult): void {
    this.results.push(result)
  }

  private printResults(): void {
    console.log('\n📊 TEST RESULTS SUMMARY')
    console.log('=' .repeat(50))
    
    const passed = this.results.filter(r => r.success).length
    const total = this.results.length
    
    console.log(`\n🎯 Overall: ${passed}/${total} tests passed (${Math.round(passed/total*100)}%)\n`)
    
    // Group results by category
    const categories = ['Configuration', 'Token', 'Webhook', 'Error']
    
    for (const category of categories) {
      const categoryResults = this.results.filter(r => 
        r.test.toLowerCase().includes(category.toLowerCase())
      )
      
      if (categoryResults.length > 0) {
        console.log(`📂 ${category.toUpperCase()} TESTS:`)
        categoryResults.forEach(result => {
          console.log(`   ${result.success ? '✅' : '❌'} ${result.test}`)
          console.log(`      ${result.message}`)
          if (result.error && !result.success) {
            console.log(`      🔍 Error: ${result.error.message || result.error}`)
          }
        })
        console.log('')
      }
    }
    
    // Recommendations
    console.log('🎯 RECOMMENDATIONS:')
    const failedTests = this.results.filter(r => !r.success)
    
    if (failedTests.length === 0) {
      console.log('   🎉 All tests passed! Your Facebook integration is ready for production!')
      console.log('   🔗 Next steps:')
      console.log('      1. Set up ngrok for webhook testing')
      console.log('      2. Configure Facebook App webhook URLs')
      console.log('      3. Test OAuth flow with a real Facebook account')
    } else {
      console.log('   🔧 Issues to address:')
      failedTests.forEach((test, index) => {
        console.log(`      ${index + 1}. ${test.test}: ${test.message}`)
      })
    }
    
    console.log('\n🚀 Ready to test with real Facebook API!')
  }
}

// Run tests if this file is executed directly
async function runTests() {
  const tester = new FacebookApiTester()
  await tester.runAllTests()
}

// Export for use in other files
export { FacebookApiTester }

// Run tests
if (require.main === module) {
  runTests().catch(console.error)
}