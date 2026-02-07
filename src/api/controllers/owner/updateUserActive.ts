import { Request, Response } from 'express'
import { Types } from 'mongoose'
import UserModel from '~/api/models/auth/UserModel'

type Params = {
  id: string
}
export const updateUserActive = async (req: Request<Params>, res: Response): Promise<void> => {
  try {
    const { id } = req.params
    const { isActive } = req.body as { isActive?: boolean }

    if (typeof isActive !== 'boolean') {
      res.status(400).json({ message: '`isActive` phải là boolean.' })
      return
    }

    if (!Types.ObjectId.isValid(id)) {
      res.status(400).json({ message: 'User ID không hợp lệ.' })
      return
    }

    const user = await UserModel.findById(id).select('email isActive')
    if (!user) {
      res.status(404).json({ message: 'Không tìm thấy user.' })
      return
    }

    user.isActive = isActive
    await user.save()

    res.json({
      message: 'Cập nhật trạng thái tài khoản thành công.',
      data: {
        email: user.email,
        isActive: user.isActive
      }
    })
  } catch (error) {
    console.error('[updateUserActive]', error)
    res.status(500).json({ message: 'Lỗi máy chủ.' })
  }
}
