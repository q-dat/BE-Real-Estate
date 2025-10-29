import { Request, Response } from 'express'
import RentalPostModel from '~/api/models/rentalPostModel'
import { v2 as cloudinary } from 'cloudinary'

export const deleteRentalPost = async (req: Request, res: Response): Promise<void> => {
  try {
    const deletedPost = await RentalPostModel.findByIdAndDelete(req.params.id)

    if (!deletedPost) {
      res.status(404).json({ message: 'Bài đăng không tồn tại!' })
      return
    }

    /** -------------------- XÓA ẢNH TRÊN CLOUDINARY -------------------- */
    if (deletedPost.images && deletedPost.images.length > 0) {
      await Promise.all(
        deletedPost.images.map(async (url: string) => {
          const publicId = url.split('/').pop()?.split('.')[0]
          if (publicId) {
            try {
              await cloudinary.uploader.destroy(publicId)
            } catch (err) {
              console.warn(`Không thể xóa ảnh: ${publicId}`, err)
            }
          }
        })
      )
    }

    res.status(200).json({
      message: 'Bài đăng đã được xóa thành công!',
      deletedPost
    })
  } catch (error: any) {
    res.status(500).json({ message: 'Lỗi máy chủ!', error: error.message })
  }
}
