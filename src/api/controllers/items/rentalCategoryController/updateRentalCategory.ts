import { Request, Response } from 'express'
import RentalCategoryModel from '~/api/models/rentalCategoryModel'

export const updateRentalCategory = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, description } = req.body

    const updateData: Record<string, any> = {
      name,
      description
    }
    const updatedRentalCategory = await RentalCategoryModel.findByIdAndUpdate(req.params.id, updateData, { new: true })

    if (!updatedRentalCategory) {
      res.status(404).json({ message: 'Danh mục bài đăng không tồn tại!' })
      return
    }

    res.status(200).json({
      message: 'Cập nhật danh mục bài đăng thành công!',
      category: updatedRentalCategory
    })
  } catch (error: any) {
    res.status(500).json({ message: 'Lỗi máy chủ!', error: error.message })
  }
}
