import { Request, Response } from 'express'
import slugify from 'slugify'
import { PostCategoryModel } from '~/api/models/post/postCategoryModel'

export const createPostCategory = async (req: Request, res: Response) => {
  try {
    const { name, description } = req.body

    if (!name) {
      res.status(400).json({ message: 'Tên danh mục là bắt buộc.' })
      return
    }

    const slug = slugify(name, {
      lower: true,
      strict: true,
      trim: true,
      locale: 'vi'
    })

    const existedSlug = await PostCategoryModel.exists({ slug })
    if (existedSlug) {
      res.status(409).json({ message: 'Danh mục đã tồn tại.' })
      return
    }

    const postCategory = await PostCategoryModel.create({
      name,
      slug,
      description
    })

    res.status(201).json({
      message: 'Tạo danh mục bài viết thành công.',
      postCategory: postCategory
    })
  } catch (error: any) {
    res.status(500).json({ message: 'Lỗi máy chủ', error: error.message })
  }
}
