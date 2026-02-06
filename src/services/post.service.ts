import slugify from 'slugify'
import { PostCategoryModel } from '~/api/models/post/postCategoryModel'
import { PostModel } from '~/api/models/post/postModel'

interface CreateFromCrawlerInput {
  title: string
  content: string
  image?: string
  source: string
  sourceName?: string
  catalogSlug: string
}

export class PostService {
  static async existsBySource(source: string): Promise<boolean> {
    const existed = await PostModel.exists({ source })
    return Boolean(existed)
  }

  static async createFromCrawler(input: CreateFromCrawlerInput) {
    /** 1. Validate tối thiểu */
    if (!input.title || !input.content || !input.catalogSlug) {
      throw new Error('Invalid crawler payload')
    }

    /** 2. Slug bài viết */
    const slug = slugify(input.title, {
      lower: true,
      strict: true,
      trim: true
    })

    const existedSlug = await PostModel.exists({ slug })
    if (existedSlug) {
      console.log(`[CRAWLER] Skip existed post: ${slug}`)
      return null
    }

    /** 3. Find or create category (QUAN TRỌNG) */
    let category = await PostCategoryModel.findOne({
      slug: input.catalogSlug
    })

    if (!category) {
      try {
        category = await PostCategoryModel.create({
          name: input.sourceName || input.catalogSlug,
          slug: input.catalogSlug,
          description: `Auto created by crawler`
        })

        console.log(`[CRAWLER] Auto created category: ${input.catalogSlug}`)
      } catch {
        // chống race-condition khi crawl song song
        category = await PostCategoryModel.findOne({
          slug: input.catalogSlug
        })
      }
    }

    if (!category) {
      throw new Error('Cannot resolve post category')
    }

    /** 4. Tạo bài viết */
    const post = new PostModel({
      title: input.title,
      slug,
      content: input.content,
      image: input.image,
      source: input.source,
      catalog: category._id,
      published: false
    })

    console.log(`[CRAWLER] Saved post: ${input.title}`)

    return post.save()
  }
}
