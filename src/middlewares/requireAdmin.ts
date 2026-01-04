import { Response, NextFunction } from 'express'
import { AuthRequest } from './requireAuth'

export const requireAdmin = (req: AuthRequest, res: Response, next: NextFunction): void => {
  if (!req.user) {
    res.status(401).json({ message: 'Unauthorized' })
    return
  }

  if (req.user.role !== 'admin' && req.user.role !== 'owner') {
    res.status(403).json({ message: 'Forbidden: Admin only' })
    return
  }

  next()
}
