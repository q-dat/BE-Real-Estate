import { Request, Response } from 'express'
import { PostCategoryModel } from '~/api/models/post/postCategoryModel'

export const getAllPostCategory = async (_req: Request, res: Response) => {
  const catalogs = await PostCategoryModel.find().lean()
  res.json(catalogs)
}
