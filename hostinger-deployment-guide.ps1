Write-Host "🌍 LiveSell Pro - Hostinger Deployment Guide for adsbox.biz" -ForegroundColor Cyan
Write-Host "=============================================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "PHASE 1: Hostinger Account Setup" -ForegroundColor Yellow
Write-Host "================================" -ForegroundColor Yellow
Write-Host "✅ Domain: adsbox.biz (Already purchased)" -ForegroundColor Green
Write-Host "🔹 Login to Hostinger control panel (hpanel)" -ForegroundColor White
Write-Host "🔹 Verify your hosting plan supports Node.js applications" -ForegroundColor White
Write-Host "🔹 Check if MySQL/PostgreSQL database is included" -ForegroundColor White
Write-Host ""

Write-Host "PHASE 2: Domain and Subdomain Configuration" -ForegroundColor Yellow
Write-Host "===========================================" -ForegroundColor Yellow
Write-Host "Main domain: https://adsbox.biz (Frontend - Next.js)" -ForegroundColor Green
Write-Host "API subdomain: https://api.adsbox.biz (Backend - Node.js)" -ForegroundColor Green
Write-Host "Admin subdomain: https://admin.adsbox.biz (Optional admin panel)" -ForegroundColor Cyan
Write-Host ""
Write-Host "Steps in Hostinger hPanel:" -ForegroundColor White
Write-Host "1. Go to Domains > Manage" -ForegroundColor White
Write-Host "2. Create subdomain: api.adsbox.biz" -ForegroundColor White
Write-Host "3. Point api.adsbox.biz to /api folder" -ForegroundColor White
Write-Host "4. Enable SSL for both main domain and subdomain" -ForegroundColor White
Write-Host ""

Write-Host "PHASE 3: Database Setup" -ForegroundColor Yellow
Write-Host "======================" -ForegroundColor Yellow
Write-Host "Database Options:" -ForegroundColor White
Write-Host "🔹 MySQL (Most common on shared hosting)" -ForegroundColor Cyan
Write-Host "🔹 PostgreSQL (If available on your plan)" -ForegroundColor Cyan
Write-Host ""
Write-Host "Steps:" -ForegroundColor White
Write-Host "1. Create database: livesell_production" -ForegroundColor White
Write-Host "2. Create database user with full privileges" -ForegroundColor White
Write-Host "3. Note connection details for environment variables" -ForegroundColor White
Write-Host ""

Write-Host "PHASE 4: Backend Deployment (api.adsbox.biz)" -ForegroundColor Yellow
Write-Host "============================================" -ForegroundColor Yellow
Write-Host "Upload Method:" -ForegroundColor White
Write-Host "🔹 FTP/SFTP upload (File Manager)" -ForegroundColor Cyan
Write-Host "🔹 Git deployment (if supported)" -ForegroundColor Cyan
Write-Host "🔹 Direct file upload via hPanel" -ForegroundColor Cyan
Write-Host ""
Write-Host "Files to upload to /api folder:" -ForegroundColor White
Write-Host "- server/dist/ (compiled TypeScript)" -ForegroundColor White
Write-Host "- server/package.json" -ForegroundColor White
Write-Host "- server/node_modules/ (or run npm install on server)" -ForegroundColor White
Write-Host "- .env.production file with production settings" -ForegroundColor White
Write-Host ""

Write-Host "Environment Variables for Backend:" -ForegroundColor Cyan
Write-Host "DATABASE_URL=mysql://user:password@localhost/livesell_production" -ForegroundColor White
Write-Host "NODE_ENV=production" -ForegroundColor White
Write-Host "JWT_SECRET=your-secure-jwt-secret-here" -ForegroundColor White
Write-Host "FACEBOOK_APP_ID=1889698918216093" -ForegroundColor White
Write-Host "FACEBOOK_APP_SECRET=your-app-secret" -ForegroundColor White
Write-Host "FRONTEND_URL=https://adsbox.biz" -ForegroundColor White
Write-Host "BACKEND_URL=https://api.adsbox.biz" -ForegroundColor White
Write-Host ""

Write-Host "PHASE 5: Frontend Deployment (adsbox.biz)" -ForegroundColor Yellow
Write-Host "=========================================" -ForegroundColor Yellow
Write-Host "Build for production:" -ForegroundColor White
Write-Host "cd client" -ForegroundColor Gray
Write-Host "npm run build" -ForegroundColor Gray
Write-Host ""
Write-Host "Upload to main domain root:" -ForegroundColor White
Write-Host "- client/.next/ folder" -ForegroundColor White
Write-Host "- client/public/ folder" -ForegroundColor White
Write-Host "- client/package.json" -ForegroundColor White
Write-Host "- .env.production file" -ForegroundColor White
Write-Host ""

