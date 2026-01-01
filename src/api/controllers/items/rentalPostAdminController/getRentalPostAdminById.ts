import { Request, Response } from 'express'
import RentalPostAdminModel from '~/api/models/rental/rentalPostAdminModel'

export const getRentalPostAdminById = async (req: Request, res: Response): Promise<void> => {
  try {
    const rentalPost = await RentalPostAdminModel.findById(req.params.id)
      .populate({
        path: 'category',
        select: '-createdAt -updatedAt -__v'
      })
      .populate({
        path: 'author',
        select: '_id email role avatar phoneNumber zaloNumber'
      })
      .lean()

    if (!rentalPost) {
      res.status(404).json({ message: 'Bài đăng không tồn tại!' })
      return
    }

    res.setHeader('Cache-Control', 'public, max-age=0, s-maxage=3600, stale-while-revalidate=7200')

    res.status(200).json({
      message: 'Lấy bài đăng theo id thành công!',
      rentalPost
    })
  } catch (error: any) {
    console.error('Lỗi trong getRentalPostById:', error)
    res.status(500).json({ message: 'Lỗi máy chủ!', error: error.message })
  }
}
