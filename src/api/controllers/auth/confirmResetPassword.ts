import { Request, Response } from 'express'
import bcrypt from 'bcrypt'
import UserModel from '~/api/models/auth/UserModel'

export const confirmResetPassword = async (req: Request, res: Response): Promise<void> => {
  const { email, otp, newPassword } = req.body

  const user = await UserModel.findOne({ email }).select('+resetPasswordOtp +resetPasswordOtpExpiresAt +password')

  if (!user || !user.resetPasswordOtp) {
    res.status(400).json({ message: 'OTP không hợp lệ.' })
    return
  }

  if (user.resetPasswordOtpExpiresAt! < new Date()) {
    res.status(400).json({ message: 'OTP đã hết hạn.' })
    return
  }

  const isMatch = await bcrypt.compare(otp, user.resetPasswordOtp)
  if (!isMatch) {
    res.status(400).json({ message: 'OTP không đúng.' })
    return
  }

  user.password = await bcrypt.hash(newPassword, 10)
  user.resetPasswordOtp = undefined
  user.resetPasswordOtpExpiresAt = undefined
  user.passwordChangedAt = new Date()

  await user.save()

  res.json({ message: 'Đặt lại mật khẩu thành công.' })
}
