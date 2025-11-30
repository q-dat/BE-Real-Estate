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

    const rentalPosts = await RentalPostAdminModel.aggregate([
      {
        $lookup: {
          from: 'rental-categories', // tên collection của category
          localField: 'category',
          foreignField: '_id',
          as: 'category'
        }
      },
      { $unwind: { path: '$category', preserveNullAndEmptyArrays: true } },
      {
        $match: {
          ...(title ? { title: { $regex: String(title), $options: 'i' } } : {}),
          ...(catalogID ? { 'category._id': new mongoose.Types.ObjectId(String(catalogID)) } : {}),
          ...(categoryCode ? { 'category.categoryCode': Number(categoryCode) } : {})
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
