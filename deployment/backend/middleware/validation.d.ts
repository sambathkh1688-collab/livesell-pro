import { Request, Response, NextFunction } from 'express';
export declare const validateRegistration: (req: Request, res: Response, next: NextFunction) => Response<any, Record<string, any>> | undefined;
export declare const validateLogin: (req: Request, res: Response, next: NextFunction) => Response<any, Record<string, any>> | undefined;
export declare class ValidationUtils {
    /**
     * Validate organization slug
     */
    static isValidSlug(slug: string): boolean;
    /**
     * Sanitize input to prevent XSS
     */
    static sanitizeInput(input: string): string;
    /**
     * Check password strength
     */
    static getPasswordStrength(password: string): 'weak' | 'medium' | 'strong';
}
//# sourceMappingURL=validation.d.ts.map