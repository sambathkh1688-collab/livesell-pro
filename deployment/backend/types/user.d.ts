export interface User {
    id: string;
    organizationId: string;
    email: string;
    firstName: string;
    lastName: string;
    role: 'owner' | 'admin' | 'manager' | 'user';
    phone?: string;
    avatarUrl?: string;
    isActive: boolean;
    emailVerified: boolean;
    emailVerifiedAt?: Date;
    lastLoginAt?: Date;
    preferences: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
}
export interface CreateUserData {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    organizationName?: string;
    phone?: string;
    role?: 'owner' | 'admin' | 'manager' | 'user';
}
export interface LoginCredentials {
    email: string;
    password: string;
}
export interface AuthResponse {
    user: Omit<User, 'password'>;
    organization: Organization;
    accessToken: string;
    refreshToken: string;
}
export interface Organization {
    id: string;
    name: string;
    slug: string;
    domain?: string;
    plan: 'free' | 'starter' | 'professional' | 'enterprise';
    settings: Record<string, any>;
    isActive: boolean;
    trialEndsAt?: Date;
    createdAt: Date;
    updatedAt: Date;
}
export interface FacebookPage {
    id: string;
    organizationId: string;
    userId: string;
    facebookPageId: string;
    pageName: string;
    accessToken: string;
    pageUrl?: string;
    profilePictureUrl?: string;
    isActive: boolean;
    liveMonitoringEnabled: boolean;
    settings: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
}
//# sourceMappingURL=user.d.ts.map