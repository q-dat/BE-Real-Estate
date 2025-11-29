import { Request, Response } from 'express'
import RentalPostAdminModel from '~/api/models/rentalPostAdminModel'

export const getAllRentalPostsAdmin = async (req: Request, res: Response): Promise<void> => {
  try {
    // if (isBrowserRequest(req)) {
    //   res.send('')
    //   return
    // }

    const { catalogID, categoryCode, title } = req.query
    const filterQuery: Record<string, unknown> = {}

    // Lọc theo catalogID nếu có
    if (catalogID) {
      filterQuery.category = catalogID
    }
    // Lọc theo categoryCode nếu có
    if (categoryCode) {
      filterQuery['category.categoryCode'] = Number(categoryCode)
    }
    // Lọc theo title (dùng regex để hỗ trợ tìm kiếm không phân biệt hoa thường)
    if (title && typeof title === 'string') {
      filterQuery.title = { $regex: title, $options: 'i' }
    }

    // Lấy tất cả bài đăng theo filter
    const rentalPosts = await RentalPostAdminModel.find(filterQuery)
      .populate({
        path: 'category',
        select: '-createdAt -updatedAt -__v'
      })
      .lean()

    const count = await RentalPostAdminModel.countDocuments()

    const response = {
      message: 'Lấy danh sách bài đăng thành công!',
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
