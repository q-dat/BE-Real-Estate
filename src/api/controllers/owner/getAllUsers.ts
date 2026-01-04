import { Request, Response } from 'express'
import UserModel from '~/api/models/auth/UserModel'

export const getAllUsers = async (_: Request, res: Response) => {
  const users = await UserModel.find().select('email role isActive emailVerified createdAt lastLoginAt').sort({ createdAt: -1 })

  res.json({ data: users })
}
