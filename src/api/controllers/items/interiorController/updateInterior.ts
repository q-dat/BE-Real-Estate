import { Request, Response } from 'express'
import InteriorModel from '~/api/models/interior/interiorModel'
import { uploadImageToCloudinary } from '~/common/uploadImageToCloudinary'

export const updateInterior = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, category, images, thumbnails, status, description } = req.body

    const files = req.files as { [fieldname: string]: Express.Multer.File[] }
    const imageFiles = files?.['images'] || []
    const thumbnailsFiles = files?.['thumbnails'] || []

    const updateData: Record<string, unknown> = {
      name,
      category,
      images,
      thumbnails,
      status,
      description
    }

    // Nếu có ảnh chính mới → upload
    if (imageFiles.length > 0) {
      const uploaded = await uploadImageToCloudinary(imageFiles[0].path)
      updateData.images = uploaded
    }

    // Nếu có thumbnails mới → upload
    if (thumbnailsFiles.length > 0) {
      const uploadedThumbs = await Promise.all(thumbnailsFiles.map((f) => uploadImageToCloudinary(f.path)))
      updateData.thumbnails = uploadedThumbs
    }

    const updated = await InteriorModel.findByIdAndUpdate(req.params.id, updateData, {
      new: true
    })

    if (!updated) {
      res.status(404).json({ message: 'Không tìm thấy nội thất!' })
      return
    }

    res.status(200).json({
      message: 'Cập nhật nội thất thành công!',
      data: updated
    })
  } catch (error: unknown) {
    const err = error as Error
    res.status(500).json({ message: 'Lỗi máy chủ!', error: err.message })
  }
}
