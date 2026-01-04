import { Request, Response } from 'express'
import UserModel from '~/api/models/auth/UserModel'
import { createOtp } from '../owner/createOtp'

export const resetPassword = async (req: Request, res: Response): Promise<void> => {
  const { email } = req.body

  const user = await UserModel.findOne({ email })
  if (!user || !user.emailVerified) {
    res.status(400).json({ message: 'Email chưa xác thực.' })
    return
  }

  const otp = await createOtp({
    userId: user._id.toString(),
    email,
    type: 'reset_password'
  })

  console.log('RESET OTP:', otp)

  res.status(200).json({ message: 'OTP đặt lại mật khẩu đã gửi.' })
}
