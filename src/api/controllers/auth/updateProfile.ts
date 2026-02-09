import { Request, Response } from 'express'
import UserModel from '~/api/models/auth/UserModel'
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

    const { displayName, username, aboutMe, instagram, messenger, facebook, phoneNumber, zaloNumber, viberNumber } = req.body

    const files = req.files as { [fieldname: string]: Express.Multer.File[] } | undefined
    const avatarFiles = files?.avatar ?? []

    let avatarUrl: string | undefined

    if (avatarFiles.length > 0) {
      avatarUrl = await uploadImageToCloudinary(avatarFiles[0].buffer)
    }

    const updateProfileData: Record<string, unknown> = {}

    if (displayName) updateProfileData['profile.displayName'] = displayName
    if (username) updateProfileData['profile.username'] = username
    if (aboutMe) updateProfileData['profile.aboutMe'] = aboutMe

    if (instagram) updateProfileData['profile.instagram'] = instagram
    if (messenger) updateProfileData['profile.messenger'] = messenger
    if (facebook) updateProfileData['profile.facebook'] = facebook

    if (phoneNumber) updateProfileData['profile.phoneNumber'] = phoneNumber
    if (zaloNumber) updateProfileData['profile.zaloNumber'] = zaloNumber
    if (viberNumber) updateProfileData['profile.viberNumber'] = viberNumber

    if (avatarUrl) updateProfileData['profile.avatar'] = avatarUrl

    if (Object.keys(updateProfileData).length === 0) {
      res.status(400).json({ message: 'Không có dữ liệu để cập nhật.' })
      return
    }

    const updatedUser = await UserModel.findByIdAndUpdate(userId, { $set: updateProfileData }, { new: true })

    if (!updatedUser) {
      res.status(404).json({ message: 'Không tìm thấy người dùng.' })
      return
    }

    res.json({
      message: 'Cập nhật hồ sơ thành công.',
      data: {
        id: updatedUser._id,
        email: updatedUser.email,
        profile: updatedUser.profile
      }
    })
  } catch (error) {
    const err = error as Error
    res.status(500).json({
      message: 'Lỗi máy chủ.',
      error: err.message
    })
  }
}
