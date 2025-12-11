import { Request, Response } from 'express'
import InteriorCategoryModel from '~/api/models/interior/interiorCategoryModel'

export const deleteInteriorCategory = async (req: Request, res: Response): Promise<void> => {
  try {
    const deleted = await InteriorCategoryModel.findByIdAndDelete(req.params.id)

    if (!deleted) {
      res.status(404).json({ message: 'Danh mục không tồn tại.' })
      return
    }

    res.status(200).json({
      message: 'Xoá danh mục nội thất thành công.',
      deletedCategory: deleted
    })
  } catch (error: any) {
    res.status(500).json({ message: 'Lỗi máy chủ', error: error.message })
  }
}
