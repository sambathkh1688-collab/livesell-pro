# Facebook Developer App Configuration for adsbox.biz
# LiveSell Pro - Production Settings

## App Basic Settings
App Name: LiveSell Pro
App ID: 1889698918216093
App Domain: adsbox.biz

## App URLs
Website URL: https://adsbox.biz
Privacy Policy URL: https://adsbox.biz/privacy
Terms of Service URL: https://adsbox.biz/terms
User Data Deletion: https://adsbox.biz/data-deletion

## Facebook Login Settings
Valid OAuth Redirect URIs:
- https://adsbox.biz/auth/facebook/callback
- https://adsbox.biz/dashboard
- https://adsbox.biz/login/callback

Deauthorize Callback URL: https://api.adsbox.biz/webhooks/deauth
Data Deletion Request URL: https://api.adsbox.biz/webhooks/deletion

## Webhooks Configuration
Callback URL: https://api.adsbox.biz/webhooks/facebook
Verify Token: livesell-webhook-verify-2025

Subscribed Events:
- live_videos
- live_video_comments
- page_subscriptions

## App Review Permissions Required
Standard Permissions:
- public_profile
- email
- pages_show_list
- pages_read_engagement

Advanced Permissions (Requires Review):
- manage_pages
- publish_pages
- pages_manage_metadata
- Live-Video API access

## Test Users
Create 3-5 test Facebook accounts for testing:
1. Admin user (page owner)
2. Viewer user (commenter)
3. Moderator user (page admin)

## Business Verification
Business Name: [Your Business Name]
Business Website: https://adsbox.biz
Business Address: [Your Business Address]

## Production Checklist
☐ App Domain set to adsbox.biz
☐ All redirect URIs updated to adsbox.biz
☐ Webhook URL pointing to api.adsbox.biz
☐ SSL certificates installed and working
☐ Privacy Policy and Terms pages created
☐ App Review submitted for required permissions
☐ Test users created and working
☐ Live video integration tested
☐ Real-time comments working
☐ OAuth flow tested end-to-end

## Important Notes
1. Facebook App Review can take 1-7 business days
2. Submit app review BEFORE going live with beta users
3. Have privacy policy and terms of service ready
4. Test thoroughly with different Facebook account types
5. Monitor webhook delivery in Facebook Developer Console

## Contact Facebook Support
If issues arise during review:
- Developer Support: https://developers.facebook.com/support/
- Business Support: https://business.facebook.com/help/

🚀 Ready to launch on adsbox.biz!