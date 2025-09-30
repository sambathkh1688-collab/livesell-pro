import bcrypt from 'bcryptjs'
import { v4 as uuidv4 } from 'uuid'
import db from '@/utils/database'
import { JWTService } from '@/utils/jwt'
import { User, Organization, CreateUserData, LoginCredentials, AuthResponse } from '@/types/user'
import logger from '@/utils/logger'

export class UserService {
  /**
   * Create organization slug from name
   */
  private static createSlug(name: string): string {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim()
  }

  /**
   * Hash password securely
   */
  private static async hashPassword(password: string): Promise<string> {
    const saltRounds = 12 // High security (SystemKH probably uses basic hashing!)
    return bcrypt.hash(password, saltRounds)
  }

  /**
   * Verify password
   */
  private static async verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword)
  }

  /**
   * Register new user with organization (Multi-tenant setup)
   */
  static async register(userData: CreateUserData): Promise<AuthResponse> {
    try {
      // Start transaction for data integrity
      return await db.transaction(async (trx) => {
        // Check if user already exists
        const existingUser = await trx('users')
          .where('email', userData.email)
          .first()

        if (existingUser) {
          throw new Error('User with this email already exists')
        }

        // Create organization first (multi-tenant architecture)
        const organizationName = userData.organizationName || `${userData.firstName}'s Organization`
        const organizationSlug = this.createSlug(organizationName)
        
        // Check slug uniqueness
        let finalSlug = organizationSlug
        let counter = 1
        while (await trx('organizations').where('slug', finalSlug).first()) {
          finalSlug = `${organizationSlug}-${counter}`
          counter++
        }

        const organizationId = uuidv4()
        const [organization] = await trx('organizations')
          .insert({
            id: organizationId,
            name: organizationName,
            slug: finalSlug,
            plan: 'free', // Start with free plan (competitive advantage!)
            settings: JSON.stringify({
              timezone: 'UTC',
              currency: 'USD',
              language: 'en',
              notifications: {
                email: true,
                browser: true,
                mobile: true
              }
            }),
            is_active: true,
            created_at: new Date(),
            updated_at: new Date()
          })
          .returning('*')

        // Hash password
        const hashedPassword = await this.hashPassword(userData.password)

        // Create user
        const userId = uuidv4()
        const [user] = await trx('users')
          .insert({
            id: userId,
            organization_id: organizationId,
            email: userData.email,
            password: hashedPassword,
            first_name: userData.firstName,
            last_name: userData.lastName,
            role: userData.role || 'owner', // First user is owner
            phone: userData.phone,
            is_active: true,
            email_verified: false, // Will implement email verification
            preferences: JSON.stringify({
              dashboard_layout: 'default',
              theme: 'light',
              notifications: {
                orders: true,
                comments: true,
                analytics: true
              }
            }),
            created_at: new Date(),
            updated_at: new Date()
          })
          .returning('*')

        // Generate JWT tokens
        const { accessToken, refreshToken } = JWTService.generateTokenPair(user)

        logger.info(`New user registered: ${userData.email} with organization: ${organizationName}`)

        return {
          user: {
            id: user.id,
            organizationId: user.organization_id,
            email: user.email,
            firstName: user.first_name,
            lastName: user.last_name,
            role: user.role,
            phone: user.phone,
            avatarUrl: user.avatar_url,
            isActive: user.is_active,
            emailVerified: user.email_verified,
            emailVerifiedAt: user.email_verified_at,
            lastLoginAt: user.last_login_at,
            preferences: JSON.parse(user.preferences || '{}'),
            createdAt: user.created_at,
            updatedAt: user.updated_at
          },
          organization: {
            id: organization.id,
            name: organization.name,
            slug: organization.slug,
            domain: organization.domain,
            plan: organization.plan,
            settings: JSON.parse(organization.settings || '{}'),
            isActive: organization.is_active,
            trialEndsAt: organization.trial_ends_at,
            createdAt: organization.created_at,
            updatedAt: organization.updated_at
          },
          accessToken,
          refreshToken
        }
      })

    } catch (error) {
      logger.error('Registration failed:', error)
      throw error
    }
  }

  /**
   * Login user
   */
  static async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      // Find user with organization data
      const userWithOrg = await db('users')
        .select(
          'users.*',
          'organizations.name as org_name',
          'organizations.slug as org_slug',
          'organizations.domain as org_domain',
          'organizations.plan as org_plan',
          'organizations.settings as org_settings',
          'organizations.is_active as org_is_active',
          'organizations.trial_ends_at as org_trial_ends_at',
          'organizations.created_at as org_created_at',
          'organizations.updated_at as org_updated_at'
        )
        .leftJoin('organizations', 'users.organization_id', 'organizations.id')
        .where('users.email', credentials.email)
        .first()

      if (!userWithOrg) {
        throw new Error('Invalid email or password')
      }

      // Verify password
      const isValidPassword = await this.verifyPassword(credentials.password, userWithOrg.password)
      if (!isValidPassword) {
        throw new Error('Invalid email or password')
      }

      // Check if user is active
      if (!userWithOrg.is_active) {
        throw new Error('Account has been deactivated')
      }

      // Update last login
      await db('users')
        .where('id', userWithOrg.id)
        .update({
          last_login_at: new Date(),
          updated_at: new Date()
        })

      // Generate tokens
      const { accessToken, refreshToken } = JWTService.generateTokenPair(userWithOrg)

      logger.info(`User logged in: ${credentials.email}`)

      return {
        user: {
          id: userWithOrg.id,
          organizationId: userWithOrg.organization_id,
          email: userWithOrg.email,
          firstName: userWithOrg.first_name,
          lastName: userWithOrg.last_name,
          role: userWithOrg.role,
          phone: userWithOrg.phone,
          avatarUrl: userWithOrg.avatar_url,
          isActive: userWithOrg.is_active,
          emailVerified: userWithOrg.email_verified,
          emailVerifiedAt: userWithOrg.email_verified_at,
          lastLoginAt: new Date(),
          preferences: JSON.parse(userWithOrg.preferences || '{}'),
          createdAt: userWithOrg.created_at,
          updatedAt: userWithOrg.updated_at
        },
        organization: {
          id: userWithOrg.organization_id,
          name: userWithOrg.org_name,
          slug: userWithOrg.org_slug,
          domain: userWithOrg.org_domain,
          plan: userWithOrg.org_plan,
          settings: JSON.parse(userWithOrg.org_settings || '{}'),
          isActive: userWithOrg.org_is_active,
          trialEndsAt: userWithOrg.org_trial_ends_at,
          createdAt: userWithOrg.org_created_at,
          updatedAt: userWithOrg.org_updated_at
        },
        accessToken,
        refreshToken
      }

    } catch (error) {
      logger.error('Login failed:', error)
      throw error
    }
  }

  /**
   * Get user by ID with organization data
   */
  static async getUserById(userId: string): Promise<User | null> {
    try {
      const user = await db('users')
        .where('id', userId)
        .first()

      if (!user) return null

      return {
        id: user.id,
        organizationId: user.organization_id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        role: user.role,
        phone: user.phone,
        avatarUrl: user.avatar_url,
        isActive: user.is_active,
        emailVerified: user.email_verified,
        emailVerifiedAt: user.email_verified_at,
        lastLoginAt: user.last_login_at,
        preferences: JSON.parse(user.preferences || '{}'),
        createdAt: user.created_at,
        updatedAt: user.updated_at
      }

    } catch (error) {
      logger.error('Get user failed:', error)
      return null
    }
  }

  /**
   * Refresh access token using refresh token
   */
  static async refreshToken(refreshToken: string): Promise<{ accessToken: string; refreshToken: string }> {
    try {
      // Verify refresh token
      const payload = JWTService.verifyRefreshToken(refreshToken)
      
      // Get user data
      const user = await this.getUserById(payload.id)
      if (!user || !user.isActive) {
        throw new Error('Invalid user')
      }

      // Generate new token pair
      return JWTService.generateTokenPair(user)

    } catch (error) {
      logger.error('Token refresh failed:', error)
      throw new Error('Invalid refresh token')
    }
  }
}