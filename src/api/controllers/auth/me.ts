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

    const user = await UserModel.findById(userId).select('email role isActive profile')

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
        profile: {
          avatar: user.profile?.avatar,
          displayName: user.profile?.displayName,
          username: user.profile?.username,
          aboutMe: user.profile?.aboutMe,
          instagram: user.profile?.instagram,
          messenger: user.profile?.messenger,
          facebook: user.profile?.facebook,
          phoneNumber: user.profile?.phoneNumber,
          zaloNumber: user.profile?.zaloNumber,
          viberNumber: user.profile?.viberNumber
        }
      }
    })
  } catch (error) {
    res.status(500).json({ message: 'Lỗi máy chủ.' })
  }
}
