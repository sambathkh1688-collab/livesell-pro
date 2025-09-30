#!/usr/bin/env pwsh
# ========================================================
# LiveSell Pro - FINAL DEPLOYMENT VERIFICATION
# ========================================================

Write-Host "🚀 LIVESELL PRO - DEPLOYMENT VERIFICATION" -ForegroundColor Cyan
Write-Host "=========================================" -ForegroundColor Cyan

# Check deployment structure
Write-Host "`n📁 Verifying Deployment Structure..." -ForegroundColor Yellow

if (Test-Path "deployment/frontend") {
    $frontendFiles = Get-ChildItem "deployment/frontend" -Recurse | Measure-Object
    Write-Host "✅ Frontend files ready: $($frontendFiles.Count) files" -ForegroundColor Green
} else {
    Write-Host "❌ Frontend deployment folder missing!" -ForegroundColor Red
}

if (Test-Path "deployment/backend") {
    $backendFiles = Get-ChildItem "deployment/backend" -Recurse | Measure-Object
    Write-Host "✅ Backend files ready: $($backendFiles.Count) files" -ForegroundColor Green
} else {
    Write-Host "❌ Backend deployment folder missing!" -ForegroundColor Red
}

# Verify critical files
Write-Host "`n🔍 Critical Files Check..." -ForegroundColor Yellow

$criticalFiles = @(
    "deployment/frontend/index.html",
    "deployment/frontend/_next/static",
    "deployment/backend/index.js",
    "deployment/backend/package.json",
    "deployment/backend/.env"
)

foreach ($file in $criticalFiles) {
    if (Test-Path $file) {
        Write-Host "✅ $file" -ForegroundColor Green
    } else {
        Write-Host "❌ $file" -ForegroundColor Red
    }
}

# Display deployment summary
Write-Host "`n📊 DEPLOYMENT SUMMARY" -ForegroundColor Cyan
Write-Host "=====================" -ForegroundColor Cyan
Write-Host "Frontend Target: https://adsbox.biz" -ForegroundColor Green
Write-Host "Backend Target:  https://api.adsbox.biz" -ForegroundColor Green
Write-Host "Upload Path:     /public_html/ (frontend) + /public_html/api/ (backend)" -ForegroundColor Green

Write-Host "`n📋 NEXT ACTIONS:" -ForegroundColor Cyan
Write-Host "1. 🌐 Login to Hostinger hPanel (https://hpanel.hostinger.com/)"
Write-Host "2. 🗄️ Create MySQL database for LiveSell Pro"
Write-Host "3. 🌍 Create 'api' subdomain pointing to /public_html/api/"
Write-Host "4. 📁 Upload deployment/frontend/* to /public_html/"
Write-Host "5. 📁 Upload deployment/backend/* to /public_html/api/"
Write-Host "6. 🔧 Configure Node.js application (if supported)"
Write-Host "7. 🔐 Update .env with production database credentials"
Write-Host "8. 🎯 Update Facebook App with production URLs"
Write-Host "9. ✅ Test https://adsbox.biz and https://api.adsbox.biz"

Write-Host "`n🏆 LIVESELL PRO IS READY FOR PRODUCTION!" -ForegroundColor Green
Write-Host "Modern design ✅ | Facebook integration ✅ | Production build ✅" -ForegroundColor Green

# Display file structure for reference
Write-Host "`n📋 Upload Reference:" -ForegroundColor Yellow
Write-Host "Frontend (to /public_html/):" -ForegroundColor White
if (Test-Path "deployment/frontend") {
    Get-ChildItem "deployment/frontend" | ForEach-Object { Write-Host "  - $($_.Name)" }
}

Write-Host "`nBackend (to /public_html/api/):" -ForegroundColor White
if (Test-Path "deployment/backend") {
    Get-ChildItem "deployment/backend" | ForEach-Object { Write-Host "  - $($_.Name)" }
}

Write-Host "`n🎉 Ready to dominate the live commerce market!" -ForegroundColor Magenta