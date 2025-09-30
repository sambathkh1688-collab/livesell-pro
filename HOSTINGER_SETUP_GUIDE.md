🌍 HOSTINGER SETUP GUIDE - Step by Step for adsbox.biz
========================================================

STEP 1: LOGIN TO HOSTINGER 🔐
=============================
1. Go to: https://hpanel.hostinger.com/
2. Login with your Hostinger account credentials
3. You should see your adsbox.biz domain in the dashboard

STEP 2: CREATE MYSQL DATABASE 🗄️
=================================
1. In hPanel, click on "Databases" in the left sidebar
2. Click "Create Database"
3. Database name: livesell_production
4. Database user: livesell_user
5. Generate a strong password and SAVE IT!
6. Click "Create"

📝 IMPORTANT: Note these details (you'll need them):
- Database Name: livesell_production
- Database User: livesell_user  
- Database Password: [your generated password]
- Database Host: localhost (usually)

STEP 3: CREATE API SUBDOMAIN 🌐
===============================
1. Go to "Domains" → "Manage" in hPanel
2. Find adsbox.biz and click "Manage"
3. Click "Subdomains"
4. Click "Create Subdomain"
5. Subdomain name: api
6. Document Root: /public_html/api
7. Click "Create"

Result: api.adsbox.biz will point to /public_html/api/

STEP 4: ENABLE SSL CERTIFICATES 🔒
==================================
1. Go to "Security" → "SSL/TLS" in hPanel
2. For adsbox.biz: Enable "Free SSL Certificate"
3. For api.adsbox.biz: Enable "Free SSL Certificate"
4. Wait 10-15 minutes for SSL activation

STEP 5: CHECK NODE.JS SUPPORT ⚡
===============================
Node.js might not be available on all Hostinger plans. Let's check:

OPTION A: Look for Node.js in hPanel
1. Check "Advanced" section in left sidebar
2. Look for "Node.js" or "Node.js Applications"
3. If you see it, click and create application:
   - Node.js version: Latest LTS (18.x or 20.x)
   - Application root: /public_html/api
   - Application URL: api.adsbox.biz
   - Startup file: index.js

OPTION B: If Node.js is NOT available
1. Check your hosting plan features
2. You may need to upgrade to VPS or Cloud hosting
3. OR we can modify our approach to work with PHP/static hosting

OPTION C: Alternative - Static Frontend Only
1. We can deploy just the frontend to adsbox.biz
2. Use external API services (Firebase, Supabase)
3. This will still work for MVP testing

STEP 6: PREPARE FILE MANAGER 📁
===============================
1. Go to "Files" → "File Manager" in hPanel
2. Navigate to /public_html/
3. Create folder: "api" (if not exists)
4. This is where we'll upload the backend files

✅ CHECKLIST BEFORE PROCEEDING:
==============================
□ Database created: livesell_production
□ Database credentials noted down
□ Subdomain created: api.adsbox.biz
□ SSL enabled for both domains
□ Node.js enabled for API subdomain
□ File Manager ready

🚀 NEXT: Upload Files!
======================
Once you complete these steps, we'll upload:
1. Backend files to /public_html/api/
2. Frontend files to /public_html/
3. Configure environment variables
4. Test the deployment!

📞 NEED HELP?
============
If you encounter any issues:
- Hostinger Support: Live chat in hPanel
- Check if your hosting plan supports Node.js
- Some shared plans may need VPS for Node.js

Ready to proceed? Let me know when you've completed steps 1-6!