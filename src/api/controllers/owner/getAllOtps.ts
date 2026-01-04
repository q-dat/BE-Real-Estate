import { Request, Response } from 'express'
import UserOtpModel from '~/api/models/owner/UserOtpModel'

export const getAllOtps = async (_: Request, res: Response) => {
  const otps = await UserOtpModel.find().select('email type isUsed attempts expiresAt createdAt').sort({ createdAt: -1 })

  res.json({ data: otps })
}
