import { Request, Response } from 'express'
import InteriorModel from '~/api/models/interior/interiorModel'
import { uploadImageToCloudinary } from '~/common/uploadImageToCloudinary'

export const createInterior = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, status, description } = req.body

    const files = req.files as { [fieldname: string]: Express.Multer.File[] }
    const imageFiles = files?.['images'] || []
    const thumbnailFiles = files?.['thumbnail'] || []

    if (!imageFiles.length) {
      res.status(400).json({ message: 'Ảnh chính là bắt buộc.' })
      return
    }

    // Upload ảnh chính (chỉ 1 ảnh)
    const mainImageUrl = await uploadImageToCloudinary(imageFiles[0].path)

    // Upload thumbnail (nếu có)
    const thumbnailUrls = await Promise.all(
      thumbnailFiles.map((f) => uploadImageToCloudinary(f.path))
    )

    const interior = new InteriorModel({
      name,
      images: mainImageUrl,
      thumbnail: thumbnailUrls,
      status,
      description
    })

    const saved = await interior.save()

    res.status(201).json({
      message: 'Tạo nội thất thành công!',
      data: saved
    })
  } catch (error: unknown) {
    const err = error as Error
    res.status(500).json({ message: 'Lỗi máy chủ!', error: err.message })
  }
}
