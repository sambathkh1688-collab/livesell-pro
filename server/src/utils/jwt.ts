import jwt from 'jsonwebtoken'
import { User } from '@/types/user'

export interface JWTPayload {
  id: string
  email: string
  organizationId: string
  role: string
  type: 'access' | 'refresh'
}

export class JWTService {
  private static accessTokenSecret: jwt.Secret = process.env.JWT_SECRET ?? 'your-secret-key';
  private static refreshTokenSecret: jwt.Secret = process.env.REFRESH_TOKEN_SECRET ?? 'your-refresh-secret';
  private static accessTokenExpiry = process.env.JWT_EXPIRE || '15m'
  private static refreshTokenExpiry = process.env.REFRESH_TOKEN_EXPIRE || '7d'

  /**
   * Generate access token (short-lived for security)
   */
  static generateAccessToken(user: User): string {
    const payload: JWTPayload = {
      id: user.id,
      email: user.email,
      organizationId: user.organizationId,
      role: user.role,
      type: 'access'
    }

    const options = {
      expiresIn: String(this.accessTokenExpiry),
      issuer: 'livesell-pro',
      audience: 'livesell-pro-client'
    } as any
    return jwt.sign(payload, this.accessTokenSecret, options)
  }

  /**
   * Generate refresh token (longer-lived)
   */
  static generateRefreshToken(user: User): string {
    const payload: JWTPayload = {
      id: user.id,
      email: user.email,
      organizationId: user.organizationId,
      role: user.role,
      type: 'refresh'
    }

    const options = {
      expiresIn: String(this.refreshTokenExpiry),
      issuer: 'livesell-pro',
      audience: 'livesell-pro-client'
    } as any
    return jwt.sign(payload, this.refreshTokenSecret, options)
  }

  /**
   * Verify access token
   */
  static verifyAccessToken(token: string): JWTPayload {
    try {
      const decoded = jwt.verify(token, this.accessTokenSecret, {
        issuer: 'livesell-pro',
        audience: 'livesell-pro-client'
      }) as JWTPayload

      if (decoded.type !== 'access') {
        throw new Error('Invalid token type')
      }

      return decoded
    } catch (error) {
      throw new Error('Invalid or expired access token')
    }
  }

  /**
   * Verify refresh token
   */
  static verifyRefreshToken(token: string): JWTPayload {
    try {
      const decoded = jwt.verify(token, this.refreshTokenSecret, {
        issuer: 'livesell-pro',
        audience: 'livesell-pro-client'
      }) as JWTPayload

      if (decoded.type !== 'refresh') {
        throw new Error('Invalid token type')
      }

      return decoded
    } catch (error) {
      throw new Error('Invalid or expired refresh token')
    }
  }

  /**
   * Generate token pair (access + refresh)
   */
  static generateTokenPair(user: User): { accessToken: string; refreshToken: string } {
    return {
      accessToken: this.generateAccessToken(user),
      refreshToken: this.generateRefreshToken(user)
    }
  }
}