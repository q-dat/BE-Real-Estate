import { Request, Response } from 'express'
import { PostModel } from '~/api/models/post/postModel'

export const updatePost = async (req: Request, res: Response) => {
  const { id } = req.params
  const post = await PostModel.findByIdAndUpdate(id, req.body, { new: true })
  res.json(post)
}
