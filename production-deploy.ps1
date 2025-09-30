# LiveSell Pro - Production Deployment Guide
# From localhost to live public platform with 10 beta testers

Write-Host "🌍 LiveSell Pro Production Deployment" -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "🎯 Deployment Options (Choose One):" -ForegroundColor Yellow
Write-Host ""
Write-Host "OPTION 1: Quick Deploy (Recommended)" -ForegroundColor Green
Write-Host "- Frontend: Vercel (Free)" -ForegroundColor White
Write-Host "- Backend: Railway (Free tier)" -ForegroundColor White
Write-Host "- Database: Railway PostgreSQL" -ForegroundColor White
Write-Host "- Domain: Free subdomains" -ForegroundColor White
Write-Host ""

Write-Host "OPTION 2: Full Production" -ForegroundColor Blue
Write-Host "- Frontend: Vercel Pro" -ForegroundColor White
Write-Host "- Backend: DigitalOcean Droplet" -ForegroundColor White
Write-Host "- Database: DigitalOcean Managed DB" -ForegroundColor White
Write-Host "- Domain: Custom domain (.com)" -ForegroundColor White
Write-Host ""

Write-Host "📋 Pre-deployment Checklist:" -ForegroundColor Cyan
Write-Host "✅ Facebook App configured" -ForegroundColor Green
Write-Host "✅ Backend running locally" -ForegroundColor Green
Write-Host "✅ Frontend running locally" -ForegroundColor Green
Write-Host "✅ Database migrations ready" -ForegroundColor Green
Write-Host ""

Write-Host "🚀 STEP 1: Deploy Backend (Railway)" -ForegroundColor Cyan
Write-Host "====================================" -ForegroundColor Cyan
Write-Host "1. Create account at railway.app" -ForegroundColor White
Write-Host "2. Connect your GitHub repository" -ForegroundColor White
Write-Host "3. Deploy from /server folder" -ForegroundColor White
Write-Host "4. Add environment variables" -ForegroundColor White
Write-Host "5. Enable PostgreSQL plugin" -ForegroundColor White
Write-Host ""

Write-Host "⚛️ STEP 2: Deploy Frontend (Vercel)" -ForegroundColor Cyan
Write-Host "====================================" -ForegroundColor Cyan
Write-Host "1. Create account at vercel.com" -ForegroundColor White
Write-Host "2. Import your GitHub repository" -ForegroundColor White
Write-Host "3. Set root directory to /client" -ForegroundColor White
Write-Host "4. Configure environment variables" -ForegroundColor White
Write-Host "5. Deploy with custom domain" -ForegroundColor White
Write-Host ""

Write-Host "🔧 STEP 3: Environment Variables" -ForegroundColor Cyan
Write-Host "=================================" -ForegroundColor Cyan
Write-Host "Backend (Railway):" -ForegroundColor Yellow
Write-Host "DATABASE_URL=[Railway PostgreSQL URL]" -ForegroundColor White
Write-Host "FACEBOOK_APP_ID=1889698918216093" -ForegroundColor White
Write-Host "FACEBOOK_APP_SECRET=d89b2c56b7b1acec7f91c9206538017c" -ForegroundColor White
Write-Host "JWT_SECRET=livesell-pro-production-secret" -ForegroundColor White
Write-Host "NODE_ENV=production" -ForegroundColor White
Write-Host ""
Write-Host "Frontend (Vercel):" -ForegroundColor Yellow
Write-Host "NEXT_PUBLIC_API_URL=[Your Railway Backend URL]" -ForegroundColor White
Write-Host "NEXT_PUBLIC_FACEBOOK_APP_ID=1889698918216093" -ForegroundColor White
Write-Host ""

Write-Host "👥 STEP 4: Beta Testing Setup" -ForegroundColor Cyan
Write-Host "==============================" -ForegroundColor Cyan
Write-Host "Create 10 test Facebook accounts or invite users:" -ForegroundColor White
Write-Host "1. Create beta testing group" -ForegroundColor White
Write-Host "2. Share production URLs" -ForegroundColor White
Write-Host "3. Provide testing instructions" -ForegroundColor White
Write-Host "4. Monitor for issues" -ForegroundColor White
Write-Host "5. Collect feedback" -ForegroundColor White
Write-Host ""

Write-Host "🔗 Deployment URLs will be:" -ForegroundColor Green
Write-Host "Frontend: https://livesell-pro.vercel.app" -ForegroundColor Cyan
Write-Host "Backend: https://livesell-pro-backend.railway.app" -ForegroundColor Cyan
Write-Host "Landing: https://your-domain.com (custom)" -ForegroundColor Cyan
Write-Host ""

$choice = Read-Host "Choose deployment option (1 for Quick, 2 for Full, S to Skip)"

switch ($choice) {
    "1" {
        Write-Host "🚀 Setting up Quick Deploy..." -ForegroundColor Green
        Write-Host "Opening Railway and Vercel..." -ForegroundColor Yellow
        Start-Process "https://railway.app"
        Start-Process "https://vercel.com"
    }
    "2" {
        Write-Host "🏢 Setting up Full Production..." -ForegroundColor Blue
        Write-Host "Opening DigitalOcean..." -ForegroundColor Yellow
        Start-Process "https://www.digitalocean.com"
    }
    "S" {
        Write-Host "⏭️ Skipping deployment setup" -ForegroundColor Yellow
    }
    default {
        Write-Host "❓ Invalid choice. Run script again." -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "📚 Next Steps After Deployment:" -ForegroundColor Cyan
Write-Host "1. Update Facebook App with production URLs" -ForegroundColor White
Write-Host "2. Test complete OAuth flow" -ForegroundColor White
Write-Host "3. Invite 10 beta testers" -ForegroundColor White
Write-Host "4. Monitor performance and fix issues" -ForegroundColor White
Write-Host "5. Launch marketing campaign" -ForegroundColor White
Write-Host ""

Write-Host "✅ Production deployment guide complete!" -ForegroundColor Green