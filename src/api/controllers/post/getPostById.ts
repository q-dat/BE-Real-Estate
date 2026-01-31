import { Request, Response } from 'express'
import { PostModel } from '~/api/models/post/postModel'

export const getPostById = async (req: Request, res: Response) => {
  try {
    const post = await PostModel.findById(req.params.id).populate('catalog', '-createdAt -updatedAt -__v').sort({ createdAt: -1 }).lean()

    if (!post) {
      res.status(404).json({ message: 'Bài viết không tồn tại!' })
      return
    }

    res.setHeader('Cache-Control', 'public, max-age=0, s-maxage=3600, stale-while-revalidate=7200')

    res.status(200).json({
      message: 'Lấy bài viết theo id thành công!',
      post
    })
  } catch (error: any) {
    console.error('Lỗi trong getPostById:', error)
    res.status(500).json({ message: 'Lỗi máy chủ!', error: error.message })
  }
}
