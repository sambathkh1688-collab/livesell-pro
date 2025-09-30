import { FacebookPage, LiveStream, Comment } from '@/types/facebook';
export declare class FacebookService {
    /**
     * Add Facebook page to organization
     */
    static addFacebookPage(organizationId: string, userId: string, pageData: {
        facebookPageId: string;
        pageName: string;
        accessToken: string;
        pageUrl?: string;
        profilePictureUrl?: string;
    }): Promise<FacebookPage>;
    /**
     * Get organization's Facebook pages
     */
    static getOrganizationPages(organizationId: string): Promise<FacebookPage[]>;
    /**
     * Start monitoring live videos for a page
     * This is our killer feature - REAL-TIME monitoring!
     */
    static startLiveMonitoring(pageId: string): Promise<void>;
    /**
     * Process a live video and monitor its comments
     */
    static processLiveVideo(pageId: string, videoData: any): Promise<LiveStream | null>;
    /**
     * Monitor comments for a live stream
     * Real-time comment processing (SystemKH's weakness!)
     */
    static startCommentMonitoring(streamId: string, facebookLiveId: string): Promise<void>;
    /**
     * Process individual comment
     */
    static processComment(streamId: string, commentData: any): Promise<Comment | null>;
    /**
     * AI-powered order detection (SystemKH doesn't have this!)
     */
    private static detectOrderInComment;
    /**
     * Basic sentiment analysis
     */
    private static analyzeSentiment;
    /**
     * Extract keywords from comment
     */
    private static extractKeywords;
    /**
     * Handle Facebook webhook
     */
    static handleWebhook(webhookData: any): Promise<void>;
    /**
     * Handle live video changes from webhook
     */
    private static handleLiveVideoChange;
    /**
     * Handle comment changes from webhook
     */
    private static handleCommentChange;
}
//# sourceMappingURL=facebookService.d.ts.map