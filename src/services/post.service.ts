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
    /** Kiểm tra dữ liệu đầu vào tối thiểu */
    if (!input.title || !input.content || !input.catalogSlug) {
      throw new Error('Dữ liệu crawler không hợp lệ')
    }

    /** Tạo slug cho bài viết */
    const slug = slugify(input.title, {
      lower: true,
      strict: true,
      trim: true,
      locale: 'vi'
    })

    const existedSlug = await PostModel.exists({ slug })
    if (existedSlug) {
      console.log(`[CRAWLER] Bỏ qua bài viết đã tồn tại theo slug: ${slug}`)
      return null
    }

    /** Tìm hoặc tự động tạo danh mục bài viết */
    let category = await PostCategoryModel.findOne({
      slug: input.catalogSlug
    })

    if (!category) {
      try {
        category = await PostCategoryModel.create({
          name: input.sourceName || input.catalogSlug,
          slug: input.catalogSlug,
          description: 'Tự động tạo bởi crawler'
        })

        console.log(`[CRAWLER] Đã tự động tạo danh mục: ${input.catalogSlug}`)
      } catch {
        // Tránh race-condition khi crawler chạy song song
        category = await PostCategoryModel.findOne({
          slug: input.catalogSlug
        })
      }
    }

    if (!category) {
      throw new Error('Không thể xác định danh mục bài viết')
    }

    /** Tạo bài viết mới */
    const post = new PostModel({
      title: input.title,
      slug,
      content: input.content,
      image: input.image,
      source: input.source,
      catalog: category._id,
      published: false
    })

    console.log(`[CRAWLER] Lưu bài viết thành công: ${input.title}`)

    return post.save()
  }
}
