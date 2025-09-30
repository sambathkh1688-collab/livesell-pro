"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.io = void 0;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const compression_1 = __importDefault(require("compression"));
const morgan_1 = __importDefault(require("morgan"));
const http_1 = require("http");
const socket_io_1 = require("socket.io");
const dotenv_1 = __importDefault(require("dotenv"));
const rateLimit_1 = require("@/middleware/rateLimit");
const errorHandler_1 = require("@/middleware/errorHandler");
const logger_1 = __importDefault(require("@/utils/logger"));
const routes_1 = __importDefault(require("@/routes"));
// Load environment variables
dotenv_1.default.config();
const app = (0, express_1.default)();
const server = (0, http_1.createServer)(app);
const io = new socket_io_1.Server(server, {
    cors: {
        origin: process.env.CLIENT_URL || "http://localhost:3000",
        methods: ["GET", "POST"]
    }
});
exports.io = io;
// Security & Performance Middleware
app.use((0, helmet_1.default)());
app.use((0, compression_1.default)());
app.use((0, cors_1.default)({
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    credentials: true
}));
// Logging
app.use((0, morgan_1.default)('combined', {
    stream: { write: message => logger_1.default.info(message.trim()) }
}));
// Body parsing
app.use(express_1.default.json({ limit: '10mb' }));
app.use(express_1.default.urlencoded({ extended: true, limit: '10mb' }));
// Rate limiting
app.use(rateLimit_1.rateLimitConfig);
// Health check endpoint
app.get('/health', (req, res) => {
    res.json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        version: '1.0.0',
        message: 'LiveSell Pro API - SystemKH Killer 🚀'
    });
});
// API Routes
app.use('/api', routes_1.default);
// WebSocket for real-time updates (SystemKH doesn't have this!)
io.on('connection', (socket) => {
    logger_1.default.info(`Client connected: ${socket.id}`);
    socket.on('join-room', (roomId) => {
        socket.join(roomId);
        logger_1.default.info(`Client ${socket.id} joined room: ${roomId}`);
    });
    socket.on('disconnect', () => {
        logger_1.default.info(`Client disconnected: ${socket.id}`);
    });
});
// Global error handler
app.use(errorHandler_1.errorHandler);
// 404 handler
app.use('*', (req, res) => {
    res.status(404).json({
        success: false,
        message: 'API endpoint not found',
        path: req.originalUrl
    });
});
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    logger_1.default.info(`🚀 LiveSell Pro Server running on port ${PORT}`);
    logger_1.default.info(`🎯 Ready to crush SystemKH!`);
});
exports.default = app;
//# sourceMappingURL=index.js.map