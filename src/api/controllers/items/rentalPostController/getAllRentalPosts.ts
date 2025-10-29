import { Request, Response } from 'express'
import RentalPostModel from '../../../models/rentalPostModel'
import RentalCategoryModel from '../../../models/rentalCategoryModel'

// GET
export const getAllRentalPosts = async (req: Request, res: Response): Promise<void> => {
  try {
    // if (isBrowserRequest(req)) {
    //   res.send('')
    //   return
    // }

    const { catalogID, name } = req.query
    const filterQuery: Record<string, unknown> = {}

    // Lọc theo catalogID nếu có
    if (catalogID) {
      filterQuery.category = catalogID
    }

    // Lọc theo name (dùng regex để hỗ trợ tìm kiếm không phân biệt hoa thường)
    if (name && typeof name === 'string') {
      filterQuery.name = { $regex: name, $options: 'i' }
    }

    // Lấy tất cả bài đăng cho thuê theo filter
    const rentalPosts = await RentalPostModel.find(filterQuery)
      .populate({
        path: 'category',
        select: '-createdAt -updatedAt -__v'
      })
      .lean()

    const count = await RentalCategoryModel.countDocuments()

    const response = {
      message: 'Lấy danh sách bài đăng cho thuê thành công!',
      count,
      visibleCount: rentalPosts.length,
      rentalPosts: rentalPosts
    }

    // await setCachedResponse(cacheKey, response)

    res.status(200).json(response)
  } catch (error: any) {
    res.status(500).json({ message: 'Lỗi máy chủ!', error: error.message })
  }
}
