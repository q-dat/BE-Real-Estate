import { Request, Response } from 'express'
import { IPost, PostModel } from '~/api/models/post/postModel'
import { uploadImageToCloudinary } from '~/common/uploadImageToCloudinary'
import slugify from 'slugify'

export const createPost = async (req: Request, res: Response): Promise<void> => {
  try {
    const { title, content, source, catalog, published = false } = req.body as IPost

    const files = req.files as { [fieldname: string]: Express.Multer.File[] }
    const avatarUrl = files?.['image']?.[0]

    if (!avatarUrl) {
      res.status(400).json({ message: 'Hình ảnh là bắt buộc.' })
      return
    }

    const imageUrl = await uploadImageToCloudinary(avatarUrl.path)

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

    const post = new PostModel({
      image: imageUrl,
      title,
      slug,
      content,
      source,
      catalog,
      published
    })

    const saved = await post.save()

    res.status(201).json({
      message: 'Tạo bài viết thành công!',
      data: saved
    })
  } catch (error: any) {
    res.status(500).json({ message: 'Lỗi máy chủ!', error: error.message })
  }
}
