#!/usr/bin/env pwsh
# ========================================================
# LiveSell Pro - Frontend Deployment Fix
# ========================================================

Write-Host "🔧 LIVESELL PRO - FRONTEND DEPLOYMENT FIX" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan

# Check production files
Write-Host "`n📂 Checking Production Files..." -ForegroundColor Yellow

$productionIndex = "deployment\frontend\index.html"
$productionNextFolder = "deployment\frontend\_next"

if (Test-Path $productionIndex) {
    $indexSize = (Get-Item $productionIndex).Length
    Write-Host "✅ Production index.html found: $([math]::Round($indexSize/1KB,1)) KB" -ForegroundColor Green
} else {
    Write-Host "❌ Production index.html missing!" -ForegroundColor Red
}

if (Test-Path $productionNextFolder) {
    $nextFiles = (Get-ChildItem $productionNextFolder -Recurse).Count
    Write-Host "✅ _next folder found: $nextFiles files" -ForegroundColor Green
} else {
    Write-Host "❌ _next folder missing!" -ForegroundColor Red
}

Write-Host "`n📋 FILES TO UPLOAD TO HOSTINGER /public_html/:" -ForegroundColor Cyan
Write-Host "=============================================" -ForegroundColor Cyan

if (Test-Path "deployment\frontend") {
    Write-Host "`n📁 Required Files:" -ForegroundColor Yellow
    Get-ChildItem "deployment\frontend" | ForEach-Object {
        if ($_.PSIsContainer) {
            $fileCount = (Get-ChildItem $_.FullName -Recurse).Count
            Write-Host "📁 $($_.Name)/ ($fileCount files)" -ForegroundColor White
        } else {
            $fileSize = [math]::Round($_.Length/1KB,1)
            Write-Host "📄 $($_.Name) ($fileSize KB)" -ForegroundColor White
        }
    }
    
    Write-Host "`n🎯 CRITICAL STEPS:" -ForegroundColor Yellow
    Write-Host "1. DELETE current index.html from /public_html/" -ForegroundColor White
    Write-Host "2. UPLOAD deployment\frontend\index.html to /public_html/" -ForegroundColor White
    Write-Host "3. ENSURE _next\ folder is properly uploaded" -ForegroundColor White
    Write-Host "4. VERIFY all page folders (dashboard, facebook, login, etc.)" -ForegroundColor White
    
    Write-Host "`n🔥 YOUR BEAUTIFUL LIVESELL PRO DESIGN WILL BE LIVE!" -ForegroundColor Green
}

Write-Host "`n📊 Production vs Current Comparison:" -ForegroundColor Cyan
Write-Host "Current index.html: Basic HTML (wrong file)" -ForegroundColor Red
Write-Host "Production index.html: Next.js with full design (correct file)" -ForegroundColor Green