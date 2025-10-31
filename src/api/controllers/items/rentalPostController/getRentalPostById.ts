import { Request, Response } from 'express'
import RentalPostModel from '~/api/models/rentalPostModel'

// GET By ID
export const getRentalPostById = async (req: Request, res: Response): Promise<void> => {
  try {
    const rentalPost = await RentalPostModel.findById(req.params.id)
      .populate({
        path: 'category',
        select: '-createdAt -updatedAt -__v'
      })
      .lean()

    if (!rentalPost) {
      res.status(404).json({ message: 'Bài đăng không tồn tại!' })
      return
    }

    const response = { message: 'Lấy bài đăng theo id thành công!', rentalPost }
    // await redis.setex(cacheKey, 3600, JSON.stringify(response))
    res.setHeader('Cache-Control', 'public, max-age=0, s-maxage=3600, stale-while-revalidate=7200')
    res.status(200).json(response)
  } catch (error: any) {
    console.error('Lỗi trong getRentalPostById:', error)
    res.status(500).json({ message: 'Lỗi máy chủ!', error: error.message })
  }
}
