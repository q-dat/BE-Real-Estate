import { Request, Response } from 'express'
import RentalCategoryModel from '~/api/models/rental/rentalCategoryModel'

export const createRentalCategory = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, categoryCode, description } = req.body
    if (!name) {
      res.status(400).json({ message: 'Tên danh mục là bắt buộc.' })
      return
    }
    const newRentalCategory = new RentalCategoryModel({
      name,
      categoryCode,
      description
    })

    const savedRentalCategory = await newRentalCategory.save()

    res.status(201).json({
      message: 'Danh mục bài đăng đã được tạo thành công.',
      category: savedRentalCategory
    })
  } catch (error: any) {
    res.status(500).json({ message: 'Lỗi máy chủ!', error: error.message })
  }
}
