import { Request, Response } from 'express'
import UserModel from '~/api/models/auth/UserModel'
import UserOtpModel from '~/api/models/owner/UserOtpModel'

export const getVerifyEmailStatus = async (req: Request, res: Response): Promise<void> => {
  const { email } = req.query as { email?: string }

  if (!email) {
    res.status(400).json({ message: 'Missing email.' })
    return
  }

  const user = await UserModel.findOne({ email }).select('emailVerified')
  if (!user) {
    res.status(404).json({ message: 'User not found.' })
    return
  }

  if (user.emailVerified) {
    res.json({
      emailVerified: true
    })
    return
  }

  const otp = await UserOtpModel.findOne({
    email,
    type: 'verify_email',
    isUsed: false
  }).sort({ createdAt: -1 })

  if (!otp) {
    res.json({
      emailVerified: false,
      otpExists: false
    })
    return
  }

  const now = new Date()
  const expiresIn = Math.max(0, Math.floor((otp.expiresAt.getTime() - now.getTime()) / 1000))

  res.json({
    emailVerified: false,
    otpExists: expiresIn > 0,
    expiresIn
  })
}
