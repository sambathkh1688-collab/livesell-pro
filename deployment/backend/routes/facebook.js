"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const facebookService_1 = require("@/services/facebookService");
const facebookApiService_1 = require("@/services/facebookApiService");
const facebookErrorHandler_1 = require("@/services/facebookErrorHandler");
const auth_1 = require("@/middleware/auth");
const logger_1 = __importDefault(require("@/utils/logger"));
const database_1 = __importStar(require("@/utils/database"));
const router = express_1.default.Router();
// Get Facebook login URL
router.get('/auth-url', auth_1.authMiddleware, (req, res) => {
    const redirectUri = encodeURIComponent(`${process.env.CLIENT_URL}/facebook/callback`);
    const scope = 'pages_manage_posts,pages_read_engagement,pages_show_list,publish_video';
    const facebookAuthUrl = `https://www.facebook.com/v18.0/dialog/oauth?` +
        `client_id=${process.env.FACEBOOK_APP_ID}&` +
        `redirect_uri=${redirectUri}&` +
        `scope=${scope}&` +
        `response_type=code&` +
        `state=${req.user?.id}`; // Pass user ID in state for security
    res.json({
        success: true,
        data: {
            authUrl: facebookAuthUrl,
            message: '🚀 Connect your Facebook page to start crushing SystemKH!'
        }
    });
});
// Exchange OAuth code for access token (no auth required for OAuth callback)
router.post('/oauth/exchange', async (req, res) => {
    try {
        const { code, redirectUri, state } = req.body;
        if (!code) {
            return res.status(400).json({
                success: false,
                error: 'Authorization code is required'
            });
        }
        console.log('🔄 Exchanging Facebook OAuth code for access token...');
        // Exchange code for user access token
        const tokenData = await facebookApiService_1.FacebookApiService.exchangeCodeForToken(code, redirectUri || 'http://localhost:3000/facebook/connect-success');
        if (!tokenData.access_token) {
            throw new Error('Failed to obtain access token from Facebook');
        }
        console.log('✅ Access token obtained successfully');
        // Get user information
        const userResponse = await fetch(`https://graph.facebook.com/v18.0/me?fields=id,name,email&access_token=${tokenData.access_token}`);
        const userData = await userResponse.json();
        if (userData.error) {
            throw new Error(`Facebook API error: ${userData.error.message}`);
        }
        console.log(`👤 User authenticated: ${userData.name}`);
        // Get user's Facebook pages
        const pagesResponse = await fetch(`https://graph.facebook.com/v18.0/me/accounts?fields=id,name,category,access_token&access_token=${tokenData.access_token}`);
        const pagesData = await pagesResponse.json();
        if (pagesData.error) {
            throw new Error(`Facebook Pages API error: ${pagesData.error.message}`);
        }
        const pages = pagesData.data || [];
        console.log(`📱 Found ${pages.length} Facebook pages`);
        // Return success with all data
        res.json({
            success: true,
            accessToken: tokenData.access_token,
            user: {
                id: userData.id,
                name: userData.name,
                email: userData.email
            },
            pages: pages.map((page) => ({
                id: page.id,
                name: page.name,
                category: page.category,
                accessToken: page.access_token
            }))
        });
    }
    catch (error) {
        console.error('❌ OAuth exchange error:', error);
        const errorResponse = facebookErrorHandler_1.FacebookErrorHandler.handleApiError(error);
        res.status(400).json({
            success: false,
            error: errorResponse.message || error.message,
            details: errorResponse.details || 'OAuth exchange failed'
        });
    }
});
// Handle Facebook OAuth callback
router.post('/callback', auth_1.authMiddleware, async (req, res) => {
    try {
        const { code, selectedPageId } = req.body;
        if (!code) {
            return res.status(400).json({
                success: false,
                error: { message: 'Authorization code is required' }
            });
        }
        // Exchange code for user access token
        const redirectUri = `${process.env.CLIENT_URL}/facebook/callback`;
        const tokenResponse = await facebookApiService_1.FacebookApiService.exchangeCodeForToken(code, redirectUri);
        // Get user's pages
        const pagesResponse = await facebookApiService_1.FacebookApiService.getUserPages(tokenResponse.access_token);
        // Store the user's Facebook connection in database
        const integrationId = database_1.Database.generateUUID();
        const organizationId = req.user.organizationId || 'default-org';
        await (0, database_1.default)('facebook_integrations').insert({
            id: integrationId,
            user_id: req.user.id,
            organization_id: organizationId,
            access_token: tokenResponse.access_token,
            token_type: tokenResponse.token_type,
            connected_at: new Date(),
            is_active: true
        }).onConflict(['user_id', 'organization_id']).merge({
            access_token: tokenResponse.access_token,
            token_type: tokenResponse.token_type,
            connected_at: new Date(),
            is_active: true
        });
        // If a specific page was selected, store it
        if (selectedPageId && pagesResponse.data) {
            const selectedPage = pagesResponse.data.find((page) => page.id === selectedPageId);
            if (selectedPage) {
                const pageId = database_1.Database.generateUUID();
                await (0, database_1.default)('facebook_pages').insert({
                    id: pageId,
                    user_id: req.user.id,
                    organization_id: organizationId,
                    facebook_page_id: selectedPage.id,
                    page_name: selectedPage.name,
                    access_token: selectedPage.access_token,
                    page_url: selectedPage.link,
                    profile_picture_url: selectedPage.picture?.data?.url,
                    category: selectedPage.category,
                    page_data: JSON.stringify(selectedPage),
                    is_active: true,
                    created_at: new Date(),
                    updated_at: new Date()
                });
            }
        }
        res.json({
            success: true,
            message: '🎯 Facebook integration successful! SystemKH can\'t compete with this!',
            data: {
                connected: true,
                pages: pagesResponse.data,
                features: [
                    'Real-time comment monitoring',
                    'AI-powered order detection',
                    'Multi-page support',
                    'Instant notifications'
                ]
            }
        });
    }
    catch (error) {
        const facebookError = facebookErrorHandler_1.FacebookErrorHandler.handleAuthError(error);
        res.status(400).json(facebookErrorHandler_1.FacebookErrorHandler.formatApiResponse(facebookError));
    }
});
// Get organization's Facebook pages
router.get('/pages', auth_1.authMiddleware, async (req, res) => {
    try {
        const pages = await facebookService_1.FacebookService.getOrganizationPages(req.user.organizationId);
        res.json({
            success: true,
            data: {
                pages,
                totalPages: pages.length,
                activePages: pages.filter(p => p.isActive).length,
                competitiveAdvantage: 'SystemKH limits pages - we support unlimited!'
            }
        });
    }
    catch (error) {
        const facebookError = facebookErrorHandler_1.FacebookErrorHandler.handleApiError(error);
        res.status(500).json(facebookErrorHandler_1.FacebookErrorHandler.formatApiResponse(facebookError));
    }
});
// Add Facebook page to organization
router.post('/pages', auth_1.authMiddleware, async (req, res) => {
    try {
        const { facebookPageId, pageName, accessToken, pageUrl, profilePictureUrl } = req.body;
        if (!facebookPageId || !pageName || !accessToken) {
            return res.status(400).json({
                success: false,
                error: { message: 'Facebook page ID, name, and access token are required' }
            });
        }
        const page = await facebookService_1.FacebookService.addFacebookPage(req.user.organizationId, req.user.id, {
            facebookPageId,
            pageName,
            accessToken,
            pageUrl,
            profilePictureUrl
        });
        res.status(201).json({
            success: true,
            message: '🚀 Facebook page connected! Real-time monitoring activated!',
            data: {
                page,
                features: [
                    'Live comment monitoring started',
                    'AI order detection enabled',
                    'Real-time notifications active',
                    'Advanced analytics ready'
                ]
            }
        });
    }
    catch (error) {
        logger_1.default.error('Add page failed:', error);
        res.status(400).json({
            success: false,
            error: { message: error.message || 'Failed to add Facebook page' }
        });
    }
});
// Get live streams for a page
router.get('/pages/:pageId/streams', auth_1.authMiddleware, async (req, res) => {
    try {
        const { pageId } = req.params;
        // Get live streams from database
        const streams = await (0, database_1.default)('live_streams')
            .where('facebook_page_id', pageId)
            .orderBy('created_at', 'desc')
            .limit(20);
        res.json({
            success: true,
            data: {
                streams: streams.map(stream => ({
                    id: stream.id,
                    title: stream.title,
                    status: stream.status,
                    viewerCount: stream.viewer_count,
                    totalComments: stream.total_comments,
                    totalOrders: stream.total_orders,
                    totalRevenue: parseFloat(stream.total_revenue || '0'),
                    startedAt: stream.started_at,
                    endedAt: stream.ended_at
                })),
                realTimeFeature: 'Live updates via WebSocket - SystemKH doesn\'t have this!'
            }
        });
    }
    catch (error) {
        logger_1.default.error('Get streams failed:', error);
        res.status(500).json({
            success: false,
            error: { message: 'Failed to fetch live streams' }
        });
    }
});
// Get comments for a live stream
router.get('/streams/:streamId/comments', auth_1.authMiddleware, async (req, res) => {
    try {
        const { streamId } = req.params;
        const { page = 1, limit = 50 } = req.query;
        const offset = (Number(page) - 1) * Number(limit);
        const comments = await (0, database_1.default)('comments')
            .where('live_stream_id', streamId)
            .orderBy('commented_at', 'desc')
            .limit(Number(limit))
            .offset(offset);
        const totalComments = await (0, database_1.default)('comments')
            .where('live_stream_id', streamId)
            .count('id as count')
            .first();
        res.json({
            success: true,
            data: {
                comments: comments.map(comment => ({
                    id: comment.id,
                    userName: comment.user_name,
                    userAvatarUrl: comment.user_avatar_url,
                    message: comment.message,
                    commentedAt: comment.commented_at,
                    isOrder: comment.is_order,
                    isProcessed: comment.is_processed,
                    hasReply: comment.has_reply,
                    aiAnalysis: JSON.parse(comment.ai_analysis || '{}')
                })),
                pagination: {
                    page: Number(page),
                    limit: Number(limit),
                    total: Number(totalComments?.count || 0),
                    hasMore: offset + Number(limit) < Number(totalComments?.count || 0)
                },
                aiFeature: 'AI-powered order detection - SystemKH doesn\'t have this!'
            }
        });
    }
    catch (error) {
        logger_1.default.error('Get comments failed:', error);
        res.status(500).json({
            success: false,
            error: { message: 'Failed to fetch comments' }
        });
    }
});
// Get all live streams for dashboard
router.get('/live-streams', auth_1.authMiddleware, async (req, res) => {
    try {
        const organizationId = req.user.organizationId || 'default-org';
        // Get active live streams with page information
        const streams = await (0, database_1.default)('live_streams as ls')
            .join('facebook_pages as fp', 'ls.facebook_page_id', 'fp.id')
            .where('fp.organization_id', organizationId)
            .select('ls.id as streamId', 'ls.stream_id', 'ls.title', 'ls.description', 'ls.status', 'ls.viewer_count as viewers', 'ls.started_at', 'ls.ended_at', 'fp.page_name as pageName', 'fp.facebook_page_id')
            .orderBy('ls.created_at', 'desc')
            .limit(50);
        // Get comment counts for each stream
        const streamIds = streams.map(s => s.streamId);
        const commentCounts = await (0, database_1.default)('comments')
            .whereIn('live_stream_id', streamIds)
            .groupBy('live_stream_id')
            .select('live_stream_id')
            .count('* as comment_count');
        // Merge comment counts with streams
        const streamsWithCounts = streams.map(stream => {
            const commentData = commentCounts.find(c => c.live_stream_id === stream.streamId);
            return {
                ...stream,
                comments: commentData ? Number(commentData.comment_count) : 0,
                duration: calculateDuration(stream.started_at, stream.ended_at),
                engagementRate: stream.viewers > 0 ? (((Number(commentData?.comment_count) || 0) / stream.viewers * 100)).toFixed(2) : '0.00'
            };
        });
        // Count active streams
        const activeStreams = streams.filter(s => s.status === 'live').length;
        res.json({
            success: true,
            data: {
                streams: streamsWithCounts,
                activeStreams,
                totalStreams: streams.length,
                message: activeStreams > 0 ?
                    `🔴 ${activeStreams} live streams active - SystemKH can't match this real-time power!` :
                    '📊 Ready to go live - Real-time monitoring prepared!'
            }
        });
    }
    catch (error) {
        logger_1.default.error('Get live streams failed:', error);
        res.status(500).json({
            success: false,
            error: { message: 'Failed to fetch live streams' }
        });
    }
});
// Helper function to calculate duration
function calculateDuration(startTime, endTime) {
    const start = new Date(startTime);
    const end = endTime ? new Date(endTime) : new Date();
    const diffMs = end.getTime() - start.getTime();
    const hours = Math.floor(diffMs / (1000 * 60 * 60));
    const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diffMs % (1000 * 60)) / 1000);
    return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}
