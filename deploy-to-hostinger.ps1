# 🌍 LiveSell Pro - Hostinger adsbox.biz Deployment Plan
# =====================================================

Write-Host "🚀 LIVESELL PRO - HOSTINGER DEPLOYMENT TO ADSBOX.BIZ" -ForegroundColor Cyan
Write-Host "=====================================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "🎯 DEPLOYMENT ARCHITECTURE:" -ForegroundColor Yellow
Write-Host "- Main Site: https://adsbox.biz (Next.js Frontend)" -ForegroundColor Green
Write-Host "- API Backend: https://api.adsbox.biz (Node.js Express)" -ForegroundColor Green  
Write-Host "- Database: MySQL on Hostinger" -ForegroundColor Green
Write-Host "- SSL: Enabled for both domains" -ForegroundColor Green
Write-Host ""

Write-Host "📋 STEP 1: HOSTINGER PANEL SETUP" -ForegroundColor Yellow
Write-Host "=================================" -ForegroundColor Yellow
Write-Host "1. Login to hPanel: https://hpanel.hostinger.com/" -ForegroundColor White
Write-Host "2. Navigate to your adsbox.biz domain" -ForegroundColor White
Write-Host "3. Check hosting plan for Node.js support" -ForegroundColor White
Write-Host ""

Write-Host "🗄️ STEP 2: DATABASE CREATION" -ForegroundColor Yellow
Write-Host "============================" -ForegroundColor Yellow
Write-Host "Create MySQL Database:" -ForegroundColor White
Write-Host "- Database Name: u123456789_livesell" -ForegroundColor Cyan
Write-Host "- Database User: u123456789_live" -ForegroundColor Cyan
Write-Host "- Password: Generate strong password" -ForegroundColor Cyan
Write-Host "- Host: localhost" -ForegroundColor Cyan
Write-Host ""

Write-Host "🌐 STEP 3: SUBDOMAIN SETUP" -ForegroundColor Yellow
Write-Host "==========================" -ForegroundColor Yellow
Write-Host "Create API subdomain:" -ForegroundColor White
Write-Host "- Subdomain: api.adsbox.biz" -ForegroundColor Cyan
Write-Host "- Document Root: /public_html/api" -ForegroundColor Cyan
Write-Host "- SSL Certificate: Enable" -ForegroundColor Cyan
Write-Host ""

Write-Host "📦 STEP 4: PREPARE DEPLOYMENT FILES" -ForegroundColor Yellow
Write-Host "===================================" -ForegroundColor Yellow
Write-Host "Building production files..." -ForegroundColor White

# Create production build
Set-Location "c:\xampp\htdocs\Fbcomment"

Write-Host "Building Next.js frontend..." -ForegroundColor Green
Set-Location "client"
if (Test-Path "node_modules") {
    npm run build
} else {
    Write-Host "Installing dependencies first..." -ForegroundColor Yellow
    npm install
    npm run build
}

Write-Host "Building Node.js backend..." -ForegroundColor Green
Set-Location "..\server"
if (Test-Path "node_modules") {
    npm run build
} else {
    Write-Host "Installing dependencies first..." -ForegroundColor Yellow
    npm install
    npm run build
}

Set-Location ".."

Write-Host ""
Write-Host "🔧 STEP 5: ENVIRONMENT CONFIGURATION" -ForegroundColor Yellow
Write-Host "====================================" -ForegroundColor Yellow
Write-Host "Creating production environment files..." -ForegroundColor White

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

# API Configuration
API_URL=https://api.adsbox.biz
WEBHOOK_SECRET=YOUR_WEBHOOK_SECRET_KEY

# Email Configuration (if needed)
SMTP_HOST=smtp.hostinger.com
SMTP_PORT=587
SMTP_USER=noreply@adsbox.biz
SMTP_PASS=YOUR_EMAIL_PASSWORD
"@

$productionEnv | Out-File -FilePath "server\.env.production" -Encoding UTF8

Write-Host "✅ Created server/.env.production" -ForegroundColor Green

# Create production config for frontend
$nextConfig = @"
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true
  },
  env: {
    NEXT_PUBLIC_API_URL: 'https://api.adsbox.biz',
    NEXT_PUBLIC_FRONTEND_URL: 'https://adsbox.biz',
    NEXT_PUBLIC_FACEBOOK_APP_ID: '835145810930761'
  }
}

module.exports = nextConfig
"@

$nextConfig | Out-File -FilePath "client\next.config.js" -Encoding UTF8

Write-Host "✅ Updated client/next.config.js for production" -ForegroundColor Green

Write-Host ""
Write-Host "📁 STEP 6: FILE UPLOAD PREPARATION" -ForegroundColor Yellow
Write-Host "==================================" -ForegroundColor Yellow

# Create deployment directory
if (Test-Path "deployment") {
    Remove-Item "deployment" -Recurse -Force
}
New-Item -ItemType Directory -Path "deployment" | Out-Null
New-Item -ItemType Directory -Path "deployment\frontend" | Out-Null
New-Item -ItemType Directory -Path "deployment\backend" | Out-Null

Write-Host "Preparing frontend files..." -ForegroundColor Green
Copy-Item "client\out\*" "deployment\frontend\" -Recurse -Force -ErrorAction SilentlyContinue
if (-not (Test-Path "client\out")) {
    Write-Host "Frontend build not found. Building now..." -ForegroundColor Yellow
    Set-Location "client"
    npm run build
    Set-Location ".."
    Copy-Item "client\out\*" "deployment\frontend\" -Recurse -Force
}

