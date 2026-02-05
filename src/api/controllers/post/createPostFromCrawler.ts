import { Request, Response } from 'express'
import slugify from 'slugify'
import { PostModel } from '~/api/models/post/postModel'
import { PostCategoryModel } from '~/api/models/post/postCategoryModel'

export const createPostFromCrawler = async (req: Request, res: Response): Promise<void> => {
  try {
    const internalKey = req.headers['x-internal-key']
    if (internalKey !== process.env.CRAWLER_SECRET) {
      res.status(403).json({ message: 'Forbidden' })
      return
    }

    const { title, content, image, source, catalogSlug, sourceName } = req.body as {
      title: string
      content: string
      image?: string
      source: string
      catalogSlug: string
      sourceName: string
    }

    if (!title || !content || !catalogSlug) {
      res.status(400).json({ message: 'Invalid payload' })
      return
    }

    /** 1. Tìm hoặc tạo category */
    let category = await PostCategoryModel.findOne({ slug: catalogSlug })

    if (!category) {
      category = await PostCategoryModel.create({
        name: sourceName || catalogSlug,
        slug: catalogSlug,
        description: `Auto created by crawler from ${sourceName}`
      })

      console.log(`[CRAWLER] Auto created category: ${catalogSlug}`)
    }

    /** 2. Chống trùng bài */
    const slug = slugify(title, { lower: true, strict: true })
    const existed = await PostModel.exists({ slug })

    if (existed) {
      res.status(409).json({ message: 'Post existed' })
      return
    }

    /** 3. Tạo bài viết */
    const post = await PostModel.create({
      title,
      slug,
      content,
      image,
      source,
      catalog: category._id,
      published: false
    })

    console.log(`[CRAWLER] Saved post: ${title}`)

    res.status(201).json({ data: post })
  } catch (error: any) {
    console.error('[CRAWLER] createPostFromCrawler error', error)
    res.status(500).json({ message: error.message })
  }
}
