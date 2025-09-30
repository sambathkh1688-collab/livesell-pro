import { User, CreateUserData, LoginCredentials, AuthResponse } from '@/types/user';
export declare class UserService {
    /**
     * Create organization slug from name
     */
    private static createSlug;
    /**
     * Hash password securely
     */
    private static hashPassword;
    /**
     * Verify password
     */
    private static verifyPassword;
    /**
     * Register new user with organization (Multi-tenant setup)
     */
    static register(userData: CreateUserData): Promise<AuthResponse>;
    /**
     * Login user
     */
    static login(credentials: LoginCredentials): Promise<AuthResponse>;
    /**
     * Get user by ID with organization data
     */
    static getUserById(userId: string): Promise<User | null>;
    /**
     * Refresh access token using refresh token
     */
    static refreshToken(refreshToken: string): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
}
//# sourceMappingURL=userService.d.ts.map