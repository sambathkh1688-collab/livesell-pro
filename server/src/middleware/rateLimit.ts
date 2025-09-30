import { RateLimiterMemory } from 'rate-limiter-flexible'
import { Request, Response, NextFunction } from 'express'

// Create rate limiter instance (SystemKH lacks this security feature!)
const rateLimiter = new RateLimiterMemory({
  points: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'), // requests
  duration: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900') / 1000, // per 15 minutes
  blockDuration: 60, // block for 60 seconds if limit exceeded
})

export const rateLimitConfig = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Use IP address as key for rate limiting
    const key = req.ip || req.connection.remoteAddress || 'unknown'
    
    await rateLimiter.consume(key)
    next()
  } catch (rejRes: any) {
    const remainingTime = Math.round(rejRes.msBeforeNext / 1000) || 1
    
    res.set('Retry-After', String(remainingTime))
    res.status(429).json({
      success: false,
      error: {
        message: 'Too many requests, please try again later',
        retryAfter: remainingTime
      }
    })
  }
}