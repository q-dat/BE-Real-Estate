import { Response } from 'express'
import { AuthRequest } from '~/middlewares/requireAuth'
import UserModel from '~/api/models/auth/UserModel'

export const me = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id

    if (!userId) {
      res.status(401).json({ message: 'Unauthorized' })
      return
    }

    const user = await UserModel.findById(userId).select('email role avatar isActive')

    if (!user || !user.isActive) {
      res.status(401).json({ message: 'Unauthorized' })
      return
    }

    res.json({
      message: 'OK',
      data: {
        id: user._id.toString(),
        email: user.email,
        role: user.role,
        avatar: user.profile.avatar
      }
    })
  } catch {
    res.status(500).json({ message: 'Lỗi máy chủ.' })
  }
}
