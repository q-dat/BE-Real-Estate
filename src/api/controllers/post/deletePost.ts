import { Request, Response } from 'express'
import { v2 as cloudinary } from 'cloudinary'
import { PostModel } from '~/api/models/post/postModel'

export const deletePost = async (req: Request, res: Response): Promise<void> => {
  try {
    const deletedPost = await PostModel.findByIdAndDelete(req.params.id)

    if (!deletedPost) {
      res.status(404).json({ message: 'Bài viết không tồn tại!' })
      return
    }

    /** -------------------- XÓA ẢNH TRÊN CLOUDINARY -------------------- */
    if (deletedPost.image) {
      const publicId = deletedPost.image.split('/').pop()?.split('.')[0]

      if (publicId) {
        try {
          await cloudinary.uploader.destroy(publicId)
        } catch (err) {
          console.warn(`Không thể xóa ảnh: ${publicId}`, err)
        }
      }
    }

    res.status(200).json({
      message: 'Bài viết đã được xóa thành công!',
      deletedPost
    })
  } catch (error: any) {
    res.status(500).json({ message: 'Lỗi máy chủ!', error: error.message })
  }
}
