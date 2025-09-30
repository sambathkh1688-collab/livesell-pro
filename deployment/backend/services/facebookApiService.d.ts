import { FacebookApiResponse } from '@/types/facebook';
export declare class FacebookApiService {
    private static readonly BASE_URL;
    private static readonly APP_ID;
    private static readonly APP_SECRET;
    private static checkEnvironment;
    /**
     * Get app access token for Facebook API calls
     */
    private static getAppAccessToken;
    /**
     * Verify webhook signature from Facebook
     */
    static verifyWebhookSignature(payload: string, signature: string): boolean;
    /**
     * Exchange authorization code for access token
     */
    static exchangeCodeForToken(code: string, redirectUri: string): Promise<{
        access_token: string;
        token_type: string;
    }>;
    /**
     * Get user's Facebook pages (during setup)
     */
    static getUserPages(userAccessToken: string): Promise<FacebookApiResponse>;
    /**
     * Get long-lived page access token
     */
    static getLongLivedPageToken(shortLivedToken: string): Promise<string>;
    /**
     * Get live videos from a Facebook page
     */
    static getPageLiveVideos(pageId: string, accessToken: string): Promise<FacebookApiResponse>;
    /**
     * Get comments from a live video
     * This is where we beat SystemKH - REAL-TIME comment fetching!
     */
    static getLiveVideoComments(videoId: string, accessToken: string, since?: string): Promise<FacebookApiResponse>;
    /**
     * Reply to a comment (AI-powered feature SystemKH doesn't have!)
     */
    static replyToComment(commentId: string, message: string, accessToken: string): Promise<FacebookApiResponse>;
    /**
     * Subscribe to page webhooks for real-time updates
     */
    static subscribeToPageWebhooks(pageId: string, accessToken: string): Promise<boolean>;
    /**
     * Get page insights (better analytics than SystemKH!)
     */
    static getPageInsights(pageId: string, accessToken: string, metrics?: string[]): Promise<FacebookApiResponse>;
    /**
     * Validate page access token
     */
    static validatePageToken(accessToken: string): Promise<boolean>;
    /**
     * Get live video statistics
     */
    static getLiveVideoStats(videoId: string, accessToken: string): Promise<FacebookApiResponse>;
}
//# sourceMappingURL=facebookApiService.d.ts.map