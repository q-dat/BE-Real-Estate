import { Request, Response } from 'express'
import { PostModel } from '~/api/models/post/postModel'

export const deletePost = async (req: Request, res: Response) => {
  const { id } = req.params
  await PostModel.findByIdAndDelete(id)
  res.status(204).end()
}
