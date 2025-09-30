📋 HOSTINGER UPLOAD CHECKLIST for adsbox.biz
===============================================

BEFORE UPLOADING - COMPLETE THESE STEPS:
========================================
□ Hostinger hPanel login successful
□ MySQL database 'livesell_production' created
□ Database credentials noted down
□ api.adsbox.biz subdomain created
□ SSL certificates enabled
□ Node.js application created for API subdomain

DATABASE CREDENTIALS TO UPDATE:
===============================
You need to update .env.production with YOUR database details:

Current: DATABASE_URL=mysql://db_user:db_password@localhost/livesell_production
Update to: DATABASE_URL=mysql://[YOUR_DB_USER]:[YOUR_DB_PASSWORD]@localhost/livesell_production

UPLOAD SEQUENCE:
===============

1️⃣ UPLOAD DATABASE SCHEMA (FIRST!)
----------------------------------
□ Go to hPanel → Databases → Manage → Import
□ Upload file: deployment/database_schema.sql
□ Click "Import" - this creates all tables

2️⃣ UPLOAD BACKEND FILES
-----------------------
Destination: /public_html/api/
Files to upload from deployment/backend/:
□ dist/ (entire folder)
□ package.json
□ package-lock.json
□ .env.production (UPDATED with your DB credentials!)

3️⃣ INSTALL BACKEND DEPENDENCIES
-------------------------------
□ Go to hPanel → Advanced → Node.js → Your API App
□ Click "Open Terminal" or use SSH
□ Run: npm install --production
□ Run: npm start (to test if it starts)

4️⃣ UPLOAD FRONTEND FILES
------------------------
Destination: /public_html/
Files to upload from deployment/frontend/:
□ .next/ (entire folder - this is the built Next.js app)
□ package.json
□ .env.production (frontend environment variables)

5️⃣ CONFIGURE DOMAIN SETTINGS
----------------------------
□ Verify https://adsbox.biz loads the frontend
□ Verify https://api.adsbox.biz/health returns 200 OK
□ Test SSL certificates are working (green lock icon)

6️⃣ UPDATE FACEBOOK APP
----------------------
□ Go to developers.facebook.com/apps/1889698918216093
□ Update OAuth Redirect URIs:
  - https://adsbox.biz/auth/facebook/callback
  - https://adsbox.biz/dashboard
□ Update Webhook URL: https://api.adsbox.biz/webhooks/facebook
□ Update App Domains: adsbox.biz

TESTING CHECKLIST:
=================
□ https://adsbox.biz loads without errors
□ https://api.adsbox.biz/health returns {"status": "ok"}
□ Facebook login button works
□ Database connection successful (check API health endpoint)
□ SSL certificates working on both domains

🚨 COMMON ISSUES & SOLUTIONS:
============================
❌ "500 Internal Server Error" on API → Check Node.js logs in hPanel
❌ Database connection failed → Verify DATABASE_URL in .env.production
❌ Frontend not loading → Ensure .next folder uploaded to /public_html/
❌ SSL not working → Wait 15-30 minutes after enabling in hPanel
❌ Facebook login fails → Check redirect URIs match exactly

🎉 SUCCESS CRITERIA:
===================
✅ Both domains load with SSL (green lock)
✅ API health check returns 200 OK
✅ Facebook OAuth flow works end-to-end
✅ Database queries working (check logs)

Ready to launch your SystemKH killer! 🚀

NEED HELP? 
- Hostinger Support: Live chat in hPanel
- Check hPanel error logs if something fails
- Test each step before moving to the next