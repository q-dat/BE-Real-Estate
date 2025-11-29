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
    const filterQuery: Record<string, unknown> = {}

    // Lọc theo catalogID
    if (catalogID) filterQuery.category = catalogID

    // Lọc theo title
    if (title && typeof title === 'string') filterQuery.title = { $regex: title, $options: 'i' }

    const categoryCodeNum = Number(categoryCode) || undefined

    const rentalPosts = await RentalPostAdminModel.aggregate([
      {
        $lookup: {
          from: 'rentalcategories', // tên collection của category
          localField: 'category',
          foreignField: '_id',
          as: 'category'
        }
      },
      { $unwind: { path: '$category', preserveNullAndEmptyArrays: true } },
      {
        $match: {
          ...(catalogID ? { category: new mongoose.Types.ObjectId(String(catalogID)) } : {}),
          ...(title ? { title: { $regex: title, $options: 'i' } } : {}),
          ...(categoryCode ? { 'category.categoryCode': categoryCodeNum } : {})
        }
      }
    ])

    const count = await RentalPostAdminModel.countDocuments()

    if (!rentalPosts.length) {
      res.status(200).json({
        message: 'Không có bài đăng nào phù hợp với bộ lọc',
        count,
        visibleCount: 0,
        rentalPosts: []
      })
      return
    }

    res.status(200).json({
      message: 'Lấy danh sách bài đăng thành công!',
      count,
      visibleCount: rentalPosts.length,
      rentalPosts
    })
    // await setCachedResponse(cacheKey, response)
  } catch (error: any) {
    res.status(500).json({ message: 'Lỗi máy chủ!', error: error.message })
  }
}
