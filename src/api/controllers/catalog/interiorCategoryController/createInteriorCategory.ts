import { Request, Response } from 'express'
import InteriorCategoryModel from '~/api/models/interior/interiorCategoryModel'

export const createInteriorCategory = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, categoryCode, description } = req.body

    if (!name) {
      res.status(400).json({ message: 'Tên danh mục là bắt buộc.' })
      return
    }

    const existed = await InteriorCategoryModel.findOne({ name })
    if (existed) {
      res.status(400).json({ message: 'Danh mục đã tồn tại.' })
      return
    }

    const created = await InteriorCategoryModel.create({
      name,
      categoryCode,
      description
    })

    res.status(201).json({
      message: 'Tạo danh mục nội thất thành công.',
      category: created
    })
  } catch (error: any) {
    res.status(500).json({ message: 'Lỗi máy chủ', error: error.message })
  }
}
