# LiveSell Pro - Facebook Integration Setup
Write-Host "🚀 LiveSell Pro - Facebook Integration Setup" -ForegroundColor Cyan
Write-Host "=========================================" -ForegroundColor Cyan

# Check ngrok
Write-Host "📡 Checking ngrok..." -ForegroundColor Yellow
$ngrokCheck = Get-Command ngrok -ErrorAction SilentlyContinue
if ($ngrokCheck) {
    Write-Host "✅ Ngrok is installed" -ForegroundColor Green
} else {
    Write-Host "❌ Ngrok not found. Installing..." -ForegroundColor Red
    npm install -g ngrok
}

Write-Host ""
Write-Host "🚀 Starting servers..." -ForegroundColor Yellow

# Start backend server
Write-Host "Starting backend server on port 5000..." -ForegroundColor Yellow
Start-Process PowerShell -ArgumentList "-NoExit", "-Command", "cd 'C:\xampp\htdocs\Fbcomment\server'; npm run dev" -WindowStyle Minimized

Start-Sleep -Seconds 3

# Start ngrok
Write-Host "Starting ngrok tunnel..." -ForegroundColor Yellow  
Start-Process PowerShell -ArgumentList "-NoExit", "-Command", "ngrok http 5000" -WindowStyle Minimized

Start-Sleep -Seconds 3

Write-Host ""
Write-Host "🔧 Facebook App Configuration:" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "1. Visit: https://developers.facebook.com/apps/" -ForegroundColor White
Write-Host "2. Use App ID from .env: 1889698918216093" -ForegroundColor White
Write-Host "3. Add these OAuth Redirect URIs:" -ForegroundColor White
Write-Host "   - http://localhost:3000/facebook/callback" -ForegroundColor Cyan
Write-Host "   - [Your-Ngrok-URL]/api/facebook/callback" -ForegroundColor Cyan
Write-Host ""
Write-Host "4. Webhook Configuration:" -ForegroundColor White
Write-Host "   - URL: [Your-Ngrok-URL]/api/facebook/webhook" -ForegroundColor Cyan  
Write-Host "   - Verify Token: SystemKH_Killer_Webhook_2024" -ForegroundColor Cyan
Write-Host ""
Write-Host "5. Required Permissions:" -ForegroundColor White
Write-Host "   - pages_show_list" -ForegroundColor Cyan
Write-Host "   - pages_read_engagement" -ForegroundColor Cyan
Write-Host "   - pages_manage_posts" -ForegroundColor Cyan
Write-Host "   - live_video_api" -ForegroundColor Cyan
Write-Host ""

Write-Host "🔗 Platform URLs:" -ForegroundColor Green
Write-Host "- Landing Page: http://localhost:8080/Fbcomment/" -ForegroundColor White
Write-Host "- Client App: http://localhost:3000" -ForegroundColor White  
Write-Host "- Facebook Integration: http://localhost:3000/facebook" -ForegroundColor White
Write-Host "- API Health: http://localhost:5000/health" -ForegroundColor White
Write-Host "- Ngrok Dashboard: http://localhost:4040" -ForegroundColor White
Write-Host ""

Write-Host "⚡ LiveSell Pro is ready to crush SystemKH! 🚀" -ForegroundColor Green
Write-Host ""
Write-Host "Press any key to continue..." -ForegroundColor Yellow
Read-Host "Press Enter to continue"