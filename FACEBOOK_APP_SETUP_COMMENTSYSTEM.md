# Facebook App Configuration Guide
## App: "commentsystem" (ID: 835145810930761)

## 🔧 REQUIRED CONFIGURATION STEPS

### Step 1: Basic App Settings (CRITICAL)
Navigate to: **App Settings > Basic**

#### ✅ Required Fields:
1. **App Domains**: Add the following domains (one per line):
   ```
   localhost
   commentsystem.online
   ```

2. **Privacy Policy URL**: 
   ```
   https://commentsystem.online/privacy-policy.html
   ```
   ⚠️ **IMPORTANT**: This URL MUST be accessible and contain a valid privacy policy

3. **Terms of Service URL**:
   ```
   https://commentsystem.online/terms.php
   ```
   ⚠️ **IMPORTANT**: This URL MUST be accessible and contain valid terms

4. **Category**: Keep as "Business and pages" ✅

### Step 2: Valid OAuth Redirect URIs (ESSENTIAL)
In the **Valid OAuth Redirect URIs** section, add:

```
http://localhost:3000/facebook/connect-success
https://localhost:3000/facebook/connect-success
http://localhost:5001/auth/facebook/callback
https://commentsystem.online/facebook/callback
https://commentsystem.online/facebook/connect-success
```

### Step 3: Facebook Login Configuration
Navigate to: **Facebook Login > Settings**

#### ✅ Configure:
1. **Valid OAuth Redirect URIs**: (Same as above)
2. **Deauthorize Callback URL**:
   ```
   https://commentsystem.online/facebook/deauthorize
   ```
3. **Data Deletion Request URL**:
   ```
   https://commentsystem.online/data_deletion.php
   ```

### Step 4: App Review & Permissions
Navigate to: **App Review > Permissions and Features**

#### ✅ Required Permissions (Request for Review):
1. **pages_show_list** - To get user's Facebook pages
2. **pages_read_engagement** - To read page engagement data
3. **pages_manage_posts** - To manage posts and comments
4. **public_profile** - Basic user information
5. **email** - User email address

### Step 5: Webhooks Configuration
Navigate to: **Webhooks**

#### ✅ Configure Page Webhooks:
1. **Callback URL**:
   ```
   https://your-ngrok-url.ngrok.io/api/facebook/webhook
   ```
2. **Verify Token**:
   ```
   LiveCommerce2024_SecureToken
   ```
3. **Subscription Fields**:
   - ✅ feed
   - ✅ comments
   - ✅ live_videos
   - ✅ posts

### Step 6: Business Verification (IMPORTANT)
Navigate to: **App Settings > Basic > Business Verification**

⚠️ **Note**: Business verification may be required for advanced permissions

## 🚀 IMMEDIATE ACTIONS REQUIRED

### Action 1: Create Required URLs
You need to create these pages on commentsystem.online:

1. **Privacy Policy** (`/privacy-policy.html`)
2. **Terms of Service** (`/terms.php`) 
3. **Data Deletion** (`/data_deletion.php`)
4. **Deauthorize Callback** (`/facebook/deauthorize`)

### Action 2: Domain Verification
1. Add domain ownership verification files
2. Verify commentsystem.online domain in Facebook

### Action 3: Test Configuration
1. Save all settings
2. Test OAuth flow with new configuration
3. Verify webhooks are receiving data

## 🔍 CURRENT STATUS CHECK

Based on your screenshot, you still need to:
- ✅ App ID: 835145810930761 (Set)
- ✅ App Secret: fzf08facda4db47b3cc46bd8bd58c01 (Set)
- ✅ Display Name: commentsystem (Set)
- ✅ Contact Email: domisovandara@gmail.com (Set)
- ❌ **App Domains**: Need to add localhost + commentsystem.online
- ❌ **Valid OAuth Redirect URIs**: Not configured yet
- ✅ Privacy Policy URL: https://commentsystem.online/privacy-policy.html
- ✅ Terms URL: https://commentsystem.online/terms.php

## 🎯 NEXT STEPS

1. **Fill App Domains field** with `localhost` and `commentsystem.online`
2. **Scroll down** to find "Valid OAuth Redirect URIs" section
3. **Add the OAuth URLs** listed above
4. **Save Changes**
5. **Test the OAuth flow**

## ⚠️ TROUBLESHOOTING

If you can't save:
- Ensure Privacy Policy URL is accessible
- Ensure Terms of Service URL is accessible  
- Make sure all required fields are filled
- Try refreshing the page and saving again

---

**Ready to configure? Start with adding the App Domains, then add the OAuth redirect URIs!** 🚀