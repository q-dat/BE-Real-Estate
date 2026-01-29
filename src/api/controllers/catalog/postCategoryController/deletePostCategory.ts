import { Request, Response } from 'express'
import { PostCategoryModel } from '~/api/models/post/postCategoryModel'

export const deletePostCategory = async (req: Request, res: Response) => {
  const { id } = req.params
  await PostCategoryModel.findByIdAndDelete(id)
  res.status(204).end()
}
