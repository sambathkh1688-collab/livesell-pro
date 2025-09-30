import express from 'express'
import { Request, Response } from 'express'

const router = express.Router()

router.get('/', (req: Request, res: Response) => {
  res.json({
    message: 'Subscription Management - Coming Soon!',
    plans: {
      free: { price: 0, features: 'Basic features' },
      starter: { price: 19, savings: '34% vs SystemKH ($29)' },
      professional: { price: 39, savings: '34% vs SystemKH ($59)' },
      enterprise: { price: 99, savings: '34% vs SystemKH ($149)' }
    }
  })
})

export default router