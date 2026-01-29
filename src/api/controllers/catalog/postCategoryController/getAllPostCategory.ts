import { Request, Response } from 'express'
import { PostCategoryModel } from '~/api/models/post/postCategoryModel'

export const getAllPostCategory = async (_req: Request, res: Response) => {
  try {
    const catalogs = await PostCategoryModel.find().lean()
    res.json(catalogs)
  } catch (error) {
    res.status(500).json({ message: 'Lỗi máy chủ', error })
  }
}
