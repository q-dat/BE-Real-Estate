import { Request, Response } from 'express'
import bcrypt from 'bcrypt'
import UserModel from '~/api/models/auth/UserModel'

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body

    const existed = await UserModel.findOne({ email })
    if (existed) {
      res.status(409).json({ message: 'Email đã tồn tại.' })
      return
    }

    const hashedPassword = await bcrypt.hash(password, 12)

    const user = await UserModel.create({
      email,
      password: hashedPassword
    })

    res.status(201).json({
      message: 'Đăng ký thành công.',
      data: {
        id: user._id,
        email: user.email,
        role: user.role
      }
    })
  } catch (error: unknown) {
    const err = error as Error
    res.status(500).json({ message: 'Lỗi máy chủ.', error: err.message })
  }
}
