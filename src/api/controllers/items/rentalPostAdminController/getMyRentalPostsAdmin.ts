import { Response } from 'express'
import mongoose from 'mongoose'
import RentalPostAdminModel from '~/api/models/rental/rentalPostAdminModel'
import { AuthRequest } from '~/middlewares/requireAuth'

export const getMyRentalPostsAdmin = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const adminId = req.user?.id as string

    const {
      catalogID,
      categoryCode,
      title,

      price,
      priceFrom,
      priceTo,

      area,
      areaFrom,
      areaTo,

      pricePerM2From,
      pricePerM2To,

      province,
      district,
      ward,

      propertyType,
      locationType,
      direction,
      legalStatus,
      furnitureStatus,

      bedroomNumber,
      toiletNumber,
      floorNumber,

      postType,
      status,
      author
    } = req.query

    const filters: Record<string, unknown> = {
      author: new mongoose.Types.ObjectId(adminId)
    }
    /* ---------- Text search ---------- */
    if (title) {
      filters.title = { $regex: String(title), $options: 'i' }
    }

    /* ---------- Price ---------- */
    if (priceFrom || priceTo) {
      filters.price = {
        ...(priceFrom && { $gte: Number(priceFrom) }),
        ...(priceTo && { $lte: Number(priceTo) })
      }
    } else if (price) {
      filters.price = { $lte: Number(price) }
    }

    /* ---------- Area ---------- */
    if (areaFrom || areaTo) {
      filters.area = {
        ...(areaFrom && { $gte: Number(areaFrom) }),
        ...(areaTo && { $lte: Number(areaTo) })
      }
    } else if (area) {
      filters.area = { $gte: Number(area) }
    }

    /* ---------- Price per m2 ---------- */
    if (pricePerM2From || pricePerM2To) {
      filters.pricePerM2 = {
        ...(pricePerM2From && { $gte: Number(pricePerM2From) }),
        ...(pricePerM2To && { $lte: Number(pricePerM2To) })
      }
    }

    /* ---------- Location ---------- */
    if (province) {
      filters.province = { $regex: String(province), $options: 'i' }
    }

    if (district) {
      const normalizedDistrict = String(district).trim().toLowerCase()
      filters.$expr = {
        $eq: [{ $toLower: '$district' }, normalizedDistrict]
      }
    }

    if (ward) {
      filters.ward = { $regex: String(ward), $options: 'i' }
    }

    /* ---------- Property attributes ---------- */
    if (propertyType) filters.propertyType = propertyType
    if (locationType) filters.locationType = locationType
    if (direction) filters.direction = direction
    if (legalStatus) filters.legalStatus = legalStatus
    if (furnitureStatus) filters.furnitureStatus = furnitureStatus

    if (bedroomNumber) filters.bedroomNumber = Number(bedroomNumber)
    if (toiletNumber) filters.toiletNumber = Number(toiletNumber)
    if (floorNumber) filters.floorNumber = Number(floorNumber)

    /* ---------- Post meta ---------- */
    if (postType) filters.postType = postType
    if (status) filters.status = status
    if (author) filters.author = author

    /* ---------- Category match ---------- */
    const categoryMatch: Record<string, unknown> = {}

    if (catalogID) {
      categoryMatch['category._id'] = new mongoose.Types.ObjectId(String(catalogID))
    }

    if (categoryCode) {
      categoryMatch['category.categoryCode'] = Number(categoryCode)
    }
    
    const matchStage: Record<string, unknown> = {
      ...filters,
      ...(Object.keys(categoryMatch).length > 0 ? categoryMatch : {})
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
      { $match: matchStage },
      { $sort: { createdAt: -1 } }
    ])

    const count = await RentalPostAdminModel.countDocuments(filters)

    res.status(200).json({
      message: 'Lấy danh sách bài đăng của admin thành công',
      count,
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
