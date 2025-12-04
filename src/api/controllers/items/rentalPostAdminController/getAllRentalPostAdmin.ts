import { Request, Response } from 'express'
import mongoose from 'mongoose'
import RentalPostAdminModel from '~/api/models/rentalPostAdminModel'

export const getAllRentalPostsAdmin = async (req: Request, res: Response): Promise<void> => {
  try {
    // if (isBrowserRequest(req)) {
    //   res.send('')
    //   return
    // }

    const { catalogID, categoryCode, title, price, priceFrom, priceTo, area } = req.query

    const filters: Record<string, unknown> = {}

    // Lọc tiêu đề
    if (title) {
      filters.title = { $regex: String(title), $options: 'i' }
    }

    // Lọc theo khoảng giá hoặc giá <= input
    if (priceFrom && priceTo) {
      filters.price = { $gte: Number(priceFrom), $lte: Number(priceTo) }
    } else if (price) {
      filters.price = { $lte: Number(price) }
    }

    // Diện tích >= input
    if (area) {
      filters.area = { $gte: Number(area) }
    }

    const categoryMatch: Record<string, unknown> = {}

    if (categoryCode) {
      categoryMatch['category.categoryCode'] = Number(categoryCode)
    }

    if (catalogID) {
      categoryMatch['category._id'] = new mongoose.Types.ObjectId(String(catalogID))
    }

    const rentalPosts = await RentalPostAdminModel.aggregate([
      {
        $lookup: {
          from: 'rental-categories',
          localField: 'category',
          foreignField: '_id',
          as: 'category'
        }
      },
      { $unwind: '$category' },

      // Match theo category, đúng chuẩn vì đã có lookup
      { $match: categoryMatch },

      // Match theo filters còn lại
      { $match: filters }
    ])

    const count = await RentalPostAdminModel.countDocuments()

    res.status(200).json({
      message: rentalPosts.length ? 'Lấy danh sách bài đăng thành công!' : 'Không có bài đăng nào phù hợp với bộ lọc',
      count,
      visibleCount: rentalPosts.length,
      rentalPosts
    })
  } catch (error: any) {
    res.status(500).json({ message: 'Lỗi máy chủ!', error: error.message })
  }
}
