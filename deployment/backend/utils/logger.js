"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const winston_1 = __importDefault(require("winston"));
const { combine, timestamp, errors, json, colorize, simple } = winston_1.default.format;
// Create logger instance with modern configuration
const logger = winston_1.default.createLogger({
    level: process.env.LOG_LEVEL || 'info',
    format: combine(timestamp(), errors({ stack: true }), json()),
    defaultMeta: { service: 'livesell-pro' },
    transports: [
        // Write all logs to console
        new winston_1.default.transports.Console({
            format: combine(colorize(), simple(), winston_1.default.format.printf(({ timestamp, level, message, service }) => {
                return `${timestamp} [${service}] ${level}: ${message}`;
            }))
        }),
        // Write all logs with level 'error' and below to error.log
        new winston_1.default.transports.File({
            filename: 'logs/error.log',
            level: 'error'
        }),
        // Write all logs to combined.log
        new winston_1.default.transports.File({
            filename: 'logs/combined.log'
        })
    ],
});
// If we're not in production, log to the console with colorization
if (process.env.NODE_ENV !== 'production') {
    logger.add(new winston_1.default.transports.Console({
        format: winston_1.default.format.simple()
    }));
}
exports.default = logger;
//# sourceMappingURL=logger.js.map