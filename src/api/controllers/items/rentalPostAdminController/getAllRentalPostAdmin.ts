import { Request, Response } from 'express'
import mongoose from 'mongoose'
import RentalPostAdminModel from '~/api/models/rental/rentalPostAdminModel'
import { buildPaginationMeta, getPagination } from '~/utils/pagination'

export const getAllRentalPostsAdmin = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      catalogID,
      categoryCode,
      title,
      code,

      price,
      priceFrom,
      priceTo,

      area,
      areaFrom,
      areaTo,
      frontageWidth,
      lotDepth,
      backSize,

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

    const { page, limit, skip } = getPagination(req.query, {
      defaultPage: 1,
      defaultLimit: 20,
      maxLimit: 100
    })

    const filters: Record<string, unknown> = {}

    // Text search
    if (title) {
      filters.title = { $regex: String(title), $options: 'i' }
    }

    if (code) {
      filters.code = { $regex: String(code), $options: 'i' }
    }

    // Price
    if (priceFrom || priceTo) {
      filters.price = {
        ...(priceFrom && { $gte: Number(priceFrom) }),
        ...(priceTo && { $lte: Number(priceTo) })
      }
    } else if (price) {
      filters.price = { $lte: Number(price) }
    }

    // Area
    if (areaFrom || areaTo) {
      filters.area = {
        ...(areaFrom && { $gte: Number(areaFrom) }),
        ...(areaTo && { $lte: Number(areaTo) })
      }
    } else if (area) {
      filters.area = { $gte: Number(area) }
    }

    // Dimensions
    if (frontageWidth) filters.frontageWidth = Number(frontageWidth)
    if (lotDepth) filters.lotDepth = Number(lotDepth)
    if (backSize) filters.backSize = Number(backSize)

    // Price per m2
    if (pricePerM2From || pricePerM2To) {
      filters.pricePerM2 = {
        ...(pricePerM2From && { $gte: Number(pricePerM2From) }),
        ...(pricePerM2To && { $lte: Number(pricePerM2To) })
      }
    }

    // Location
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

    // Property attributes
    if (propertyType) filters.propertyType = propertyType
    if (locationType) filters.locationType = locationType
    if (direction) filters.direction = direction
    if (legalStatus) filters.legalStatus = legalStatus
    if (furnitureStatus) filters.furnitureStatus = furnitureStatus

    if (bedroomNumber) filters.bedroomNumber = Number(bedroomNumber)
    if (toiletNumber) filters.toiletNumber = Number(toiletNumber)
    if (floorNumber) filters.floorNumber = Number(floorNumber)

    // Post meta
    if (postType) filters.postType = postType
    if (status) filters.status = status

    if (author && mongoose.Types.ObjectId.isValid(String(author))) {
      filters.author = new mongoose.Types.ObjectId(String(author))
    }

    // Category match
    const categoryMatch: Record<string, unknown> = {}

    if (catalogID && mongoose.Types.ObjectId.isValid(String(catalogID))) {
      categoryMatch['category._id'] = new mongoose.Types.ObjectId(String(catalogID))
    }

    if (categoryCode) {
      categoryMatch['category.categoryCode'] = Number(categoryCode)
    }

    const result = await RentalPostAdminModel.aggregate([
      // CATEGORY
      {
        $lookup: {
          from: 'rental-categories',
          localField: 'category',
          foreignField: '_id',
          as: 'category'
        }
      },
      { $unwind: '$category' },

      // AUTHOR
      {
        $lookup: {
          from: 'users',
          localField: 'author',
          foreignField: '_id',
          as: 'author'
        }
      },
      {
        $unwind: {
          path: '$author',
          preserveNullAndEmptyArrays: true
        }
      },

      // FILTER
      {
        $match: {
          ...filters,
          ...categoryMatch
        }
      },

      // Sort by newest
      { $sort: { createdAt: -1 } },

      // CLEAN OUTPUT
      {
        $project: {
          'author.password': 0,
          'author.__v': 0,
          'author.createdAt': 0,
          'author.updatedAt': 0,
          'author.role': 0,
          'author.isActive': 0,
          'author.emailVerified': 0,
          'author.lastLoginAt': 0,
          'author.passwordChangedAt': 0,
          'author.emailVerifyOtpAttempts': 0,
          'author.resetPasswordOtpAttempts': 0,
          'author.failedLoginAttempts': 0,
          __v: 0
        }
      },

      // PAGINATION + TOTAL COUNT
      {
        $facet: {
          data: [{ $skip: skip }, { $limit: limit }],
          totalData: [{ $count: 'total' }]
        }
      }
    ])

    const rentalPosts = result[0]?.data ?? []
    const total = result[0]?.totalData?.[0]?.total ?? 0

    res.status(200).json({
      message: rentalPosts.length ? 'Lấy danh sách bài đăng thành công' : 'Không có bài đăng phù hợp',
      count: total,
      visibleCount: rentalPosts.length,
      pagination: buildPaginationMeta({
        page,
        limit,
        total
      }),
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
