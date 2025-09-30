# Facebook App OAuth Configuration Fix

## 🚨 Issue: "URL Blocked" Error
Facebook is blocking the OAuth redirect because `http://localhost:5001/auth/facebook/callback` is not whitelisted in your Facebook App settings.

## ✅ Solution: Add Valid OAuth Redirect URIs

### Step 1: Access Facebook App Settings
1. Go to [Facebook Developers](https://developers.facebook.com/)
2. Navigate to your app "Comment" (ID: 1682481498841723)
3. Go to **App Settings** > **Basic**

### Step 2: Configure Valid OAuth Redirect URIs
In the **Valid OAuth Redirect URIs** field, add these URLs:

```
http://localhost:3000/auth/facebook/callback
http://localhost:5000/auth/facebook/callback
http://localhost:5001/auth/facebook/callback
https://localhost:3000/auth/facebook/callback
https://localhost:5000/auth/facebook/callback
https://localhost:5001/auth/facebook/callback
```

### Step 3: Save Changes
- Click **Save Changes** at the bottom of the page
- Wait 5-10 minutes for changes to propagate

### Step 4: Alternative - Use Main App OAuth
Instead of the test server, use the main application OAuth at:
- **Main App**: `http://localhost:3000/facebook`
- **Production OAuth**: Already configured in main application

## 🔧 Quick Fix Options

### Option 1: Test with Main App (Recommended)
Visit `http://localhost:3000/facebook` - This should work immediately as it uses the properly configured OAuth flow.

### Option 2: Update Facebook App Settings
Follow steps above to add localhost URLs to Facebook App settings.

### Option 3: Use Production Domain
If you have a production domain, add it to Facebook App settings instead.

## ⚠️ Important Notes

1. **Facebook App Review**: For production, you'll need Facebook App Review for advanced permissions
2. **HTTPS Required**: Production must use HTTPS URLs
3. **Domain Verification**: Production domains must be verified in Facebook App settings
4. **Localhost Limitations**: Facebook may restrict localhost in some regions

## 🎯 Recommended Testing Flow

1. **Immediate Test**: Use `http://localhost:3000/facebook` (main app)
2. **Configure App**: Add localhost URLs to Facebook App settings
3. **Production**: Use verified HTTPS domain for production deployment

The main application at port 3000 should work immediately since it uses the standard OAuth configuration!