// Facebook webhook endpoint
router.get('/webhook', (req, res) => {
    const mode = req.query['hub.mode'];
    const token = req.query['hub.verify_token'];
    const challenge = req.query['hub.challenge'];
    // Verify webhook
    if (mode === 'subscribe' && token === process.env.FACEBOOK_WEBHOOK_VERIFY_TOKEN) {
        logger_1.default.info('Facebook webhook verified successfully');
        res.status(200).send(challenge);
    }
    else {
        logger_1.default.warn('Facebook webhook verification failed');
        res.status(403).send('Forbidden');
    }
});
// Handle Facebook webhook events
router.post('/webhook', async (req, res) => {
    try {
        const signature = req.headers['x-hub-signature-256'];
        const payload = JSON.stringify(req.body);
        // Verify webhook signature
        if (!facebookApiService_1.FacebookApiService.verifyWebhookSignature(payload, signature)) {
            logger_1.default.warn('Invalid webhook signature');
            return res.status(403).send('Forbidden');
        }
        // Process webhook data
        await facebookService_1.FacebookService.handleWebhook(req.body);
        res.status(200).send('OK');
    }
    catch (error) {
        logger_1.default.error('Webhook processing failed:', error);
        res.status(500).send('Internal Server Error');
    }
});
exports.default = router;
//# sourceMappingURL=facebook.js.map