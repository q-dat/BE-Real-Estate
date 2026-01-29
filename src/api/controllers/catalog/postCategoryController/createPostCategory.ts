import { Request, Response } from 'express'
import { PostCategoryModel } from '~/api/models/post/postCategoryModel'

export const createPostCategory = async (req: Request, res: Response) => {
  try {
    const postCategory = await PostCategoryModel.create(req.body)
    res.status(201).json(postCategory)
  } catch (error) {
    res.status(500).json({ message: 'Lỗi máy chủ', error })
  }
}
