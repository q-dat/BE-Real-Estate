import { Request, Response } from 'express'
import { Types } from 'mongoose'
import UserModel from '~/api/models/auth/UserModel'

const ALLOWED_ROLES = ['user', 'admin', 'owner'] as const
type UserRole = (typeof ALLOWED_ROLES)[number]
type Params = {
  id: string
}

export const updateUserRole = async (req: Request<Params>, res: Response): Promise<void> => {
  try {
    const { id } = req.params
    const { role } = req.body as { role?: UserRole }

    if (!role || !ALLOWED_ROLES.includes(role)) {
      res.status(400).json({ message: 'Role không hợp lệ.' })
      return
    }

    if (!Types.ObjectId.isValid(id)) {
      res.status(400).json({ message: 'User ID không hợp lệ.' })
      return
    }

    const user = await UserModel.findById(id).select('email role')
    if (!user) {
      res.status(404).json({ message: 'Không tìm thấy user.' })
      return
    }

    /* Không cho xoá owner cuối cùng */
    if (user.role === 'owner' && role !== 'owner') {
      const ownerCount = await UserModel.countDocuments({ role: 'owner' })
      if (ownerCount <= 1) {
        res.status(400).json({ message: 'Phải tồn tại ít nhất một owner.' })
        return
      }
    }

    if (user.role === role) {
      res.status(200).json({
        message: 'Role không thay đổi.',
        data: { email: user.email, role: user.role }
      })
      return
    }

    user.role = role
    await user.save()

    res.json({
      message: 'Cập nhật role thành công.',
      data: {
        email: user.email,
        role: user.role
      }
    })
  } catch (error) {
    console.error('[updateUserRole]', error)
    res.status(500).json({ message: 'Lỗi máy chủ.' })
  }
}
