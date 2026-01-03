import { Request, Response } from 'express'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import UserModel from '~/api/models/auth/UserModel'

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body

    const user = await UserModel.findOne({ email }).select('+password')
    if (!user) {
      res.status(401).json({ message: 'Email hoặc mật khẩu không đúng.' })
      return
    }

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      res.status(401).json({ message: 'Email hoặc mật khẩu không đúng.' })
      return
    }

    const token = jwt.sign(
      {
        id: user._id.toString(),
        role: user.role
      },
      process.env.JWT_SECRET as string,
      {
        expiresIn: '7d'
      }
    )

    user.lastLoginAt = new Date()
    user.failedLoginAttempts = 0
    await user.save()

    res.json({
      message: 'Đăng nhập thành công.',
      data: {
        id: user._id,
        email: user.email,
        role: user.role,
        avatar: user.profile.avatar,
        token
      }
    })
  } catch (error: unknown) {
    const err = error as Error
    res.status(500).json({ message: 'Lỗi máy chủ.', error: err.message })
  }
}
