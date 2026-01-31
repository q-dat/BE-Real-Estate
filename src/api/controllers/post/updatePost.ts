import { Request, Response } from 'express'
import { PostModel } from '~/api/models/post/postModel'
import { uploadImageToCloudinary } from '~/common/uploadImageToCloudinary'

export const updatePost = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params
    const { title, content, catalog, published } = req.body

    // Lấy file upload (nếu có)
    const files = req.files as { [fieldname: string]: Express.Multer.File[] }
    const imageFile = files?.['image']?.[0]

    // Build object update
    const updateData: Partial<{
      title: string
      content: string
      catalog: string
      published: boolean
      image: string
      slug: string
    }> = {
      title,
      content,
      catalog,
      published
    }

    // Nếu có ảnh mới → upload và gán lại
    if (imageFile) {
      const imageUrl = await uploadImageToCloudinary(imageFile.path)
      updateData.image = imageUrl
    }

    // Nếu có title mới → cập nhật slug
    if (title) {
      updateData.slug = title
        ? require('slugify')(title, {
            lower: true,  
            strict: true,
            trim: true
          })
        : undefined
    }

    const updatedPost = await PostModel.findByIdAndUpdate(id, updateData, {
      new: true
    })

    if (!updatedPost) {
      res.status(404).json({ message: 'Bài viết không tồn tại!' })
      return
    }

    res.status(200).json({
      message: 'Cập nhật bài viết thành công!',
      post: updatedPost
    })
  } catch (error: any) {
    res.status(500).json({ message: 'Lỗi máy chủ!', error: error.message })
  }
}