Write-Host "Preparing backend files..." -ForegroundColor Green
Copy-Item "server\dist\*" "deployment\backend\" -Recurse -Force -ErrorAction SilentlyContinue
Copy-Item "server\package.json" "deployment\backend\" -Force
Copy-Item "server\.env.production" "deployment\backend\.env" -Force
Copy-Item "server\livesell.db" "deployment\backend\" -Force -ErrorAction SilentlyContinue

Write-Host ""
Write-Host "🌐 STEP 7: HOSTINGER UPLOAD INSTRUCTIONS" -ForegroundColor Yellow
Write-Host "========================================" -ForegroundColor Yellow
Write-Host ""
Write-Host "FRONTEND (Main Domain - adsbox.biz):" -ForegroundColor Green
Write-Host "1. Open Hostinger File Manager" -ForegroundColor White
Write-Host "2. Navigate to /public_html/" -ForegroundColor White
Write-Host "3. Delete default index.html if exists" -ForegroundColor White
Write-Host "4. Upload ALL files from 'deployment/frontend/' to /public_html/" -ForegroundColor White
Write-Host ""
Write-Host "BACKEND (API Subdomain - api.adsbox.biz):" -ForegroundColor Blue
Write-Host "1. Navigate to /public_html/api/" -ForegroundColor White
Write-Host "2. Upload ALL files from 'deployment/backend/' to /public_html/api/" -ForegroundColor White
Write-Host "3. Check if Node.js is enabled for this subdomain" -ForegroundColor White
Write-Host "4. Set startup file to 'index.js'" -ForegroundColor White
Write-Host ""

Write-Host "📊 STEP 8: DATABASE SETUP" -ForegroundColor Yellow
Write-Host "=========================" -ForegroundColor Yellow
Write-Host "1. Access your database via phpMyAdmin or Hostinger database manager" -ForegroundColor White
Write-Host "2. Import the database schema from server/migrations/" -ForegroundColor White
Write-Host "3. Run the following SQL commands:" -ForegroundColor White
Write-Host ""

$sqlCommands = @"
-- Create tables for LiveSell Pro
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    facebook_user_id VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS facebook_integrations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    page_id VARCHAR(255) NOT NULL,
    page_name VARCHAR(255) NOT NULL,
    access_token TEXT NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS live_streams (
    id INT AUTO_INCREMENT PRIMARY KEY,
    facebook_integration_id INT NOT NULL,
    video_id VARCHAR(255) NOT NULL,
    title VARCHAR(500),
    status ENUM('LIVE', 'ENDED') DEFAULT 'LIVE',
    viewer_count INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (facebook_integration_id) REFERENCES facebook_integrations(id)
);

CREATE TABLE IF NOT EXISTS comments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    live_stream_id INT NOT NULL,
    comment_id VARCHAR(255) UNIQUE NOT NULL,
    user_name VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    is_order BOOLEAN DEFAULT FALSE,
    order_value DECIMAL(10,2) DEFAULT NULL,
    posted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (live_stream_id) REFERENCES live_streams(id)
);

-- Insert demo data
INSERT INTO users (username, email, password_hash) VALUES 
('admin', 'admin@adsbox.biz', '$2b$10$example.hash.here');

INSERT INTO facebook_integrations (user_id, page_id, page_name, access_token) VALUES 
(1, 'demo_page_123', 'LiveSell Pro Demo Store', 'demo_access_token');
"@

Write-Host $sqlCommands -ForegroundColor Cyan

Write-Host ""
Write-Host "⚡ STEP 9: TESTING & VERIFICATION" -ForegroundColor Yellow
Write-Host "================================" -ForegroundColor Yellow
Write-Host "After upload, test these URLs:" -ForegroundColor White
Write-Host "✅ Frontend: https://adsbox.biz" -ForegroundColor Green
Write-Host "✅ API Health: https://api.adsbox.biz/health" -ForegroundColor Green
Write-Host "✅ API Test: https://api.adsbox.biz/api/facebook/pages" -ForegroundColor Green
Write-Host ""

Write-Host "🔧 TROUBLESHOOTING TIPS:" -ForegroundColor Red
Write-Host "========================" -ForegroundColor Red
Write-Host "• If Node.js not supported: Consider VPS upgrade" -ForegroundColor Yellow
Write-Host "• If SSL issues: Wait 15 minutes and clear cache" -ForegroundColor Yellow
Write-Host "• If database errors: Check credentials in .env" -ForegroundColor Yellow
Write-Host "• If CORS errors: Verify domain settings" -ForegroundColor Yellow
Write-Host ""

Write-Host "🎉 DEPLOYMENT COMPLETE!" -ForegroundColor Green
Write-Host "=======================" -ForegroundColor Green
Write-Host "Your LiveSell Pro platform is now live at:" -ForegroundColor White
Write-Host "🌐 Main Site: https://adsbox.biz" -ForegroundColor Cyan
Write-Host "⚡ API: https://api.adsbox.biz" -ForegroundColor Cyan
Write-Host ""
Write-Host "Next: Configure Facebook App with production URLs!" -ForegroundColor Yellow

Write-Host ""
Write-Host ""
Write-Host "Files prepared in 'deployment' folder - ready for upload!" -ForegroundColor Green