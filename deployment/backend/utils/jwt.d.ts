import { User } from '@/types/user';
export interface JWTPayload {
    id: string;
    email: string;
    organizationId: string;
    role: string;
    type: 'access' | 'refresh';
}
export declare class JWTService {
    private static accessTokenSecret;
    private static refreshTokenSecret;
    private static accessTokenExpiry;
    private static refreshTokenExpiry;
    /**
     * Generate access token (short-lived for security)
     */
    static generateAccessToken(user: User): string;
    /**
     * Generate refresh token (longer-lived)
     */
    static generateRefreshToken(user: User): string;
    /**
     * Verify access token
     */
    static verifyAccessToken(token: string): JWTPayload;
    /**
     * Verify refresh token
     */
    static verifyRefreshToken(token: string): JWTPayload;
    /**
     * Generate token pair (access + refresh)
     */
    static generateTokenPair(user: User): {
        accessToken: string;
        refreshToken: string;
    };
}
//# sourceMappingURL=jwt.d.ts.map