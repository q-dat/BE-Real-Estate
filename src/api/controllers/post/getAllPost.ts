import { Request, Response } from 'express'
import { PostModel } from '~/api/models/post/postModel'

export const getPosts = async (req: Request, res: Response) => {
  try {
    const { catalog, published } = req.query

    const filter: Record<string, unknown> = {}
    if (catalog) filter.catalog = catalog
    if (published !== undefined) filter.published = published === 'true'

    const posts = await PostModel.find(filter).populate('catalog', 'name slug').sort({ createdAt: -1 }).lean()

    res.status(200).json({
      message: posts.length ? 'Lấy danh sách bài viết thành công' : 'Không có bài viết phù hợp',
      count: posts.length,
      visibleCount: posts.length,
      posts
    })
  } catch (error) {
    res.status(500).json({ message: 'Lỗi máy chủ', error })
  }
}
