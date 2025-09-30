# 🚀 Facebook Developer App Setup Guide - LiveSell Pro
# Complete setup for production Facebook integration

Write-Host "📘 Facebook Developer App Configuration Guide" -ForegroundColor Cyan
Write-Host "===============================================" -ForegroundColor Cyan
Write-Host ""

# Start ngrok if not running
Write-Host "🌐 Starting ngrok tunnel..." -ForegroundColor Yellow
$ngrokProcess = Get-Process -Name "ngrok" -ErrorAction SilentlyContinue
if (-not $ngrokProcess) {
    Start-Process "ngrok" -ArgumentList "http 5000" -WindowStyle Minimized
    Start-Sleep -Seconds 5
}

# Get public URL
try {
    $response = Invoke-RestMethod -Uri "http://localhost:4040/api/tunnels"
    $publicUrl = $response.tunnels[0].public_url
    Write-Host "✅ Public URL: $publicUrl" -ForegroundColor Green
} catch {
    Write-Host "⚠️  Ngrok not accessible. Manual setup required." -ForegroundColor Yellow
    $publicUrl = "[YOUR_NGROK_URL]"
}

Write-Host ""
Write-Host "🔧 STEP 1: Facebook App Basic Setup" -ForegroundColor Cyan
Write-Host "====================================" -ForegroundColor Cyan
Write-Host "1. Go to: https://developers.facebook.com/apps/" -ForegroundColor White
Write-Host "2. Click 'Create App'" -ForegroundColor White
Write-Host "3. Select 'Business' as app type" -ForegroundColor White
Write-Host "4. App Name: LiveSell Pro" -ForegroundColor White
Write-Host "5. App Contact Email: your-email@domain.com" -ForegroundColor White
Write-Host ""

Write-Host "📱 STEP 2: App Dashboard Configuration" -ForegroundColor Cyan
Write-Host "======================================" -ForegroundColor Cyan
Write-Host "Current App ID (from .env): 1889698918216093" -ForegroundColor Yellow
Write-Host "Current App Secret (from .env): d89b2c56b7b1acec7f91c9206538017c" -ForegroundColor Yellow
Write-Host ""
Write-Host "🔐 If you need new credentials:" -ForegroundColor White
Write-Host "1. Go to App Dashboard > Settings > Basic" -ForegroundColor White
Write-Host "2. Copy App ID and App Secret" -ForegroundColor White
Write-Host "3. Update .env file in server folder" -ForegroundColor White
Write-Host ""

Write-Host "⚙️ STEP 3: Add Products" -ForegroundColor Cyan
Write-Host "========================" -ForegroundColor Cyan
Write-Host "Add these products to your app:" -ForegroundColor White
Write-Host "✅ Facebook Login" -ForegroundColor Green
Write-Host "✅ Live Video API" -ForegroundColor Green  
Write-Host "✅ Webhooks" -ForegroundColor Green
Write-Host ""

Write-Host "🔗 STEP 4: Facebook Login Configuration" -ForegroundColor Cyan
Write-Host "=======================================" -ForegroundColor Cyan
Write-Host "In Facebook Login > Settings, add these Valid OAuth Redirect URIs:" -ForegroundColor White
Write-Host "✅ $publicUrl/api/facebook/callback" -ForegroundColor Green
Write-Host "✅ http://localhost:3000/facebook/callback" -ForegroundColor Green
Write-Host "✅ https://your-domain.com/facebook/callback (for production)" -ForegroundColor Yellow
Write-Host ""

Write-Host "📡 STEP 5: Webhooks Configuration" -ForegroundColor Cyan
Write-Host "==================================" -ForegroundColor Cyan
Write-Host "In Webhooks > Configuration:" -ForegroundColor White
Write-Host "Callback URL: $publicUrl/api/facebook/webhook" -ForegroundColor Green
Write-Host "Verify Token: SystemKH_Killer_Webhook_2024" -ForegroundColor Green
Write-Host ""
Write-Host "Subscribe to these webhook fields:" -ForegroundColor White
Write-Host "✅ live_videos" -ForegroundColor Green
Write-Host "✅ feed" -ForegroundColor Green
Write-Host "✅ comments" -ForegroundColor Green
Write-Host ""

Write-Host "🔑 STEP 6: Permissions & Features" -ForegroundColor Cyan
Write-Host "==================================" -ForegroundColor Cyan
Write-Host "Required permissions (request in App Review):" -ForegroundColor White
Write-Host "✅ pages_show_list - Get user's pages" -ForegroundColor Green
Write-Host "✅ pages_read_engagement - Read page insights" -ForegroundColor Green
Write-Host "✅ pages_manage_posts - Manage page posts" -ForegroundColor Green
Write-Host "✅ pages_read_user_content - Read user content" -ForegroundColor Green
Write-Host "✅ live_video_api - Access Live Video API" -ForegroundColor Green
Write-Host ""

Write-Host "🚀 STEP 7: Testing & Verification" -ForegroundColor Cyan
Write-Host "===================================" -ForegroundColor Cyan
Write-Host "Test URLs:" -ForegroundColor White
Write-Host "👤 Facebook Login: http://localhost:3000/facebook" -ForegroundColor Green
Write-Host "🔗 OAuth Callback: $publicUrl/api/facebook/callback" -ForegroundColor Green
Write-Host "📡 Webhook Test: $publicUrl/api/facebook/webhook" -ForegroundColor Green
Write-Host "🏥 Health Check: $publicUrl/health" -ForegroundColor Green
Write-Host ""

Write-Host "📋 STEP 8: App Review Submission" -ForegroundColor Cyan
Write-Host "=================================" -ForegroundColor Cyan
Write-Host "For production, submit these items for review:" -ForegroundColor White
Write-Host "1. App Review > Permissions and Features" -ForegroundColor White
Write-Host "2. Add all required permissions listed above" -ForegroundColor White
Write-Host "3. Provide use case descriptions" -ForegroundColor White
Write-Host "4. Add test accounts and instructions" -ForegroundColor White
Write-Host "5. Submit for review (takes 3-7 business days)" -ForegroundColor White
Write-Host ""

Write-Host "🌍 NEXT: Production Deployment" -ForegroundColor Cyan
Write-Host "===============================" -ForegroundColor Cyan
Write-Host "After Facebook App is configured:" -ForegroundColor White
Write-Host "1. Deploy backend to Heroku/Railway/DigitalOcean" -ForegroundColor Yellow
Write-Host "2. Deploy frontend to Vercel/Netlify" -ForegroundColor Yellow
Write-Host "3. Setup production database" -ForegroundColor Yellow
Write-Host "4. Configure custom domains" -ForegroundColor Yellow
Write-Host "5. Update Facebook App with production URLs" -ForegroundColor Yellow
Write-Host ""

Write-Host "✅ Facebook Developer App setup guide complete!" -ForegroundColor Green
Write-Host "📖 Save this information for reference" -ForegroundColor Yellow
Write-Host ""

# Open Facebook Developers in browser
Write-Host "🌐 Opening Facebook Developers Console..." -ForegroundColor Yellow
Start-Process "https://developers.facebook.com/apps/"

Write-Host "Press Enter to continue to deployment setup..." -ForegroundColor Cyan
Read-Host