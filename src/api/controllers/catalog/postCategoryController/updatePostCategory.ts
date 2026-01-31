import { Request, Response } from 'express'
import { PostCategoryModel } from '~/api/models/post/postCategoryModel'

export const updatePostCategory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const updatedPostCategory = await PostCategoryModel.findByIdAndUpdate(id, req.body, { new: true })

    if (!updatedPostCategory) {
      res.status(404).json({ message: 'Danh mục bài viết không tồn tại!' })
      return
    }

    res.status(200).json({
      message: 'Cập nhật danh mục bài viết thành công!',
      postCategory: updatedPostCategory
    })
  } catch (error: any) {
    res.status(500).json({ message: 'Lỗi máy chủ!', error: error.message })
  }
}
