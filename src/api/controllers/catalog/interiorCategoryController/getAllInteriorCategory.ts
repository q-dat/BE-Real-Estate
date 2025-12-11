import { Request, Response } from 'express'
import InteriorCategoryModel from '~/api/models/interior/interiorCategoryModel'

export const getAllInteriorCategory = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name } = req.query

    const filters: Record<string, unknown> = {}

    if (name && typeof name === 'string') {
      filters.name = { $regex: name, $options: 'i' }
    }

    const categories = await InteriorCategoryModel.find(filters).lean()

    res.status(200).json({
      message: 'Lấy danh sách danh mục nội thất thành công.',
      count: categories.length,
      interiorCategories: categories
    })
  } catch (error: any) {
    res.status(500).json({ message: 'Lỗi máy chủ', error: error.message })
  }
}
