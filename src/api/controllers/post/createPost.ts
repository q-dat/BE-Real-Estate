import { Request, Response } from 'express'
import { PostModel } from '~/api/models/post/postModel'
import { uploadImageToCloudinary } from '~/common/uploadImageToCloudinary'
import slugify from 'slugify'

interface CreatePostBody {
  title: string
  content: string
  catalog: string
  published?: boolean
}

export const createPost = async (req: Request, res: Response): Promise<void> => {
  try {
    const { title, content, catalog, published = false } = req.body as CreatePostBody

    if (!title || !content || !catalog) {
      res.status(400).json({ message: 'Thiếu dữ liệu bắt buộc.' })
      return
    }

    let avatarUrl: string | undefined

    const file = req.file
    if (file) {
      avatarUrl = await uploadImageToCloudinary(file.path)
    }

    const slug = slugify(title, {
      lower: true,
      strict: true,
      trim: true
    })

    const existedSlug = await PostModel.exists({ slug })
    if (existedSlug) {
      res.status(409).json({ message: 'Bài viết đã tồn tại.' })
      return
    }

    const post = await PostModel.create({
      image: avatarUrl,
      title,
      slug,
      content,
      catalog,
      published
    })

    res.status(201).json({
      message: 'Tạo bài viết thành công!',
      data: post
    })
  } catch (error) {
    res.status(500).json({
      message: 'Lỗi máy chủ.'
    })
  }
}
