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

    // TITLE
    if (title) {
      filters.title = { $regex: String(title), $options: 'i' }
    }

    // CATEGORY
    if (catalogID) {
      filters['category._id'] = new mongoose.Types.ObjectId(String(catalogID))
    }

    if (categoryCode) {
      filters['category.categoryCode'] = Number(categoryCode)
    }

    // --- PRICE FILTER ---
    if (priceFrom && priceTo) {
      // Lọc khoảng giá
      const from = Number(priceFrom)
      const to = Number(priceTo)
      filters.price = { $gte: from, $lte: to }
    } else if (price) {
      // Lọc <= giá truyền vào (không dùng chênh lệch)
      const input = Number(price)
      filters.price = { $lte: input }
    }

    // --- AREA FILTER ---
    if (area) {
      const a = Number(area)
      filters.area = { $gte: a }
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
      {
        $unwind: {
          path: '$category',
          preserveNullAndEmptyArrays: true
        }
      },
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
