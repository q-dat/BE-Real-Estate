import { Request, Response } from 'express'
import { PostModel } from '~/api/models/post/postModel'

export const createPost = async (req: Request, res: Response) => {
  const post = await PostModel.create(req.body)
  res.status(201).json(post)
}
