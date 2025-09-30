# 🚀 Facebook Integration Setup Guide

This guide will help you set up Facebook API integration for your **Ultimate Facebook Live SaaS Platform**.

## 📋 Prerequisites

1. A Facebook account with business manager access
2. Admin access to the Facebook pages you want to monitor
3. Basic understanding of Facebook Developer Console

## 🔧 Step 1: Create Facebook App

### 1.1 Go to Facebook Developers Console
- Visit: https://developers.facebook.com/apps/
- Click "Create App"

### 1.2 App Configuration
- **App Type**: Business
- **App Name**: "Your SaaS Name Live Monitor" (e.g., "LiveCommerce Pro")
- **App Contact Email**: Your business email
- **Business Manager Account**: Select your business manager

### 1.3 Add Required Products
Add these products to your app:
- **Facebook Login** (for OAuth authentication)
- **Webhooks** (for real-time updates)

## 🔑 Step 2: Get App Credentials

### 2.1 App ID and Secret
1. Go to **App Settings > Basic**
2. Copy your **App ID**
3. Copy your **App Secret** (click Show button)

### 2.2 Configure OAuth Redirect URIs
In **Facebook Login > Settings**:
- Add redirect URI: `http://localhost:3000/api/facebook/callback`
- For production: `https://yourdomain.com/api/facebook/callback`

## 📡 Step 3: Configure Webhooks (Real-time Updates)

### 3.1 Webhook Setup
1. Go to **Webhooks** product
2. Click "Add Subscription" 
3. Choose **Page** object

### 3.2 Webhook Configuration
- **Callback URL**: `http://localhost:3000/api/facebook/webhooks`
- **Verify Token**: Create a random string (save this for .env)
- **Subscription Fields**: Select:
  - `live_videos` (for live video events)
  - `feed` (for posts and comments)

### 3.3 For Development (ngrok)
Since Facebook needs HTTPS:
```bash
# Install ngrok
npm install -g ngrok

# Expose your local server
ngrok http 3000

# Use the HTTPS URL for webhook callback
# Example: https://abc123.ngrok.io/api/facebook/webhooks
```

## 🔐 Step 4: Permissions Setup

### 4.1 Required Permissions
Your app needs these permissions:
- `pages_show_list` - Access user's pages
- `pages_read_engagement` - Read page posts and comments  
- `pages_manage_metadata` - Manage page settings
- `pages_read_user_content` - Read user-generated content on pages

### 4.2 App Review (For Production)
- Submit for **App Review** to get public access
- Provide detailed use case explanation
- Show demo videos of your SaaS functionality

## ⚙️ Step 5: Environment Configuration

Create `.env.local` file in your client directory:

```bash
# Copy from .env.example and fill in your values
FACEBOOK_APP_ID=1234567890123456
FACEBOOK_APP_SECRET=abcd1234efgh5678ijkl9012mnop3456
FACEBOOK_WEBHOOK_VERIFY_TOKEN=my-secure-webhook-token-2024
NEXTAUTH_URL=http://localhost:3000
DATABASE_URL=postgresql://username:password@localhost:5432/fbcomment_saas
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
```

## 🧪 Step 6: Test Your Integration

### 6.1 Development Testing
1. Start your development server: `npm run dev`
2. Go to: `http://localhost:3000/facebook`
3. Click "Connect Facebook Page"
4. Authorize your app with your Facebook account
5. Select pages to monitor

### 6.2 Live Video Testing
1. Go to your Facebook page
2. Start a live video
3. Check your SaaS dashboard for real-time updates
4. Post comments with product orders to test AI detection

## 🚀 Step 7: Production Deployment

### 7.1 Update Environment Variables
- Set production Facebook app credentials
- Update redirect URIs to production domain
- Configure production webhook endpoints

### 7.2 SSL Certificate
- Ensure your production server has valid SSL certificate
- Facebook requires HTTPS for all webhooks

## 🏆 Competitive Advantages vs SystemKH

✅ **Real-time Monitoring**: 5-second update intervals vs SystemKH's 30+ seconds  
✅ **AI-Powered Detection**: Smart order recognition SystemKH lacks  
✅ **Unlimited Pages**: No page limits unlike SystemKH's restrictions  
✅ **Advanced Analytics**: Detailed revenue tracking and customer insights  
✅ **Better Pricing**: $19/month vs SystemKH's $29/month starter plan  

## 🛠️ Troubleshooting

### Common Issues:

**"Invalid Redirect URI"**
- Ensure redirect URI matches exactly in Facebook app settings
- Check for trailing slashes or typos

**"Webhook Verification Failed"** 
- Verify webhook verify token matches your .env file
- Ensure webhook URL is accessible via HTTPS

**"Insufficient Permissions"**
- Check if user has admin access to Facebook page
- Verify all required permissions are granted during OAuth

**"API Rate Limiting"**
- Facebook has rate limits - implement proper error handling
- Use exponential backoff for retries

## 📞 Support

Need help? Check:
1. Facebook Developer Documentation: https://developers.facebook.com/docs/
2. Our internal documentation in `/docs`
3. Contact our development team

---

**Remember**: This Facebook integration is what makes your SaaS superior to SystemKH! 🏆