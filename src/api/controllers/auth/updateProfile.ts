import { Request, Response } from 'express'
import UserModel, { IUser } from '~/api/models/auth/UserModel'
import { uploadImageToCloudinary } from '~/common/uploadImageToCloudinary'

interface AuthRequest extends Request {
  user?: {
    id: string
  }
}

export const updateProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id
    if (!userId) {
      res.status(401).json({ message: 'Unauthorized' })
      return
    }

    const { phoneNumber, zaloNumber } = req.body

    const files = req.files as { [fieldname: string]: Express.Multer.File[] }
    const avatarFiles = files?.['avatar'] || []

    let avatarUrl: string | undefined

    if (avatarFiles.length) {
      avatarUrl = await uploadImageToCloudinary(avatarFiles[0].path)
    }

    const updateData: Partial<IUser> = {}

    if (phoneNumber) updateData.phoneNumber = phoneNumber
    if (zaloNumber) updateData.zaloNumber = zaloNumber
    if (avatarUrl) updateData.avatar = avatarUrl

    const updated = await UserModel.findByIdAndUpdate(userId, { $set: updateData }, { new: true })

    if (!updated) {
      res.status(404).json({ message: 'Không tìm thấy người dùng.' })
      return
    }

    res.json({
      message: 'Cập nhật hồ sơ thành công.',
      data: {
        id: updated._id,
        email: updated.email,
        avatar: updated.avatar,
        phoneNumber: updated.phoneNumber,
        zaloNumber: updated.zaloNumber
      }
    })
  } catch (error: unknown) {
    const err = error as Error
    res.status(500).json({ message: 'Lỗi máy chủ.', error: err.message })
  }
}
