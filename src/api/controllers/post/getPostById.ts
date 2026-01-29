import { Request, Response } from 'express'
import { PostModel } from '~/api/models/post/postModel'

export const getPostDetail = async (req: Request, res: Response) => {
  const { slug } = req.params
  const post = await PostModel.findOne({ slug }).populate('catalog').lean()

  if (!post) {
    res.status(404).json({ message: 'Post not found' })
    return
  }

  res.json(post)
}
