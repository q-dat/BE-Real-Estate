import { Request, Response } from 'express'
import RealEstateProjectModel from '~/api/models/realEstateProject/realEstateProjectModel'

export const deleteRealEstateProject = async (req: Request, res: Response): Promise<void> => {
  try {
    const deleted = await RealEstateProjectModel.findByIdAndDelete(req.params.id)

    if (!deleted) {
      res.status(404).json({ message: 'Dự án không tồn tại!' })
      return
    }

    res.status(200).json({
      message: 'Xóa dự án thành công!',
      deleted
    })
  } catch (error: unknown) {
    const err = error as Error
    res.status(500).json({ message: 'Lỗi máy chủ!', error: err.message })
  }
}
