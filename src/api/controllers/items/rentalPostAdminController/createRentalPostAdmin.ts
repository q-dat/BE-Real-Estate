import { Request, Response } from 'express'
import RentalPostAdminModel from '~/api/models/rentalPostAdminModel'
import { uploadImageToCloudinary } from '~/common/uploadImageToCloudinary'

export const createRentalPostAdmin = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      code,
      images,
      title,
      description,
      category,
      price,
      priceUnit,
      area,
      province,
      district,
      ward,
      address,
      coordinates,
      amenities,
      youtubeLink,
      videoTitle,
      videoDescription,
      status,
      author,
      adminNote
    } = req.body

    const files = req.files as { [fieldname: string]: Express.Multer.File[] }
    const imagesFiles = files?.['images'] || []

    if (!imagesFiles || imagesFiles.length === 0) {
      res.status(400).json({ message: 'Hình ảnh là bắt buộc.' })
      return
    }

    const imageUrls = await Promise.all(imagesFiles.map((file) => uploadImageToCloudinary(file.path)))

    const newRentalPost = new RentalPostAdminModel({
      code,
      images,
      title,
      description,
      category,
      price,
      priceUnit,
      area,
      province,
      district,
      ward,
      address,
      coordinates,
      amenities,
      youtubeLink,
      videoTitle,
      videoDescription,
      status,
      author,
      adminNote
    })

    const savedRentalPost = await newRentalPost.save()

    res.status(201).json({
      message: 'Tạo bài đăng bài đăng thành công!',
      data: savedRentalPost
    })
  } catch (error: any) {
    res.status(500).json({ message: 'Lỗi máy chủ!', error: error.message })
  }
}
