"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JWTService = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
class JWTService {
    /**
     * Generate access token (short-lived for security)
     */
    static generateAccessToken(user) {
        const payload = {
            id: user.id,
            email: user.email,
            organizationId: user.organizationId,
            role: user.role,
            type: 'access'
        };
        const options = {
            expiresIn: String(this.accessTokenExpiry),
            issuer: 'livesell-pro',
            audience: 'livesell-pro-client'
        };
        return jsonwebtoken_1.default.sign(payload, this.accessTokenSecret, options);
    }
    /**
     * Generate refresh token (longer-lived)
     */
    static generateRefreshToken(user) {
        const payload = {
            id: user.id,
            email: user.email,
            organizationId: user.organizationId,
            role: user.role,
            type: 'refresh'
        };
        const options = {
            expiresIn: String(this.refreshTokenExpiry),
            issuer: 'livesell-pro',
            audience: 'livesell-pro-client'
        };
        return jsonwebtoken_1.default.sign(payload, this.refreshTokenSecret, options);
    }
    /**
     * Verify access token
     */
    static verifyAccessToken(token) {
        try {
            const decoded = jsonwebtoken_1.default.verify(token, this.accessTokenSecret, {
                issuer: 'livesell-pro',
                audience: 'livesell-pro-client'
            });
            if (decoded.type !== 'access') {
                throw new Error('Invalid token type');
            }
            return decoded;
        }
        catch (error) {
            throw new Error('Invalid or expired access token');
        }
    }
    /**
     * Verify refresh token
     */
    static verifyRefreshToken(token) {
        try {
            const decoded = jsonwebtoken_1.default.verify(token, this.refreshTokenSecret, {
                issuer: 'livesell-pro',
                audience: 'livesell-pro-client'
            });
            if (decoded.type !== 'refresh') {
                throw new Error('Invalid token type');
            }
            return decoded;
        }
        catch (error) {
            throw new Error('Invalid or expired refresh token');
        }
    }
    /**
     * Generate token pair (access + refresh)
     */
    static generateTokenPair(user) {
        return {
            accessToken: this.generateAccessToken(user),
            refreshToken: this.generateRefreshToken(user)
        };
    }
}
exports.JWTService = JWTService;
JWTService.accessTokenSecret = process.env.JWT_SECRET ?? 'your-secret-key';
JWTService.refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET ?? 'your-refresh-secret';
JWTService.accessTokenExpiry = process.env.JWT_EXPIRE || '15m';
JWTService.refreshTokenExpiry = process.env.REFRESH_TOKEN_EXPIRE || '7d';
//# sourceMappingURL=jwt.js.map