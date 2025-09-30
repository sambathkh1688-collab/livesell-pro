import express from 'express'
import authRoutes from './auth'
import facebookRoutes from './facebook'
import dashboardRoutes from './dashboard'
import subscriptionRoutes from './subscription'

const router = express.Router()

// Health check for API
router.get('/', (req, res) => {
  res.json({
    message: '🚀 LiveSell Pro API - The SystemKH Killer!',
    version: '1.0.0',
    status: 'operational',
    features: {
      aiPowered: true,
      realTimeUpdates: true,
      multiChannel: true,
      modernTech: true,
      betterPricing: '34% cheaper than SystemKH'
    }
  })
})

// Route modules
router.use('/auth', authRoutes)
router.use('/facebook', facebookRoutes)
router.use('/dashboard', dashboardRoutes)
router.use('/subscription', subscriptionRoutes)

export default router