Write-Host "🚀 LiveSell Pro - Facebook Integration Setup" -ForegroundColor Cyan
Write-Host "=========================================" -ForegroundColor Cyan

Write-Host "Starting backend server..." -ForegroundColor Yellow
Start-Process PowerShell -ArgumentList "-Command", "cd C:\xampp\htdocs\Fbcomment\server; npm run dev" -WindowStyle Minimized

Start-Sleep -Seconds 3

Write-Host "Starting ngrok tunnel..." -ForegroundColor Yellow  
Start-Process PowerShell -ArgumentList "-Command", "ngrok http 5000" -WindowStyle Minimized

Start-Sleep -Seconds 3

Write-Host ""
Write-Host "Facebook App Configuration:" -ForegroundColor Cyan
Write-Host "1. Visit: https://developers.facebook.com/apps/" -ForegroundColor White
Write-Host "2. App ID: 1889698918216093" -ForegroundColor White
Write-Host "3. OAuth URLs:" -ForegroundColor White
Write-Host "   - http://localhost:3000/facebook/callback" -ForegroundColor Cyan
Write-Host "4. Webhook URL: [Your-Ngrok-URL]/api/facebook/webhook" -ForegroundColor Cyan
Write-Host "5. Verify Token: SystemKH_Killer_Webhook_2024" -ForegroundColor Cyan
Write-Host ""
Write-Host "Platform URLs:" -ForegroundColor Green
Write-Host "- Client: http://localhost:3000" -ForegroundColor White
Write-Host "- Facebook: http://localhost:3000/facebook" -ForegroundColor White
Write-Host "- API: http://localhost:5000/health" -ForegroundColor White
Write-Host "- Ngrok: http://localhost:4040" -ForegroundColor White
Write-Host ""
Write-Host "✅ Setup complete! Facebook integration ready!" -ForegroundColor Green