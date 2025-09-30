import express from 'express'
import { Request, Response } from 'express'
import { UserService } from '@/services/userService'
import { authMiddleware } from '@/middleware/auth'
import { validateRegistration, validateLogin } from '@/middleware/validation'
import logger from '@/utils/logger'

const router = express.Router()

// Register new user/organization - Superior to SystemKH's basic registration!
router.post('/register', validateRegistration, async (req: Request, res: Response) => {
  try {
    const { 
      email, 
      password, 
      firstName, 
      lastName, 
      organizationName,
      phone 
    } = req.body

    // Multi-tenant registration with secure architecture
    const authResponse = await UserService.register({
      email,
      password,
      firstName,
      lastName,
      organizationName,
      phone,
      role: 'owner' // First user becomes organization owner
    })

    // Set secure HTTP-only cookie for refresh token
    res.cookie('refreshToken', authResponse.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    })

    logger.info(`New user registered: ${email}`)

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
    })

  } catch (error: any) {
    logger.error('Registration failed:', error)
    res.status(400).json({
      success: false,
      error: { 
        message: error.message || 'Registration failed',
        code: 'REGISTRATION_ERROR'
      }
    })
  }
})

// Login user - More secure than SystemKH's authentication!
router.post('/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body

    // Input validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: { message: 'Email and password are required' }
      })
    }

    // Secure multi-tenant login
    const authResponse = await UserService.login({ email, password })

    // Set secure HTTP-only cookie for refresh token
    res.cookie('refreshToken', authResponse.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    })

    logger.info(`User logged in: ${email}`)

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
    })

  } catch (error: any) {
    logger.error('Login failed:', error)
    res.status(401).json({
      success: false,
      error: { 
        message: error.message || 'Invalid credentials',
        code: 'AUTHENTICATION_ERROR'
      }
    })
  }
})

// Refresh access token using refresh token
router.post('/refresh', async (req: Request, res: Response) => {
  try {
    const refreshToken = req.cookies.refreshToken

    if (!refreshToken) {
      return res.status(401).json({
        success: false,
        error: { message: 'Refresh token not provided' }
      })
    }

    const tokens = await UserService.refreshToken(refreshToken)

    // Update refresh token cookie
    res.cookie('refreshToken', tokens.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000
    })

    res.json({
      success: true,
      data: {
        accessToken: tokens.accessToken
      }
    })

  } catch (error: any) {
    logger.error('Token refresh failed:', error)
    res.status(401).json({
      success: false,
      error: { message: 'Invalid refresh token' }
    })
  }
})

// Get current user profile
router.get('/me', authMiddleware, async (req: any, res: Response) => {
  try {
    const user = await UserService.getUserById(req.user.id)
    
    if (!user) {
      return res.status(404).json({
        success: false,
        error: { message: 'User not found' }
      })
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
    })
  } catch (error) {
    logger.error('Get profile failed:', error)
    res.status(500).json({
      success: false,
      error: { message: 'Failed to get user profile' }
    })
  }
})

// Logout user
router.post('/logout', authMiddleware, async (req: any, res: Response) => {
  try {
    // Clear refresh token cookie
    res.clearCookie('refreshToken')

    logger.info(`User logged out: ${req.user.email}`)

    res.json({
      success: true,
      message: 'Successfully logged out. Thanks for using LiveSell Pro!'
    })
  } catch (error) {
    logger.error('Logout failed:', error)
    res.status(500).json({
      success: false,
      error: { message: 'Logout failed' }
    })
  }
})

export default router