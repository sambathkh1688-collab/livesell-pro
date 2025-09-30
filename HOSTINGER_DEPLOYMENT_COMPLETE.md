# 🌍 LiveSell Pro - Complete Hostinger Deployment Guide
# ===================================================

## 🎯 DEPLOYMENT SUMMARY
- **Frontend**: https://adsbox.biz (Next.js Static Export)
- **Backend**: https://api.adsbox.biz (Node.js Express)
- **Database**: MySQL on Hostinger
- **SSL**: Auto-enabled for both domains

---

## 📋 STEP 1: HOSTINGER PANEL SETUP

### 1.1 Login to Hostinger
1. Go to: https://hpanel.hostinger.com/
2. Login with your account credentials
3. Select your adsbox.biz domain

### 1.2 Check Hosting Plan
- Verify if your plan supports Node.js applications
- If not available, consider VPS upgrade or alternative deployment

---

## 🗄️ STEP 2: DATABASE SETUP

### 2.1 Create MySQL Database
1. In hPanel, go to **Databases** → **MySQL Databases**
2. Click **Create Database**
3. Database Settings:
   - **Database Name**: `u[your_cpanel_user]_livesell`
   - **Database User**: `u[your_cpanel_user]_live`
   - **Password**: Generate strong password (SAVE THIS!)
   - **Host**: `localhost`

### 2.2 Import Database Schema
1. Access **phpMyAdmin** from hPanel
2. Select your created database
3. Import this SQL schema:

```sql
-- LiveSell Pro Database Schema
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
('admin', 'admin@adsbox.biz', '$2b$10$N9qo8uLOickgx2ZMRZoMye/DdaBELJDKBd4IEfSLxgqzHqj3');
```

---

## 🌐 STEP 3: SUBDOMAIN CONFIGURATION

### 3.1 Create API Subdomain
1. In hPanel, go to **Domains** → **Subdomains**
2. Click **Create Subdomain**
3. Subdomain Settings:
   - **Subdomain**: `api`
   - **Domain**: `adsbox.biz`
   - **Document Root**: `/public_html/api`
4. Click **Create**

### 3.2 Enable SSL Certificates
1. Go to **Security** → **SSL/TLS**
2. Enable **Free SSL Certificate** for:
   - `adsbox.biz`
   - `api.adsbox.biz`
3. Wait 10-15 minutes for activation

---

## 📦 STEP 4: FILE UPLOAD

### 4.1 Upload Frontend Files
1. Open **File Manager** in hPanel
2. Navigate to `/public_html/`
3. Delete default `index.html` if exists
4. Upload ALL files from `deployment/frontend/` to `/public_html/`
   - This includes: `index.html`, `_next/`, `favicon.ico`, etc.

### 4.2 Upload Backend Files
1. Navigate to `/public_html/api/`
2. Upload ALL files from `deployment/backend/` to `/public_html/api/`
   - This includes: `index.js`, `config/`, `routes/`, `package.json`, `.env`

### 4.3 Configure Node.js Application (If Supported)
1. Go to **Advanced** → **Node.js** in hPanel
2. Create New Application:
   - **Node.js Version**: Latest LTS (18.x or 20.x)
   - **Application Root**: `/public_html/api`
   - **Application URL**: `api.adsbox.biz`
   - **Startup File**: `index.js`
3. Install Dependencies: `npm install`

---

## 🔧 STEP 5: ENVIRONMENT CONFIGURATION

### 5.1 Update Backend Environment
1. Edit `/public_html/api/.env` file
2. Replace placeholders with your actual values:

```env
# Database Configuration (Replace with your actual details)
DB_HOST=localhost
DB_NAME=u[your_user]_livesell
DB_USER=u[your_user]_live
DB_PASSWORD=your_actual_database_password

# Facebook App Configuration
FACEBOOK_APP_SECRET=your_actual_facebook_app_secret

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_change_this_2024
```

---

## ⚡ STEP 6: TESTING & VERIFICATION

### 6.1 Test URLs
After deployment, verify these URLs work:

✅ **Frontend**: https://adsbox.biz
✅ **API Health**: https://api.adsbox.biz/health
✅ **API Test**: https://api.adsbox.biz/api/facebook/pages

### 6.2 Check Functionality
- Homepage loads with modern design
- Login/Register pages work
- Dashboard displays correctly
- Facebook integration button works
- Real-time page shows metrics

---

## 🔧 STEP 7: FACEBOOK APP CONFIGURATION

### 7.1 Update Facebook App Settings
1. Go to: https://developers.facebook.com/apps/835145810930761
2. Update **Valid OAuth Redirect URIs**:
   - Add: `https://api.adsbox.biz/auth/facebook/callback`
   - Add: `https://adsbox.biz/facebook/connect-success`
3. Update **App Domains**:
   - Add: `adsbox.biz`
   - Add: `api.adsbox.biz`

---

## 🚨 TROUBLESHOOTING GUIDE

### If Node.js is NOT Supported:
**Option A**: Upgrade to VPS hosting
**Option B**: Use static deployment only (frontend works, backend needs external service)
**Option C**: Consider alternative hosting (Vercel, Railway, etc.)

### Common Issues:
- **SSL not working**: Wait 15 minutes, clear browser cache
- **API not responding**: Check Node.js configuration and logs
- **Database errors**: Verify credentials in .env file
- **CORS errors**: Check ALLOWED_ORIGINS in environment
- **Facebook OAuth fails**: Verify redirect URIs in Facebook App

### Performance Optimization:
- Enable **Browser Caching** in hPanel
- Enable **Gzip Compression**
- Use **CDN** if available in your plan

---

## 🎉 DEPLOYMENT COMPLETE!

Your LiveSell Pro platform is now live at:
- **🌐 Main Site**: https://adsbox.biz
- **⚡ API**: https://api.adsbox.biz

### Next Steps:
1. Test all functionality thoroughly
2. Configure Facebook App with production URLs
3. Invite beta testers to your platform
4. Monitor performance and logs
5. Set up backup procedures

### Support:
- **Hostinger Support**: Live chat in hPanel
- **Facebook Developer Support**: https://developers.facebook.com/support/
- **Performance Monitoring**: Check hPanel analytics

---

**🏆 Congratulations! Your modern LiveSell Pro platform is now dominating the live commerce space!**