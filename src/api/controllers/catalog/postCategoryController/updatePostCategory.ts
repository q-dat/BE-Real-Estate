import { Request, Response } from 'express'
import { PostCategoryModel } from '~/api/models/post/postCategoryModel'

export const updatePostCategory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const postCategory = await PostCategoryModel.findByIdAndUpdate(id, req.body, { new: true })
    res.json(postCategory)
  } catch (error) {
    res.status(500).json({ message: 'Lỗi máy chủ', error })
  }
}
