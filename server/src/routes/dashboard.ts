import express from 'express'
import { Request, Response } from 'express'

const router = express.Router()

router.get('/', (req: Request, res: Response) => {
  res.json({
    message: 'Dashboard API - Coming Soon!',
    features: [
      'Real-time analytics',
      'AI-powered insights',
      'Revenue tracking', 
      'Customer behavior analysis'
    ]
  })
})

export default router