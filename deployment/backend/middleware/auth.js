"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireRole = exports.authMiddleware = void 0;
const jwt_1 = require("@/utils/jwt");
const userService_1 = require("@/services/userService");
const logger_1 = __importDefault(require("@/utils/logger"));
const authMiddleware = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        const token = authHeader?.replace('Bearer ', '');
        if (!token) {
            return res.status(401).json({
                success: false,
                error: {
                    message: 'Access denied. No token provided.',
                    code: 'NO_TOKEN'
                }
            });
        }
        // Verify JWT token using our secure service
        const decoded = jwt_1.JWTService.verifyAccessToken(token);
        // Fetch current user data from database
        const user = await userService_1.UserService.getUserById(decoded.id);
        if (!user || !user.isActive) {
            return res.status(401).json({
                success: false,
                error: {
                    message: 'Invalid or inactive user.',
                    code: 'INVALID_USER'
                }
            });
        }
        // Add user to request object for use in routes
        req.user = user;
        next();
    }
    catch (error) {
        logger_1.default.warn('Authentication failed:', { error: error.message, ip: req.ip });
        res.status(401).json({
            success: false,
            error: {
                message: 'Invalid or expired token.',
                code: 'INVALID_TOKEN'
            }
        });
    }
};
exports.authMiddleware = authMiddleware;
const requireRole = (roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                error: { message: 'Access denied.' }
            });
        }
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                error: { message: 'Insufficient permissions.' }
            });
        }
        next();
    };
};
exports.requireRole = requireRole;
//# sourceMappingURL=auth.js.map