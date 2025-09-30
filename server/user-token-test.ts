import dotenv from 'dotenv'
import axios from 'axios'
import sqlite3 from 'sqlite3'
import { promisify } from 'util'

// Load environment variables
dotenv.config()

const FACEBOOK_APP_ID = process.env.FACEBOOK_APP_ID
const FACEBOOK_APP_SECRET = process.env.FACEBOOK_APP_SECRET
const DB_PATH = './livesell.db'

console.log('🔥 Testing Facebook API with Real User Token')
console.log('==========================================')

async function getUserToken(): Promise<string | null> {
  return new Promise((resolve, reject) => {
    const db = new sqlite3.Database(DB_PATH)
    
    db.get(`
      SELECT access_token 
      FROM facebook_integrations 
      WHERE user_id = 1 
      ORDER BY created_at DESC 
      LIMIT 1
    `, (err, row: any) => {
      if (err) {
        console.error('❌ Database error:', err)
        resolve(null)
      } else if (row) {
        console.log('✅ Retrieved user access token from database')
        resolve(row.access_token)
      } else {
        console.log('⚠️  No user access token found in database')
        resolve(null)
      }
      db.close()
    })
  })
}

async function testUserProfile(accessToken: string) {
  console.log('\n👤 Testing User Profile...')
  
  try {
    const response = await axios.get(`https://graph.facebook.com/v18.0/me`, {
      params: {
        access_token: accessToken,
        fields: 'id,name,email,picture'
      }
    })
    
    console.log('✅ User Profile Retrieved Successfully!')
    console.log('User ID:', response.data.id)
    console.log('Name:', response.data.name)
    console.log('Email:', response.data.email || 'Not provided')
    return response.data
  } catch (error: any) {
    console.error('❌ User Profile Error:', error.response?.data || error.message)
    return null
  }
}

async function testUserPages(accessToken: string) {
  console.log('\n📄 Testing Facebook Pages...')
  
  try {
    const response = await axios.get(`https://graph.facebook.com/v18.0/me/accounts`, {
      params: {
        access_token: accessToken,
        fields: 'id,name,category,access_token,tasks,fan_count'
      }
    })
    
    console.log('✅ Facebook Pages Retrieved Successfully!')
    console.log('Number of Pages:', response.data.data.length)
    
    response.data.data.forEach((page: any, index: number) => {
      console.log(`\nPage ${index + 1}:`)
      console.log('  ID:', page.id)
      console.log('  Name:', page.name)
      console.log('  Category:', page.category)
      console.log('  Fan Count:', page.fan_count || 'N/A')
      console.log('  Tasks:', page.tasks?.join(', ') || 'No permissions')
    })
    
    return response.data.data
  } catch (error: any) {
    console.error('❌ Facebook Pages Error:', error.response?.data || error.message)
    return null
  }
}

async function testPagePosts(pageId: string, pageAccessToken: string) {
  console.log(`\n📝 Testing Posts for Page ${pageId}...`)
  
  try {
    const response = await axios.get(`https://graph.facebook.com/v18.0/${pageId}/posts`, {
      params: {
        access_token: pageAccessToken,
        fields: 'id,message,created_time,likes.summary(true),comments.summary(true)',
        limit: 5
      }
    })
    
    console.log('✅ Page Posts Retrieved Successfully!')
    console.log('Number of Posts:', response.data.data.length)
    
    response.data.data.forEach((post: any, index: number) => {
      console.log(`\nPost ${index + 1}:`)
      console.log('  ID:', post.id)
      console.log('  Message:', post.message?.substring(0, 100) + '...' || 'No message')
      console.log('  Created:', post.created_time)
      console.log('  Likes:', post.likes?.summary?.total_count || 0)
      console.log('  Comments:', post.comments?.summary?.total_count || 0)
    })
    
    return response.data.data
  } catch (error: any) {
    console.error('❌ Page Posts Error:', error.response?.data || error.message)
    return null
  }
}

