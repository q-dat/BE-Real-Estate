import { Request, Response } from 'express'
import bcrypt from 'bcrypt'
import UserModel from '~/api/models/auth/UserModel'
import UserOtpModel from '~/api/models/owner/UserOtpModel'

export const confirmResetPassword = async (req: Request, res: Response): Promise<void> => {
  const { email, otp, newPassword } = req.body

  const otpRecord = await UserOtpModel.findOne({ email, type: 'reset_password', isUsed: false }).select('+otpHash')

  if (!otpRecord) {
    res.status(400).json({ message: 'OTP không hợp lệ.' })
    return
  }

  if (otpRecord.expiresAt < new Date()) {
    res.status(400).json({ message: 'OTP đã hết hạn.' })
    return
  }

  const isMatch = await bcrypt.compare(otp, otpRecord.otpHash)
  if (!isMatch) {
    otpRecord.attempts++
    await otpRecord.save()

    res.status(400).json({ message: 'OTP không đúng.' })
    return
  }

  await UserModel.updateOne(
    { email },
    {
      password: await bcrypt.hash(newPassword, 10),
      passwordChangedAt: new Date()
    }
  )

  otpRecord.isUsed = true
  await otpRecord.save()

  res.json({ message: 'Đặt lại mật khẩu thành công.' })
}
