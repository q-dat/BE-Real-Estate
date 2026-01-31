import { Request, Response } from 'express'
import { PostCategoryModel } from '~/api/models/post/postCategoryModel'

export const deletePostCategory = async (req: Request, res: Response) => {
  try {
    const deletedPost = await PostCategoryModel.findByIdAndDelete(req.params.id)

    if (!deletedPost) {
      res.status(404).json({ message: 'Bài viết không tồn tại!' })
      return
    }

    res.status(200).json({
      message: 'Bài viết đã được xóa thành công!',
      deletedPost
    })
  } catch (error: any) {
    res.status(500).json({ message: 'Lỗi máy chủ!', error: error.message })
  }
}
