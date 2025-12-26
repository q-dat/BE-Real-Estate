import { Request, Response } from 'express'
import RentalCategoryModel from '~/api/models/rental/rentalCategoryModel'

export const getAllRentalCategory = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name } = req.query
    const filterQuery: Record<string, unknown> = {}
    
    if (name && typeof name === 'string') {
      filterQuery.name = { $regex: name, $options: 'i' }
    }

    const rentalCategories = await RentalCategoryModel.find(filterQuery).lean()

    res.status(200).json({
      message: 'Lấy danh sách danh mục bài đăng thành công!',
      count: rentalCategories.length,
      rentalCategories: rentalCategories
    })
  } catch (error: any) {
    res.status(500).json({ message: 'Lỗi máy chủ!', error: error.message })
  }
}
