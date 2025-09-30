# Facebook App Localhost Configuration Guide
## For App: "commentsystem" (ID: 835145810930761)

## 🎯 **REQUIRED FACEBOOK APP SETTINGS**

### 📍 **Step 1: Basic Settings**
Go to your Facebook App → **Settings** → **Basic**

#### ✅ **App Domains** (CRITICAL):
```
localhost
```
*Enter exactly: `localhost` (without http://)*

#### ✅ **Valid OAuth Redirect URIs** (ESSENTIAL):
```
http://localhost:3000/facebook/connect-success
http://localhost:5001/auth/facebook/callback  
http://localhost:3000/auth/facebook/callback
```
*Add each URL on a separate line*

#### ✅ **Privacy Policy URL**: 
Keep your existing: `https://commentsystem.online/privacy-policy.html`
*Make sure this URL works and shows a privacy policy*

#### ✅ **Terms of Service URL**:
Keep your existing: `https://commentsystem.online/terms.php`
*Make sure this URL works and shows terms of service*

### 📍 **Step 2: Save Changes**
Click **"Save Changes"** at the bottom of the page

## 🚀 **CURRENT APP CONFIGURATION**

Your app credentials (already updated in our code):
- ✅ **App ID**: 835145810930761
- ✅ **App Secret**: fzf08facda4db47b3cc46bd8bd58c01
- ✅ **Display Name**: commentsystem
- ✅ **Contact Email**: domisovandara@gmail.com

## 🧪 **TESTING CHECKLIST**

After saving Facebook App settings:

1. **Test OAuth Flow**: 
   - Go to `http://localhost:3000/facebook`
   - Click "Connect Facebook" button
   - Should redirect to Facebook login (no "URL Blocked" error)

2. **Test API Connection**:
   - Backend server should be running on port 5000
   - Frontend should be running on port 3000

3. **Verify Redirect**:
   - After Facebook login, should return to `http://localhost:3000/facebook/connect-success`
   - Should show success message and redirect to dashboard

## ⚠️ **TROUBLESHOOTING**

If you still get "URL Blocked":
- Double-check App Domains contains exactly: `localhost`
- Verify OAuth URLs are added correctly (copy-paste from above)
- Wait 5-10 minutes after saving for changes to take effect
- Clear browser cache and try again

If Privacy Policy URL error:
- Make sure `https://commentsystem.online/privacy-policy.html` is accessible
- Or temporarily use `https://example.com/privacy` for testing

## 🎯 **NEXT STEPS**

1. **Configure Facebook App** (follow steps above)
2. **Save changes** 
3. **Test OAuth flow** at `http://localhost:3000/facebook`
4. **Report any errors** you encounter

---

**Ready to test? After saving Facebook App settings, visit `http://localhost:3000/facebook` and try connecting!** 🚀