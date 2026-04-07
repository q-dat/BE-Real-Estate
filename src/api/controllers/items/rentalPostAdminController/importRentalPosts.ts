import { Request, Response } from 'express'
import RentalPostAdminModel from '~/api/models/rental/rentalPostAdminModel'
import RentalCategoryModel from '~/api/models/rental/rentalCategoryModel'

interface BulkImportRentalItem {
  code?: string
  images: string[]
  title: string
  description: string

  categoryName: string

  propertyType?: string
  locationType?: string
  direction?: string

  price: number
  priceUnit: string
  pricePerM2?: number

  area: number
  frontageWidth?: string
  lotDepth?: string
  backSize?: string

  floorNumber?: number
  bedroomNumber?: number
  toiletNumber?: number

  legalStatus?: string
  furnitureStatus?: string

  province: string
  district: string
  ward?: string
  address: string

  amenities?: string

  youtubeLink?: string
  videoTitle?: string
  videoDescription?: string

  postType: 'basic' | 'vip1' | 'vip2' | 'vip3' | 'highlight'
  status: 'active' | 'pending' | 'expired' | 'hidden'

  author: string // ObjectId dạng string

  adminNote?: string
  adminImages?: string[]

  postedAt?: Date
  expiredAt?: Date
}

export const importRentalPosts = async (req: Request, res: Response) => {
  try {
    const items: BulkImportRentalItem[] = req.body

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: 'Dữ liệu không hợp lệ hoặc rỗng' })
    }

    const results = {
      success: 0,
      updated: 0,
      failed: 0,
      errors: [] as string[]
    }

    const categoryCache = new Map<string, string>()

    for (const item of items) {
      try {
        let categoryId = categoryCache.get(item.categoryName)

        if (!categoryId) {
          const category = await RentalCategoryModel.findOne({
            name: item.categoryName
          }).lean()

          if (!category) {
            results.failed++
            results.errors.push(`Không tìm thấy category: ${item.categoryName}`)
            continue
          }

          categoryId = category._id.toString()
          categoryCache.set(item.categoryName, categoryId)
        }

        let existingPost = null

        if (item.code) {
          existingPost = await RentalPostAdminModel.findOne({ code: item.code })
        } else {
          existingPost = await RentalPostAdminModel.findOne({
            title: item.title,
            address: item.address
          })
        }

        const baseData = {
          title: item.title,
          description: item.description,
          category: categoryId,

          propertyType: item.propertyType,
          locationType: item.locationType,
          direction: item.direction,

          price: item.price,
          priceUnit: item.priceUnit,
          pricePerM2: item.pricePerM2,

          area: item.area,
          frontageWidth: item.frontageWidth,
          lotDepth: item.lotDepth,
          backSize: item.backSize,

          floorNumber: item.floorNumber,
          bedroomNumber: item.bedroomNumber,
          toiletNumber: item.toiletNumber,

          legalStatus: item.legalStatus,
          furnitureStatus: item.furnitureStatus,

          province: item.province,
          district: item.district,
          ward: item.ward,
          address: item.address,

          amenities: item.amenities,

          youtubeLink: item.youtubeLink,
          videoTitle: item.videoTitle,
          videoDescription: item.videoDescription,

          postType: item.postType,
          status: item.status,

          author: item.author,
          adminNote: item.adminNote,

          postedAt: item.postedAt,
          expiredAt: item.expiredAt
        }

        if (existingPost) {
          const updateData = {
            ...baseData,
            updatedAt: new Date()
          }

          await RentalPostAdminModel.findByIdAndUpdate(existingPost._id, updateData)

          results.updated++
        } else {
          const newPost = new RentalPostAdminModel({
            ...baseData,
            images: item.images || [],
            adminImages: item.adminImages || []
          })

          newPost.code = newPost._id.toString().slice(-7).toUpperCase()

          await newPost.save()

          results.success++
        }
      } catch (err: any) {
        results.failed++
        results.errors.push(`Lỗi tại: ${item.title} - ${err.message}`)
      }
    }

    res.status(200).json({
      message: 'Bulk import hoàn tất!',
      ...results
    })
  } catch (error: any) {
    res.status(500).json({
      message: 'Lỗi server',
      error: error.message
    })
  }
}
