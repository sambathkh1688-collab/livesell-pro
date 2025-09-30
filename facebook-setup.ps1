# LiveSell Pro - Facebook Integration Setup Script
# This script sets up Facebook API integration for the SystemKH killer platform!

Write-Host "🚀 LiveSell Pro - Facebook Integration Setup" -ForegroundColor Cyan
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host ""

# Check if ngrok is installed
Write-Host "📡 Checking ngrok installation..." -ForegroundColor Yellow
try {
    $ngrokVersion = ngrok --version
    Write-Host "✅ Ngrok installed: $ngrokVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Ngrok not found. Please install ngrok first." -ForegroundColor Red
    Write-Host "Run: npm install -g ngrok" -ForegroundColor Yellow
    exit 1
}

Write-Host ""
Write-Host "🔧 Facebook Integration Checklist:" -ForegroundColor Cyan
Write-Host "1. ✅ Ngrok installed for public URLs" -ForegroundColor Green
Write-Host "2. 🔄 Starting backend server..." -ForegroundColor Yellow

# Start the backend server
Write-Host ""
Write-Host "🚀 Starting LiveSell Pro backend server on port 5000..." -ForegroundColor Yellow
$serverJob = Start-Job -ScriptBlock {
    Set-Location "C:\xampp\htdocs\Fbcomment\server"
    npm run dev
}

Start-Sleep -Seconds 5

# Start ngrok tunnel
Write-Host "🌐 Starting ngrok tunnel for port 5000..." -ForegroundColor Yellow
$ngrokJob = Start-Job -ScriptBlock {
    ngrok http 5000 --log=stdout
}

Start-Sleep -Seconds 3

Write-Host ""
Write-Host "📋 Facebook App Configuration Required:" -ForegroundColor Cyan
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host ""

# Get ngrok URL
try {
    $ngrokInfo = Invoke-RestMethod -Uri "http://localhost:4040/api/tunnels" -Method GET
    $publicUrl = $ngrokInfo.tunnels[0].public_url
    Write-Host "🌍 Your public ngrok URL: $publicUrl" -ForegroundColor Green
    Write-Host ""
    
    Write-Host "🔑 Facebook App Settings (https://developers.facebook.com):" -ForegroundColor Yellow
    Write-Host "1. App ID: Already configured in .env" -ForegroundColor White
    Write-Host "2. App Secret: Already configured in .env" -ForegroundColor White
    Write-Host "3. Valid OAuth Redirect URIs:" -ForegroundColor White
    Write-Host "   - $publicUrl/api/facebook/callback" -ForegroundColor Cyan
    Write-Host "   - http://localhost:3000/facebook/callback" -ForegroundColor Cyan
    Write-Host "4. Webhook URL:" -ForegroundColor White
    Write-Host "   - $publicUrl/api/facebook/webhook" -ForegroundColor Cyan
    Write-Host "5. Webhook Verify Token: SystemKH_Killer_Webhook_2024" -ForegroundColor Cyan
    Write-Host ""
    
} catch {
    Write-Host "⚠️ Ngrok API not ready yet. Getting URL manually..." -ForegroundColor Yellow
    Write-Host ""
    Write-Host "🔑 Facebook App Settings (https://developers.facebook.com):" -ForegroundColor Yellow
    Write-Host "1. App ID: Already configured in .env" -ForegroundColor White
    Write-Host "2. App Secret: Already configured in .env" -ForegroundColor White
    Write-Host "3. Valid OAuth Redirect URIs:" -ForegroundColor White
    Write-Host "   - [YOUR_NGROK_URL]/api/facebook/callback" -ForegroundColor Cyan
    Write-Host "   - http://localhost:3000/facebook/callback" -ForegroundColor Cyan
    Write-Host "4. Webhook URL:" -ForegroundColor White
    Write-Host "   - [YOUR_NGROK_URL]/api/facebook/webhook" -ForegroundColor Cyan
    Write-Host "5. Webhook Verify Token: SystemKH_Killer_Webhook_2024" -ForegroundColor Cyan
}

Write-Host "📱 Required Facebook Permissions:" -ForegroundColor Yellow
Write-Host "- pages_show_list (Get user's pages)" -ForegroundColor White
Write-Host "- pages_read_engagement (Read page insights)" -ForegroundColor White
Write-Host "- pages_manage_posts (Manage page posts)" -ForegroundColor White
Write-Host "- pages_read_user_content (Read user content on pages)" -ForegroundColor White
Write-Host "- live_video_api (Access to Live Video API)" -ForegroundColor White
Write-Host ""

Write-Host "🎯 Next Steps:" -ForegroundColor Yellow
Write-Host "1. Visit https://developers.facebook.com/apps/" -ForegroundColor White
Write-Host "2. Select your app or create a new one" -ForegroundColor White
Write-Host "3. Add the URLs above to your app settings" -ForegroundColor White
Write-Host "4. Test the OAuth flow at http://localhost:3000/facebook" -ForegroundColor White
Write-Host ""

Write-Host "🔗 Platform Access URLs:" -ForegroundColor Cyan
Write-Host "- Landing Page: http://localhost:8080/Fbcomment/" -ForegroundColor Green
Write-Host "- Client App:   http://localhost:3000" -ForegroundColor Green
Write-Host "- API Health:   http://localhost:5000/health" -ForegroundColor Green
Write-Host "- Ngrok Web UI: http://localhost:4040" -ForegroundColor Green
Write-Host ""

Write-Host "⚡ LiveSell Pro is ready to crush SystemKH! 🚀" -ForegroundColor Green
Write-Host ""

# Keep the script running
Write-Host "Press Ctrl+C to stop servers and exit..." -ForegroundColor Yellow
try {
    while ($true) {
        Start-Sleep -Seconds 10
        
        # Check if jobs are still running
        $serverRunning = (Get-Job -Id $serverJob.Id).State -eq "Running"
        $ngrokRunning = (Get-Job -Id $ngrokJob.Id).State -eq "Running"
        
        if (-not $serverRunning) {
            Write-Host "⚠️  Backend server stopped. Restarting..." -ForegroundColor Yellow
            $serverJob = Start-Job -ScriptBlock {
                Set-Location "C:\xampp\htdocs\Fbcomment\server"
                npm run dev
            }
        }
        
        if (-not $ngrokRunning) {
            Write-Host "⚠️  Ngrok tunnel stopped. Restarting..." -ForegroundColor Yellow
            $ngrokJob = Start-Job -ScriptBlock {
                ngrok http 5000 --log=stdout
            }
        }
    }
} catch {
    Write-Host ""
    Write-Host "🛑 Stopping servers..." -ForegroundColor Red
} finally {
    # Clean up jobs
    if ($serverJob) { Stop-Job $serverJob; Remove-Job $serverJob }
    if ($ngrokJob) { Stop-Job $ngrokJob; Remove-Job $ngrokJob }
    Write-Host "✅ Cleanup complete!" -ForegroundColor Green
}