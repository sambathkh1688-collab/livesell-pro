Write-Host "🚀 LIVESELL PRO - HOSTINGER DEPLOYMENT PREPARATION" -ForegroundColor Cyan
Write-Host "=================================================" -ForegroundColor Cyan

Write-Host ""
Write-Host "📦 Building production files..." -ForegroundColor Yellow

# Navigate to project directory
Set-Location "c:\xampp\htdocs\Fbcomment"

Write-Host "Building Next.js frontend..." -ForegroundColor Green
Set-Location "client"
npm run build

Write-Host "Building Node.js backend..." -ForegroundColor Green
Set-Location "..\server"
npm run build

Set-Location ".."

Write-Host ""
Write-Host "🔧 Creating production environment..." -ForegroundColor Yellow

# Create production .env for backend
$productionEnv = @"
# LiveSell Pro - Production Environment
NODE_ENV=production
PORT=3001

# Database Configuration (Update with your Hostinger details)
DB_HOST=localhost
DB_NAME=u123456789_livesell
DB_USER=u123456789_live
DB_PASSWORD=YOUR_DATABASE_PASSWORD
DB_PORT=3306

# Facebook App Configuration
FACEBOOK_APP_ID=835145810930761
FACEBOOK_APP_SECRET=YOUR_FACEBOOK_APP_SECRET
FACEBOOK_REDIRECT_URI=https://api.adsbox.biz/auth/facebook/callback

# CORS Configuration
FRONTEND_URL=https://adsbox.biz
ALLOWED_ORIGINS=https://adsbox.biz,https://www.adsbox.biz

# JWT Configuration
JWT_SECRET=YOUR_SUPER_SECRET_JWT_KEY_FOR_PRODUCTION_2024
"@

$productionEnv | Out-File -FilePath "server\.env.production" -Encoding UTF8

Write-Host "✅ Created production environment file" -ForegroundColor Green

Write-Host ""
Write-Host "📁 Preparing deployment folder..." -ForegroundColor Yellow

# Create deployment directory
if (Test-Path "deployment") {
    Remove-Item "deployment" -Recurse -Force
}
New-Item -ItemType Directory -Path "deployment" | Out-Null
New-Item -ItemType Directory -Path "deployment\frontend" | Out-Null
New-Item -ItemType Directory -Path "deployment\backend" | Out-Null

# Copy frontend files
if (Test-Path "client\out") {
    Copy-Item "client\out\*" "deployment\frontend\" -Recurse -Force
    Write-Host "✅ Frontend files prepared" -ForegroundColor Green
} else {
    Write-Host "❌ Frontend build not found" -ForegroundColor Red
}

# Copy backend files
if (Test-Path "server\dist") {
    Copy-Item "server\dist\*" "deployment\backend\" -Recurse -Force
    Copy-Item "server\package.json" "deployment\backend\" -Force
    Copy-Item "server\.env.production" "deployment\backend\.env" -Force
    Write-Host "✅ Backend files prepared" -ForegroundColor Green
} else {
    Write-Host "❌ Backend build not found" -ForegroundColor Red
}

Write-Host ""
Write-Host "🎉 DEPLOYMENT FILES READY!" -ForegroundColor Green
Write-Host "Upload 'deployment/frontend' to /public_html/" -ForegroundColor Cyan
Write-Host "Upload 'deployment/backend' to /public_html/api/" -ForegroundColor Cyan