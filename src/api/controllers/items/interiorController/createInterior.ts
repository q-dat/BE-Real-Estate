import { Request, Response } from 'express'
import InteriorModel from '~/api/models/interior/interiorModel'
import { uploadImageToCloudinary } from '~/common/uploadImageToCloudinary'

export const createInterior = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, status, description } = req.body
    const files = req.files as { [fieldname: string]: Express.Multer.File[] }
    const imageFiles = files?.['images'] || []

    if (!imageFiles.length) {
      res.status(400).json({ message: 'Hình ảnh là bắt buộc.' })
      return
    }
    const imageUrls = await Promise.all(imageFiles.map((f) => uploadImageToCloudinary(f.path)))

    const tempPost = new InteriorModel({
      name,
      images: imageUrls,
      status,
      description
    })
    const saved = await tempPost.save()

    res.status(201).json({
      message: 'Tạo bài đăng thành công!',
      data: saved
    })
  } catch (error: any) {
    res.status(500).json({ message: 'Lỗi máy chủ!', error: error.message })
  }
}
