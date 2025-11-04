import { Request, Response } from 'express'
import { uploadImageToCloudinary } from '~/common/uploadImageToCloudinary'
import RentalPostModel from '~/api/models/rentalPostModel'

export const createRentalPost = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      code,
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
      amenities,
      youtubeLink,
      videoTitle,
      videoDescription,
      postType,
      fastRent,
      status,
      isApproved,
      postPackage,
      autoBoost,
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

    const newRentalPost = new RentalPostModel({
      code,
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
      images: imageUrls,
      amenities,
      youtubeLink,
      videoTitle,
      videoDescription,
      postType,
      fastRent,
      status,
      isApproved,
      postPackage,
      autoBoost,
      author,
      adminNote
    })

   const savedRentalPost = await newRentalPost.save()

    res.status(201).json({
      message: 'Tạo bài đăng thành công!',
      data: savedRentalPost
    })
  } catch (error: any) {
    res.status(500).json({ message: 'Lỗi máy chủ!', error: error.message })
  }
}
