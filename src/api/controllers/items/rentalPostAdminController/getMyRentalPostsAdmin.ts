import { Response } from 'express'
import mongoose from 'mongoose'
import RentalPostAdminModel from '~/api/models/rental/rentalPostAdminModel'
import { AuthRequest } from '~/middlewares/requireAuth'

export const getMyRentalPostsAdmin = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const adminId = req.user?.id as string

    const { title, priceFrom, priceTo, areaFrom, areaTo, province, district, ward, postType, status } = req.query

    const filters: Record<string, unknown> = {
      author: new mongoose.Types.ObjectId(adminId)
    }

    if (title) {
      filters.title = { $regex: String(title), $options: 'i' }
    }

    if (priceFrom || priceTo) {
      filters.price = {
        ...(priceFrom && { $gte: Number(priceFrom) }),
        ...(priceTo && { $lte: Number(priceTo) })
      }
    }

    if (areaFrom || areaTo) {
      filters.area = {
        ...(areaFrom && { $gte: Number(areaFrom) }),
        ...(areaTo && { $lte: Number(areaTo) })
      }
    }

    if (province) {
      filters.province = { $regex: String(province), $options: 'i' }
    }

    if (district) {
      filters.$expr = {
        $eq: [{ $toLower: '$district' }, String(district).toLowerCase()]
      }
    }

    if (ward) {
      filters.ward = { $regex: String(ward), $options: 'i' }
    }

    if (postType) filters.postType = postType
    if (status) filters.status = status

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
      { $match: filters },
      { $sort: { createdAt: -1 } }
    ])

    res.status(200).json({
      message: 'Lấy danh sách bài đăng của admin thành công',
      count: rentalPosts.length,
      rentalPosts
    })
  } catch (error: unknown) {
    const err = error as Error
    res.status(500).json({
      message: 'Lỗi máy chủ',
      error: err.message
    })
  }
}