Write-Host "Environment Variables for Frontend:" -ForegroundColor Cyan
Write-Host "NEXT_PUBLIC_API_URL=https://api.adsbox.biz" -ForegroundColor White
Write-Host "NEXT_PUBLIC_FACEBOOK_APP_ID=1889698918216093" -ForegroundColor White
Write-Host "NEXT_PUBLIC_SOCKET_URL=https://api.adsbox.biz" -ForegroundColor White
Write-Host ""

Write-Host "PHASE 6: Facebook App Configuration" -ForegroundColor Yellow
Write-Host "===================================" -ForegroundColor Yellow
Write-Host "Update Facebook App with production URLs:" -ForegroundColor White
Write-Host "OAuth Redirect URIs:" -ForegroundColor Cyan
Write-Host "- https://adsbox.biz/auth/facebook/callback" -ForegroundColor White
Write-Host "- https://adsbox.biz/dashboard" -ForegroundColor White
Write-Host ""
Write-Host "Webhook URLs:" -ForegroundColor Cyan
Write-Host "- https://api.adsbox.biz/webhooks/facebook" -ForegroundColor White
Write-Host ""
Write-Host "Privacy Policy URL:" -ForegroundColor Cyan
Write-Host "- https://adsbox.biz/privacy" -ForegroundColor White
Write-Host ""
Write-Host "Terms of Service URL:" -ForegroundColor Cyan
Write-Host "- https://adsbox.biz/terms" -ForegroundColor White
Write-Host ""

Write-Host "PHASE 7: SSL and Security" -ForegroundColor Yellow
Write-Host "=========================" -ForegroundColor Yellow
Write-Host "✅ Enable SSL for adsbox.biz" -ForegroundColor Green
Write-Host "✅ Enable SSL for api.adsbox.biz" -ForegroundColor Green
Write-Host "✅ Force HTTPS redirect" -ForegroundColor Green
Write-Host "✅ Configure CORS for API subdomain" -ForegroundColor Green
Write-Host ""

Write-Host "PHASE 8: Testing Checklist" -ForegroundColor Yellow
Write-Host "==========================" -ForegroundColor Yellow
Write-Host "🧪 Test main site: https://adsbox.biz" -ForegroundColor White
Write-Host "🧪 Test API health: https://api.adsbox.biz/health" -ForegroundColor White
Write-Host "🧪 Test Facebook OAuth flow" -ForegroundColor White
Write-Host "🧪 Test live video integration" -ForegroundColor White
Write-Host "🧪 Test real-time comments" -ForegroundColor White
Write-Host ""

Write-Host "🎯 SUCCESS CRITERIA:" -ForegroundColor Green
Write-Host "===================" -ForegroundColor Green
Write-Host "✅ https://adsbox.biz loads without errors" -ForegroundColor White
Write-Host "✅ https://api.adsbox.biz/health returns 200 OK" -ForegroundColor White
Write-Host "✅ Facebook login works with production URLs" -ForegroundColor White
Write-Host "✅ Live video comments update in real-time" -ForegroundColor White
Write-Host "✅ SSL certificates working on both domains" -ForegroundColor White
Write-Host ""

Write-Host "📋 HOSTINGER SPECIFIC NOTES:" -ForegroundColor Magenta
Write-Host "============================" -ForegroundColor Magenta
Write-Host "🔹 Check if your plan supports Node.js applications" -ForegroundColor Yellow
Write-Host "🔹 Some shared hosting may require static export for Next.js" -ForegroundColor Yellow
Write-Host "🔹 WebSocket support may be limited on shared hosting" -ForegroundColor Yellow
Write-Host "🔹 Consider VPS hosting if shared hosting has limitations" -ForegroundColor Yellow
Write-Host ""

Write-Host "🚀 READY TO DEPLOY TO ADSBOX.BIZ!" -ForegroundColor Green
Write-Host ""

Write-Host "Next immediate steps:" -ForegroundColor Yellow
Write-Host "1. Login to Hostinger hPanel" -ForegroundColor White
Write-Host "2. Setup database and note connection details" -ForegroundColor White
Write-Host "3. Create api.adsbox.biz subdomain" -ForegroundColor White
Write-Host "4. Build and upload backend to /api folder" -ForegroundColor White
Write-Host "5. Build and upload frontend to main domain" -ForegroundColor White
Write-Host "6. Update Facebook App with adsbox.biz URLs" -ForegroundColor White
Write-Host ""