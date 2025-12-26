import { Request, Response } from 'express'
import bcrypt from 'bcrypt'
import UserModel from '~/api/models/auth/UserModel'

export const resetPassword = async (req: Request, res: Response): Promise<void> => {
  const { email } = req.body

  const user = await UserModel.findOne({ email })
  if (!user || !user.emailVerified) {
    res.status(400).json({ message: 'Email chưa xác thực.' })
    return
  }

  const otp = Math.floor(100000 + Math.random() * 900000).toString()
  user.resetPasswordOtp = await bcrypt.hash(otp, 10)
  user.resetPasswordOtpExpiresAt = new Date(Date.now() + 10 * 60 * 1000)

  await user.save()

  console.log('RESET OTP:', otp)

  res.json({ message: 'OTP đặt lại mật khẩu đã gửi.' })
}
