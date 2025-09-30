import { Request, Response, NextFunction } from 'express'
import Joi from 'joi'
import logger from '@/utils/logger'

// Validation schemas
const registrationSchema = Joi.object({
  email: Joi.string()
    .email()
    .required()
    .messages({
      'string.email': 'Please provide a valid email address',
      'any.required': 'Email is required'
    }),
  password: Joi.string()
    .min(8)
    .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]'))
    .required()
    .messages({
      'string.min': 'Password must be at least 8 characters long',
      'string.pattern.base': 'Password must contain at least one lowercase letter, one uppercase letter, one digit, and one special character',
      'any.required': 'Password is required'
    }),
  firstName: Joi.string()
    .min(2)
    .max(50)
    .required()
    .messages({
      'string.min': 'First name must be at least 2 characters',
      'string.max': 'First name cannot exceed 50 characters',
      'any.required': 'First name is required'
    }),
  lastName: Joi.string()
    .min(2)
    .max(50)
    .required()
    .messages({
      'string.min': 'Last name must be at least 2 characters',
      'string.max': 'Last name cannot exceed 50 characters',
      'any.required': 'Last name is required'
    }),
  organizationName: Joi.string()
    .min(2)
    .max(100)
    .optional()
    .messages({
      'string.min': 'Organization name must be at least 2 characters',
      'string.max': 'Organization name cannot exceed 100 characters'
    }),
  phone: Joi.string()
    .pattern(new RegExp('^\\+?[1-9]\\d{1,14}$'))
    .optional()
    .messages({
      'string.pattern.base': 'Please provide a valid phone number'
    })
})

const loginSchema = Joi.object({
  email: Joi.string()
    .email()
    .required()
    .messages({
      'string.email': 'Please provide a valid email address',
      'any.required': 'Email is required'
    }),
  password: Joi.string()
    .required()
    .messages({
      'any.required': 'Password is required'
    })
})

// Validation middleware factory
const validate = (schema: Joi.ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error, value } = schema.validate(req.body, {
      abortEarly: false, // Get all validation errors
      allowUnknown: false, // Don't allow extra fields
      stripUnknown: true // Remove unknown fields
    })

    if (error) {
      const errorMessages = error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message
      }))

      logger.warn('Validation failed:', { errors: errorMessages, body: req.body })

      return res.status(400).json({
        success: false,
        error: {
          message: 'Validation failed',
          code: 'VALIDATION_ERROR',
          details: errorMessages
        }
      })
    }

    // Replace request body with validated data
    req.body = value
    next()
  }
}

// Export validation middlewares
export const validateRegistration = validate(registrationSchema)
export const validateLogin = validate(loginSchema)

// Additional validation utilities
export class ValidationUtils {
  /**
   * Validate organization slug
   */
  static isValidSlug(slug: string): boolean {
    const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/
    return slugRegex.test(slug) && slug.length >= 3 && slug.length <= 50
  }

  /**
   * Sanitize input to prevent XSS
   */
  static sanitizeInput(input: string): string {
    return input
      .replace(/[<>]/g, '') // Remove < and >
      .trim()
  }

  /**
   * Check password strength
   */
  static getPasswordStrength(password: string): 'weak' | 'medium' | 'strong' {
    let score = 0
    
    // Length check
    if (password.length >= 8) score++
    if (password.length >= 12) score++
    
    // Character variety
    if (/[a-z]/.test(password)) score++
    if (/[A-Z]/.test(password)) score++
    if (/\d/.test(password)) score++
    if (/[@$!%*?&]/.test(password)) score++
    
    if (score <= 3) return 'weak'
    if (score <= 5) return 'medium'
    return 'strong'
  }
}