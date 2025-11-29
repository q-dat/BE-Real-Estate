import exp from 'constants'
import { Request, Response } from 'express'
import RentalCategoryModel from '~/api/models/rentalCategoryModel'

export const deleteRentalCategory = async (req: Request, res: Response): Promise<void> => {
  try {
    const deletedRentalCategory = await RentalCategoryModel.findByIdAndDelete(req.params.id)

    if (!deletedRentalCategory) {
      res.status(404).json({ message: 'Danh mục bài đăng không tồn tại!' })
      return
    }
    res.status(200).json({
      message: 'Danh mục bài đăng đã được xóa thành công!',
      deletedCategory: deletedRentalCategory
    })
  } catch (error: any) {
    res.status(500).json({ message: 'Lỗi máy chủ!', error: error.message })
  }
}
