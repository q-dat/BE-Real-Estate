import { Request, Response } from 'express'
import mongoose from 'mongoose'
import RentalPostAdminModel from '~/api/models/rentalPostAdminModel'

export const getAllRentalPostsAdmin = async (req: Request, res: Response): Promise<void> => {
  try {
    // if (isBrowserRequest(req)) {
    //   res.send('')
    //   return
    // }

    const { catalogID, categoryCode, title } = req.query

    const filters: Record<string, unknown> = {}

    if (title) filters.title = { $regex: String(title), $options: 'i' }
    if (catalogID) filters['category._id'] = new mongoose.Types.ObjectId(String(catalogID))
    if (categoryCode) filters['category.categoryCode'] = Number(categoryCode)

    const rentalPosts = await RentalPostAdminModel.aggregate([
      {
        $lookup: {
          from: 'rental-categories',
          localField: 'category',
          foreignField: '_id',
          as: 'category'
        }
      },
      { $unwind: { path: '$category', preserveNullAndEmptyArrays: true } },
      { $match: filters }
    ])

    const count = await RentalPostAdminModel.countDocuments()

    res.status(200).json({
      message: rentalPosts.length ? 'Lấy danh sách bài đăng thành công!' : 'Không có bài đăng nào phù hợp với bộ lọc',
      count,
      visibleCount: rentalPosts.length,
      rentalPosts
    })
    // await setCachedResponse(cacheKey, response)
  } catch (error: any) {
    res.status(500).json({ message: 'Lỗi máy chủ!', error: error.message })
  }
}
