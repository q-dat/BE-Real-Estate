import { Request, Response } from 'express'
import bcrypt from 'bcrypt'
import UserModel from '~/api/models/auth/UserModel'
import { createOtp } from '../owner/createOtp'

export const register = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body

  const exists = await UserModel.findOne({ email })
  if (exists) {
    res.status(400).json({ message: 'Email đã tồn tại.' })
    return
  }

  const user = await UserModel.create({
    email,
    password: await bcrypt.hash(password, 10)
  })

  const otp = await createOtp({
    userId: user._id.toString(),
    email,
    type: 'verify_email',
    ttlMinutes: 2
  })

  console.log('VERIFY OTP:', otp)

  res.status(201).json({ message: 'Đăng ký thành công. Vui lòng xác thực email.' })
}
