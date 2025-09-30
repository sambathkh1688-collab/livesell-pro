import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import compression from 'compression'
import morgan from 'morgan'
import { createServer } from 'http'
import { Server } from 'socket.io'
import dotenv from 'dotenv'
import { rateLimitConfig } from '@/middleware/rateLimit'
import { errorHandler } from '@/middleware/errorHandler'
import { authMiddleware } from '@/middleware/auth'
import logger from '@/utils/logger'
import routes from '@/routes'

// Load environment variables
dotenv.config()

const app = express()
const server = createServer(app)
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    methods: ["GET", "POST"]
  }
})

// Security & Performance Middleware
app.use(helmet())
app.use(compression())
app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:3000",
  credentials: true
}))

// Logging
app.use(morgan('combined', {
  stream: { write: message => logger.info(message.trim()) }
}))

// Body parsing
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

// Rate limiting
app.use(rateLimitConfig)

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    message: 'LiveSell Pro API - SystemKH Killer 🚀'
  })
})

// API Routes
app.use('/api', routes)

// WebSocket for real-time updates (SystemKH doesn't have this!)
io.on('connection', (socket) => {
  logger.info(`Client connected: ${socket.id}`)
  
  socket.on('join-room', (roomId: string) => {
    socket.join(roomId)
    logger.info(`Client ${socket.id} joined room: ${roomId}`)
  })
  
  socket.on('disconnect', () => {
    logger.info(`Client disconnected: ${socket.id}`)
  })
})

// Global error handler
app.use(errorHandler)

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'API endpoint not found',
    path: req.originalUrl
  })
})

const PORT = process.env.PORT || 5000

server.listen(PORT, () => {
  logger.info(`🚀 LiveSell Pro Server running on port ${PORT}`)
  logger.info(`🎯 Ready to crush SystemKH!`)
})

export { io }
export default app