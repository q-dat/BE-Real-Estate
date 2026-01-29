import { Request, Response } from 'express'
import { PostModel } from '~/api/models/post/postModel'

export const getPosts = async (req: Request, res: Response) => {
  const { catalog, published } = req.query

  const filter: Record<string, unknown> = {}
  if (catalog) filter.catalog = catalog
  if (published !== undefined) filter.published = published === 'true'

  const posts = await PostModel.find(filter).populate('catalog', 'name slug').sort({ createdAt: -1 }).lean()

  res.json(posts)
}
