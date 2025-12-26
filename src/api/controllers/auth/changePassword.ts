import { Response } from 'express'
import bcrypt from 'bcrypt'
import UserModel from '~/api/models/auth/UserModel'
import { AuthRequest } from '~/middlewares/requireAuth'

export const changePassword = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id
    const { oldPassword, newPassword } = req.body

    if (!userId) {
      res.status(401).json({ message: 'Unauthorized' })
      return
    }

    const user = await UserModel.findById(userId).select('+password')
    if (!user) {
      res.status(404).json({ message: 'User không tồn tại.' })
      return
    }

    const isMatch = await bcrypt.compare(oldPassword, user.password)
    if (!isMatch) {
      res.status(400).json({ message: 'Mật khẩu cũ không đúng.' })
      return
    }

    user.password = await bcrypt.hash(newPassword, 10)
    user.passwordChangedAt = new Date()

    await user.save()

    res.json({ message: 'Đổi mật khẩu thành công.' })
  } catch {
    res.status(500).json({ message: 'Lỗi máy chủ.' })
  }
}
