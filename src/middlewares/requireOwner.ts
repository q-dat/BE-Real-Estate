import { NextFunction, Response } from 'express'
import { AuthRequest } from './requireAuth'
import UserModel from '~/api/models/auth/UserModel'

export const requireOwner = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  if (!req.user) {
    res.status(401).json({ message: 'Unauthorized' })
    return
  }

  const user = await UserModel.findById(req.user.id).select('role isActive')

  if (!user || !user.isActive) {
    res.status(401).json({ message: 'User not active' })
    return
  }

  if (user.role !== 'owner') {
    res.status(403).json({ message: 'Forbidden: Owner only' })
    return
  }

  next()
}
