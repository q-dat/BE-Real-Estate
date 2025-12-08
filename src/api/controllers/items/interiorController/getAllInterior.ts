import { Request, Response } from 'express'
import InteriorModel from '~/api/models/interior/interiorModel'

export const getAllInterior = async (req: Request, res: Response): Promise<void> => {
  try {
    const interior = await InteriorModel.find().lean()
    const count = await InteriorModel.countDocuments()
    res.status(200).json({
      message: interior.length ? 'Lấy danh sách thiết kế thành công!' : 'Không có danh sách thiết kế nào!',
      count,
      visibleCount: interior.length,
      interior
    })
  } catch (error: any) {
    res.status(500).json({ message: 'Lỗi máy chủ!', error: error.message })
  }
}
