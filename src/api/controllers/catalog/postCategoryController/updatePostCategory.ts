import { Request, Response } from 'express'
import { PostCategoryModel } from '~/api/models/post/postCategoryModel'

export const updatePostCategory = async (req: Request, res: Response) => {
  const { id } = req.params
  const postCategory = await PostCategoryModel.findByIdAndUpdate(id, req.body, { new: true })
  res.json(postCategory)
}
