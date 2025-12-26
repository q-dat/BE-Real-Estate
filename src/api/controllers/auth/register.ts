import { Request, Response } from 'express'
import bcrypt from 'bcrypt'
import UserModel from '~/api/models/auth/UserModel'

export const register = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body

  const exists = await UserModel.findOne({ email })
  if (exists) {
    res.status(400).json({ message: 'Email đã tồn tại.' })
    return
  }

  const otp = Math.floor(100000 + Math.random() * 900000).toString()
  const hashedOtp = await bcrypt.hash(otp, 10)

  await UserModel.create({
    email,
    password: await bcrypt.hash(password, 10),
    emailVerifyOtp: hashedOtp,
    emailVerifyOtpExpiresAt: new Date(Date.now() + 10 * 60 * 1000)
  })

  console.log('VERIFY OTP:', otp)

  res.json({ message: 'Đăng ký thành công. Vui lòng xác thực email.' })
}
