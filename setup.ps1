# LiveSell Pro Setup Script - Professional Facebook Live Commerce Platform
# Enhanced setup script for complete project initialization

Write-Host ""
Write-Host "🚀 LiveSell Pro - Professional Facebook Live Commerce Platform" -ForegroundColor Green
Write-Host "═══════════════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "Setting up your professional platform to dominate live commerce..." -ForegroundColor Yellow
Write-Host ""

# Function to check if a command exists
function Test-Command($cmdname) {
    return [bool](Get-Command -Name $cmdname -ErrorAction SilentlyContinue)
}

# Check system requirements
Write-Host "� Checking system requirements..." -ForegroundColor Yellow

# Check Node.js
if (-not (Test-Command "node")) {
    Write-Host "❌ Node.js is not installed. Please install Node.js 18+ first." -ForegroundColor Red
    Write-Host "   Download from: https://nodejs.org/" -ForegroundColor Gray
    exit 1
}

$nodeVersion = node --version
Write-Host "✅ Node.js version: $nodeVersion" -ForegroundColor Green

# Check npm
if (-not (Test-Command "npm")) {
    Write-Host "❌ npm is not installed. Please install npm." -ForegroundColor Red
    exit 1
}

$npmVersion = npm --version
Write-Host "✅ npm version: $npmVersion" -ForegroundColor Green

# Check if we're in the right directory
if (-not (Test-Path "package.json")) {
    Write-Host "❌ package.json not found. Please run this script from the project root." -ForegroundColor Red
    exit 1
}

Write-Host "✅ Project directory confirmed" -ForegroundColor Green
Write-Host ""

# Install root dependencies
Write-Host "📦 Installing root dependencies..." -ForegroundColor Yellow
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to install root dependencies" -ForegroundColor Red
    exit 1
}
Write-Host "✅ Root dependencies installed!" -ForegroundColor Green

# Check if client directory exists
if (Test-Path "client") {
    Write-Host "📱 Installing client dependencies..." -ForegroundColor Yellow
    Push-Location client
    
    npm install
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Failed to install client dependencies" -ForegroundColor Red
        Pop-Location
        exit 1
    }
    
    Write-Host "✅ Client dependencies installed!" -ForegroundColor Green
    Pop-Location
} else {
    Write-Host "⚠️ Client directory not found, skipping client setup" -ForegroundColor Orange
}

# Check if server directory exists
if (Test-Path "server") {
    Write-Host "🛠️ Installing server dependencies..." -ForegroundColor Yellow
    Push-Location server
    
    npm install
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Failed to install server dependencies" -ForegroundColor Red
        Pop-Location
        exit 1
    }
    
    Write-Host "✅ Server dependencies installed!" -ForegroundColor Green
    
    # Setup database
    Write-Host "🗄️ Setting up database..." -ForegroundColor Yellow
    if (Test-Path "package.json") {
        $packageContent = Get-Content "package.json" | ConvertFrom-Json
        if ($packageContent.scripts."db:migrate") {
            npm run db:migrate
            if ($LASTEXITCODE -eq 0) {
                Write-Host "✅ Database migrations completed!" -ForegroundColor Green
            } else {
                Write-Host "⚠️ Database setup skipped (will create on first run)" -ForegroundColor Orange
            }
        }
    }
    
    Pop-Location
} else {
    Write-Host "⚠️ Server directory not found, skipping server setup" -ForegroundColor Orange
}

Write-Host ""
Write-Host "🎉 Setup completed successfully!" -ForegroundColor Green
Write-Host ""

# Display access information
Write-Host "🔗 Your LiveSell Pro Platform Access:" -ForegroundColor White
Write-Host "   • Main Landing:  http://localhost:8080/Fbcomment/" -ForegroundColor Cyan
Write-Host "   • Client App:    http://localhost:3000" -ForegroundColor Cyan  
Write-Host "   • Server API:    http://localhost:5000" -ForegroundColor Cyan
Write-Host "   • API Health:    http://localhost:5000/health" -ForegroundColor Cyan
Write-Host ""

Write-Host "📋 Quick Start Commands:" -ForegroundColor White
Write-Host "   • Start all:     npm run dev" -ForegroundColor Gray
Write-Host "   • Start server:  npm run server:dev" -ForegroundColor Gray
Write-Host "   • Start client:  npm run client:dev" -ForegroundColor Gray
Write-Host "   • Test API:      node test-api.js" -ForegroundColor Gray
Write-Host ""

# Ask if user wants to start the development servers
$startServers = Read-Host "Would you like to start the development servers now? (y/N)"
if ($startServers -eq "y" -or $startServers -eq "Y") {
    Write-Host ""
    Write-Host "🚀 Starting development servers..." -ForegroundColor Green
    Write-Host "Press Ctrl+C to stop all servers" -ForegroundColor Yellow
    Write-Host ""
    
    # Start development servers
    npm run dev
} else {
    Write-Host ""
    Write-Host "✨ All set! Run 'npm run dev' when you're ready to start." -ForegroundColor Green
    Write-Host "🏆 Your professional Facebook Live Commerce platform is ready!" -ForegroundColor Cyan
    Write-Host ""
}