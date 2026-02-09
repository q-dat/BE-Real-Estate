import { Request, Response } from 'express'
import RealEstateProjectModel from '~/api/models/realEstateProject/realEstateProjectModel'
import { uploadImageToCloudinary } from '~/common/uploadImageToCloudinary'

export const updateRealEstateProject = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      name,
      slug,
      introduction,
      description,
      article,
      pricing,
      status,
      projectType,
      area,
      investor,
      partners,
      province,
      district,
      ward,
      address,
      amenities,
      hotline,
      email,
      zalo,
      message,
      images,
      thumbnails
    } = req.body

    const files = req.files as { [fieldname: string]: Express.Multer.File[] }
    const imageFiles = files?.['images'] || []
    const thumbnailsFiles = files?.['thumbnails'] || []

    const updateData: Record<string, unknown> = {
      name,
      slug,
      introduction,
      description,
      article,
      pricing,
      status,
      projectType,
      area,
      investor,
      partners,
      province,
      district,
      ward,
      address,
      amenities,
      hotline,
      email,
      zalo,
      message,
      images,
      thumbnails
    }

    // Nếu có ảnh chính mới → upload
    if (imageFiles.length > 0) {
      const uploaded = await uploadImageToCloudinary(imageFiles[0].buffer)
      updateData.images = uploaded
    }

    // Nếu có thumbnails mới → upload
    if (thumbnailsFiles.length > 0) {
      const uploadedThumbs = await Promise.all(thumbnailsFiles.map((file) => uploadImageToCloudinary(file.buffer)))
      updateData.thumbnails = uploadedThumbs
    }

    const updated = await RealEstateProjectModel.findByIdAndUpdate(req.params.id, updateData, { new: true })

    if (!updated) {
      res.status(404).json({ message: 'Không tìm thấy dự án!' })
      return
    }

    res.status(200).json({
      message: 'Cập nhật dự án thành công!',
      data: updated
    })
  } catch (error: unknown) {
    const err = error as Error
    res.status(500).json({
      message: 'Lỗi máy chủ!',
      error: err.message
    })
  }
}
