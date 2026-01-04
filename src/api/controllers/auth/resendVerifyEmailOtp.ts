import { Request, Response } from 'express'
import UserModel from '~/api/models/auth/UserModel'
import UserOtpModel from '~/api/models/owner/UserOtpModel'
import { createOtp } from '../owner/createOtp'

export const resendVerifyEmailOtp = async (req: Request, res: Response): Promise<void> => {
  const { email } = req.body

  const user = await UserModel.findOne({ email })
  if (!user) {
    res.status(404).json({ message: 'Email không tồn tại.' })
    return
  }

  if (user.emailVerified) {
    res.status(400).json({ message: 'Email đã được xác thực.' })
    return
  }

  const latestOtp = await UserOtpModel.findOne({
    email,
    type: 'verify_email',
    isUsed: false
  }).sort({ createdAt: -1 })

  if (latestOtp && latestOtp.expiresAt > new Date()) {
    res.status(400).json({
      message: 'OTP vẫn còn hiệu lực. Vui lòng chờ hết hạn.'
    })
    return
  }

  const otp = await createOtp({
    userId: user._id.toString(),
    email,
    type: 'verify_email',
    ttlMinutes: 2
  })

  // TODO: gửi email thực tế
  console.log('RESEND VERIFY OTP:', otp)

  res.json({ message: 'OTP mới đã được gửi.' })
}
