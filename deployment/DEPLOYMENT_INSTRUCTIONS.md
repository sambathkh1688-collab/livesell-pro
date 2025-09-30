
# Hostinger Deployment Instructions for adsbox.biz

## 1. Upload Backend Files
- Upload contents of 'backend/' folder to your hosting path: /api/
- Make sure Node.js is enabled in Hostinger control panel
- Run 'npm install --production' in the /api/ directory

## 2. Upload Frontend Files
- Upload contents of 'frontend/.next/' to your main domain root
- Upload contents of 'frontend/public/' to your main domain root
- Configure Next.js static export if needed

## 3. Database Setup
- Create MySQL database: livesell_production
- Import database schema from server/database/schema.sql
- Update DATABASE_URL in .env.production

## 4. Environment Variables
- Upload .env.production to /api/ directory
- Upload client/.env.production to main domain root
- Update database credentials and Facebook app secrets

## 5. Domain Configuration
- Main site: https://adsbox.biz
- API endpoint: https://api.adsbox.biz
- Enable SSL for both domains

## 6. Facebook App Update
- Update OAuth redirect URIs to use adsbox.biz
- Update webhook URLs to use api.adsbox.biz
- Test Facebook integration

🚀 Your LiveSell Pro platform is ready for adsbox.biz!
