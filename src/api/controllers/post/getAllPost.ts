import { Request, Response } from 'express'
import { PostModel } from '~/api/models/post/postModel'

export const getPosts = async (req: Request, res: Response) => {
  try {
    const { catalog, published } = req.query

    const filters: Record<string, unknown> = {}

    if (catalog) filters.catalog = catalog
    if (published !== undefined) filters.published = published === 'true'

    const posts = await PostModel.find(filters).populate('catalog', '-createdAt -updatedAt -__v').sort({ createdAt: -1 }).lean()
    const count = await PostModel.countDocuments(filters)

    res.status(200).json({
      message: posts.length ? 'Lấy danh sách bài viết thành công' : 'Không có bài viết phù hợp',
      count,
      visibleCount: posts.length,
      posts
    })
  } catch (error: any) {
    res.status(500).json({
      message: 'Lỗi máy chủ',
      error: error.message
    })
  }
}
