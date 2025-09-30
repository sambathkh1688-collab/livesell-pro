export interface FacebookError {
    code: string;
    message: string;
    type: 'AUTH_ERROR' | 'API_ERROR' | 'WEBHOOK_ERROR' | 'VALIDATION_ERROR' | 'NETWORK_ERROR';
    details?: any;
    suggestions?: string[];
}
export declare class FacebookErrorHandler {
    static createError(type: FacebookError['type'], code: string, message: string, details?: any, customSuggestions?: string[]): FacebookError;
    static handleAuthError(error: any): FacebookError;
    static handleApiError(error: any): FacebookError;
    static handleWebhookError(error: any, payload?: any): FacebookError;
    static handleValidationError(field: string, value: any, requirement: string): FacebookError;
    private static getSuggestions;
    /**
     * Format error for API response
     */
    static formatApiResponse(error: FacebookError): {
        success: boolean;
        error: {
            type: "VALIDATION_ERROR" | "AUTH_ERROR" | "API_ERROR" | "WEBHOOK_ERROR" | "NETWORK_ERROR";
            code: string;
            message: string;
            suggestions: string[];
        };
        timestamp: string;
    };
    /**
     * Format error for client-side display
     */
    static formatClientError(error: FacebookError): {
        title: string;
        message: string;
        suggestions: string[];
        type: string;
    };
    private static getErrorTitle;
    /**
     * Check if error is recoverable
     */
    static isRecoverable(error: FacebookError): boolean;
    /**
     * Get retry delay for recoverable errors
     */
    static getRetryDelay(error: FacebookError): number;
}
//# sourceMappingURL=facebookErrorHandler.d.ts.map