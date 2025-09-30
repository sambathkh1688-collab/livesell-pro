import { Request, Response, NextFunction } from 'express'
import { JWTService } from '@/utils/jwt'
import { UserService } from '@/services/userService'
import { User } from '@/types/user'
import logger from '@/utils/logger'

// Extend Express Request type to include user
declare global {
  namespace Express {
    interface Request {
      user?: User
    }
  }
}

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization
    const token = authHeader?.replace('Bearer ', '')

    if (!token) {
      return res.status(401).json({
        success: false,
        error: { 
          message: 'Access denied. No token provided.',
          code: 'NO_TOKEN'
        }
      })
    }

    // Verify JWT token using our secure service
    const decoded = JWTService.verifyAccessToken(token)
    
    // Fetch current user data from database
    const user = await UserService.getUserById(decoded.id)
    
    if (!user || !user.isActive) {
      return res.status(401).json({
        success: false,
        error: { 
          message: 'Invalid or inactive user.',
          code: 'INVALID_USER'
        }
      })
    }

    // Add user to request object for use in routes
    req.user = user
    next()

  } catch (error: any) {
    logger.warn('Authentication failed:', { error: error.message, ip: req.ip })
    
    res.status(401).json({
      success: false,
      error: { 
        message: 'Invalid or expired token.',
        code: 'INVALID_TOKEN'
      }
    })
  }
}

export const requireRole = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: { message: 'Access denied.' }
      })
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        error: { message: 'Insufficient permissions.' }
      })
    }

    next()
  }
}