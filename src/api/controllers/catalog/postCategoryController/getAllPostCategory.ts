import { Request, Response } from 'express'
import { PostCategoryModel } from '~/api/models/post/postCategoryModel'

export const getAllPostCategory = async (_req: Request, res: Response) => {
  try {
    const postCategories = await PostCategoryModel.find().lean()
    const count = await PostCategoryModel.countDocuments()

    res.status(200).json({
      message: postCategories.length ? 'Lấy danh sách danh mục bài viết thành công' : 'Không có danh mục bài viết phù hợp',
      count: count,
      visibleCount: postCategories.length,
      postCategories
    })
  } catch (error: any) {
    res.status(500).json({
      message: 'Lỗi máy chủ',
      error: error.message
    })
  }
}
