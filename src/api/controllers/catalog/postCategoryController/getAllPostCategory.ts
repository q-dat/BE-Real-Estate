import { Request, Response } from 'express'
import { PostCategoryModel } from '~/api/models/post/postCategoryModel'

export const getAllPostCategory = async (_req: Request, res: Response) => {
  try {
    const categories = await PostCategoryModel.find().lean()
    const count = await PostCategoryModel.countDocuments()

    res.status(200).json({
      message: categories.length ? 'Lấy danh sách danh mục bài viết thành công' : 'Không có danh mục bài viết phù hợp',
      count: count,
      visibleCount: categories.length,
      categories
    })
  } catch (error) {
    res.status(500).json({ message: 'Lỗi máy chủ', error })
  }
}
