import { Request, Response } from 'express'
import { PostCategoryModel } from '~/api/models/post/postCategoryModel'

export const createPostCategory = async (req: Request, res: Response) => {
  const postCategory = await PostCategoryModel.create(req.body)
  res.status(201).json(postCategory)
}
