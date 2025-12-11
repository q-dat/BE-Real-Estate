import { Request, Response } from 'express'
import InteriorCategoryModel from '~/api/models/interior/interiorCategoryModel'

export const updateInteriorCategory = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, categoryCode, description } = req.body

    const updateData: Record<string, unknown> = {
      name,
      categoryCode,
      description
    }

    const updated = await InteriorCategoryModel.findByIdAndUpdate(req.params.id, updateData, { new: true })

    if (!updated) {
      res.status(404).json({ message: 'Danh mục không tồn tại.' })
      return
    }

    res.status(200).json({
      message: 'Cập nhật danh mục nội thất thành công.',
      category: updated
    })
  } catch (error: any) {
    res.status(500).json({ message: 'Lỗi máy chủ', error: error.message })
  }
}
