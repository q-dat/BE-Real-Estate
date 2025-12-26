import { Request, Response } from 'express'
import bcrypt from 'bcrypt'
import UserModel from '~/api/models/auth/UserModel'

export const verifyEmail = async (req: Request, res: Response): Promise<void> => {
  const { email, otp } = req.body

  const user = await UserModel.findOne({ email }).select('+emailVerifyOtp +emailVerifyOtpExpiresAt')

  if (!user || !user.emailVerifyOtp || !user.emailVerifyOtpExpiresAt) {
    res.status(400).json({ message: 'OTP không hợp lệ.' })
    return
  }

  if (user.emailVerifyOtpExpiresAt < new Date()) {
    res.status(400).json({ message: 'OTP đã hết hạn.' })
    return
  }

  const isMatch = await bcrypt.compare(otp, user.emailVerifyOtp)
  if (!isMatch) {
    res.status(400).json({ message: 'OTP không đúng.' })
    return
  }

  user.emailVerified = true
  user.emailVerifyOtp = undefined
  user.emailVerifyOtpExpiresAt = undefined
  user.emailVerifyOtpAttempts = 0

  await user.save()

  res.json({ message: 'Xác thực email thành công.' })
}
