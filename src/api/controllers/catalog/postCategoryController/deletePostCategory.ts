import { Request, Response } from 'express'
import { PostCategoryModel } from '~/api/models/post/postCategoryModel'

export const deletePostCategory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    await PostCategoryModel.findByIdAndDelete(id)
    res.status(204).end()
  } catch (error) {
    res.status(500).json({ message: 'Lỗi máy chủ', error })
  }
}