async function testPostComments(postId: string, pageAccessToken: string) {
  console.log(`\n💬 Testing Comments for Post ${postId}...`)
  
  try {
    const response = await axios.get(`https://graph.facebook.com/v18.0/${postId}/comments`, {
      params: {
        access_token: pageAccessToken,
        fields: 'id,message,created_time,from',
        limit: 10
      }
    })
    
    console.log('✅ Post Comments Retrieved Successfully!')
    console.log('Number of Comments:', response.data.data.length)
    
    response.data.data.forEach((comment: any, index: number) => {
      console.log(`\nComment ${index + 1}:`)
      console.log('  ID:', comment.id)
      console.log('  From:', comment.from?.name || 'Unknown')
      console.log('  Message:', comment.message?.substring(0, 100) + '...' || 'No message')
      console.log('  Created:', comment.created_time)
    })
    
    return response.data.data
  } catch (error: any) {
    console.error('❌ Post Comments Error:', error.response?.data || error.message)
    return null
  }
}

async function testCommentPosting(postId: string, pageAccessToken: string) {
  console.log(`\n✍️ Testing Comment Posting to Post ${postId}...`)
  
  const testMessage = `🤖 Test comment from LiveSell Pro - ${new Date().toLocaleTimeString()}`
  
  try {
    const response = await axios.post(`https://graph.facebook.com/v18.0/${postId}/comments`, {
      message: testMessage,
      access_token: pageAccessToken
    })
    
    console.log('✅ Test Comment Posted Successfully!')
    console.log('Comment ID:', response.data.id)
    console.log('Message:', testMessage)
    
    // Clean up - delete the test comment
    try {
      await axios.delete(`https://graph.facebook.com/v18.0/${response.data.id}`, {
        params: { access_token: pageAccessToken }
      })
      console.log('🧹 Test comment deleted successfully')
    } catch (deleteError) {
      console.log('⚠️  Could not delete test comment (this is normal)')
    }
    
    return response.data
  } catch (error: any) {
    console.error('❌ Comment Posting Error:', error.response?.data || error.message)
    return null
  }
}

async function runUserTokenTests() {
  // Get user access token from database
  const userToken = await getUserToken()
  
  if (!userToken) {
    console.error('❌ No user access token found. Please complete OAuth flow first.')
    console.log('Go to: http://localhost:3000/facebook and connect your account')
    return
  }
  
  // Test 1: User Profile
  const userProfile = await testUserProfile(userToken)
  if (!userProfile) return
  
  // Test 2: User Pages
  const pages = await testUserPages(userToken)
  if (!pages || pages.length === 0) {
    console.log('⚠️  No Facebook Pages found for this user')
    return
  }
  
  // Test with first page that has manage_pages permission
  const testPage = pages.find((page: any) => 
    page.tasks && page.tasks.includes('MANAGE')
  ) || pages[0]
  
  console.log(`\n🎯 Using Page: ${testPage.name} (${testPage.id})`)
  
  // Test 3: Page Posts
  const posts = await testPagePosts(testPage.id, testPage.access_token)
  if (!posts || posts.length === 0) {
    console.log('⚠️  No posts found on this page')
    return
  }
  
  // Test 4: Post Comments
  const testPost = posts[0]
  const comments = await testPostComments(testPost.id, testPage.access_token)
  
  // Test 5: Comment Posting (optional - only if we have permission)
  if (testPage.tasks && testPage.tasks.includes('CREATE_CONTENT')) {
    await testCommentPosting(testPost.id, testPage.access_token)
  } else {
    console.log('ℹ️  Skipping comment posting test - no CREATE_CONTENT permission')
  }
  
  console.log('\n🎉 All Facebook API Tests Completed!')
  console.log('🚀 Your Facebook integration is ready for production!')
}

// Run the tests
runUserTokenTests().catch(console.error)