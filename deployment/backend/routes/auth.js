"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userService_1 = require("@/services/userService");
const auth_1 = require("@/middleware/auth");
const validation_1 = require("@/middleware/validation");
const logger_1 = __importDefault(require("@/utils/logger"));
const router = express_1.default.Router();
// Register new user/organization - Superior to SystemKH's basic registration!
router.post('/register', validation_1.validateRegistration, async (req, res) => {
    try {
        const { email, password, firstName, lastName, organizationName, phone } = req.body;
        // Multi-tenant registration with secure architecture
        const authResponse = await userService_1.UserService.register({
            email,
            password,
            firstName,
            lastName,
            organizationName,
            phone,
            role: 'owner' // First user becomes organization owner
        });
        // Set secure HTTP-only cookie for refresh token
        res.cookie('refreshToken', authResponse.refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });
        logger_1.default.info(`New user registered: ${email}`);
        res.status(201).json({
            success: true,
            message: '🚀 Welcome to LiveSell Pro! Ready to crush SystemKH?',
            data: {
                user: authResponse.user,
                organization: authResponse.organization,
                accessToken: authResponse.accessToken,
                // Don't send refresh token in response body for security
                features: {
                    multiTenant: true,
                    aiPowered: true,
                    realTimeUpdates: true,
                    betterThanSystemKH: true
                }
            }
        });
    }
    catch (error) {
        logger_1.default.error('Registration failed:', error);
        res.status(400).json({
            success: false,
            error: {
                message: error.message || 'Registration failed',
                code: 'REGISTRATION_ERROR'
            }
        });
    }
});
// Login user - More secure than SystemKH's authentication!
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        // Input validation
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                error: { message: 'Email and password are required' }
            });
        }
        // Secure multi-tenant login
        const authResponse = await userService_1.UserService.login({ email, password });
        // Set secure HTTP-only cookie for refresh token
        res.cookie('refreshToken', authResponse.refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });
        logger_1.default.info(`User logged in: ${email}`);
        res.json({
            success: true,
            message: '🚀 Welcome back! Let\'s dominate the market!',
            data: {
                user: authResponse.user,
                organization: authResponse.organization,
                accessToken: authResponse.accessToken,
                capabilities: {
                    multiPageSupport: true,
                    aiReplies: true,
                    realTimeAnalytics: true,
                    competitiveAdvantage: '34% better pricing than SystemKH'
                }
            }
        });
    }
    catch (error) {
        logger_1.default.error('Login failed:', error);
        res.status(401).json({
            success: false,
            error: {
                message: error.message || 'Invalid credentials',
                code: 'AUTHENTICATION_ERROR'
            }
        });
    }
});
// Refresh access token using refresh token
router.post('/refresh', async (req, res) => {
    try {
        const refreshToken = req.cookies.refreshToken;
        if (!refreshToken) {
            return res.status(401).json({
                success: false,
                error: { message: 'Refresh token not provided' }
            });
        }
        const tokens = await userService_1.UserService.refreshToken(refreshToken);
        // Update refresh token cookie
        res.cookie('refreshToken', tokens.refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000
        });
        res.json({
            success: true,
            data: {
                accessToken: tokens.accessToken
            }
        });
    }
    catch (error) {
        logger_1.default.error('Token refresh failed:', error);
        res.status(401).json({
            success: false,
            error: { message: 'Invalid refresh token' }
        });
    }
});
// Get current user profile
router.get('/me', auth_1.authMiddleware, async (req, res) => {
    try {
        const user = await userService_1.UserService.getUserById(req.user.id);
        if (!user) {
            return res.status(404).json({
                success: false,
                error: { message: 'User not found' }
            });
        }
        res.json({
            success: true,
            data: {
                user,
                systemStatus: {
                    platform: 'LiveSell Pro',
                    version: '1.0.0',
                    advantages: [
                        '34% cheaper than SystemKH',
                        'AI-powered automation',
                        'Real-time WebSocket updates',
                        'Modern technology stack'
                    ]
                }
            }
        });
    }
    catch (error) {
        logger_1.default.error('Get profile failed:', error);
        res.status(500).json({
            success: false,
            error: { message: 'Failed to get user profile' }
        });
    }
});
// Logout user
router.post('/logout', auth_1.authMiddleware, async (req, res) => {
    try {
        // Clear refresh token cookie
        res.clearCookie('refreshToken');
        logger_1.default.info(`User logged out: ${req.user.email}`);
        res.json({
            success: true,
            message: 'Successfully logged out. Thanks for using LiveSell Pro!'
        });
    }
    catch (error) {
        logger_1.default.error('Logout failed:', error);
        res.status(500).json({
            success: false,
            error: { message: 'Logout failed' }
        });
    }
});
exports.default = router;
//# sourceMappingURL=auth.js.map