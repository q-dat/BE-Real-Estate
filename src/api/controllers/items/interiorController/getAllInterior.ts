import { Request, Response } from 'express'
import mongoose from 'mongoose'
import InteriorModel from '~/api/models/interior/interiorModel'

export const getAllInterior = async (req: Request, res: Response): Promise<void> => {
  try {
    const { catalogID, categoryCode } = req.query
    const filters: Record<string, unknown> = {}

    const categoryMatch: Record<string, unknown> = {}

    if (catalogID) {
      categoryMatch['category._id'] = new mongoose.Types.ObjectId(String(catalogID))
    }

    if (categoryCode) {
      categoryMatch['category.categoryCode'] = Number(categoryCode)
    }

    const interiors = await InteriorModel.aggregate([
      {
        $lookup: {
          from: 'interior_categories',
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

    const count = await InteriorModel.countDocuments()

    res.status(200).json({
      message: interiors.length ? 'Lấy danh sách thành công!' : 'Không có danh sách nào!',
      count,
      visibleCount: interiors.length,
      interiors
    })
  } catch (error: any) {
    res.status(500).json({ message: 'Lỗi máy chủ!', error: error.message })
  }
}
