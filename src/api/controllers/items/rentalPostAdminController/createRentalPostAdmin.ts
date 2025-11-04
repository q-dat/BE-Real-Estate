import { Request, Response } from 'express'
import RentalPostAdminModel from '~/api/models/rentalPostAdminModel'
import { uploadImageToCloudinary } from '~/common/uploadImageToCloudinary'

export const createRentalPostAdmin = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      phoneNumbers,
      zaloLink,
      title,
      description,
      category,
      price,
      priceUnit,
      area,
      length,
      width,
      province,
      district,
      ward,
      address,
      amenities,
      youtubeLink,
      videoTitle,
      videoDescription,
      status,
      author,
      adminNote,
      postedAt,
      expiredAt
    } = req.body

    const files = req.files as { [fieldname: string]: Express.Multer.File[] }
    const imageFiles = files?.['images'] || []

    if (!imageFiles.length) {
      res.status(400).json({ message: 'Hình ảnh là bắt buộc.' })
      return
    }

    const imageUrls = await Promise.all(imageFiles.map((f) => uploadImageToCloudinary(f.path)))

    // Tạo document trước để có _id
    const tempPost = new RentalPostAdminModel({
      images: imageUrls,
      phoneNumbers,
      zaloLink,
      title,
      description,
      category,
      price,
      priceUnit,
      area,
      length,
      width,
      province,
      district,
      ward,
      address,
      amenities,
      youtubeLink,
      videoTitle,
      videoDescription,
      status,
      author,
      adminNote,
      postedAt,
      expiredAt
    })

    // Sinh code từ 7 ký tự cuối của _id
    tempPost.code = tempPost._id.toString().slice(-7).toUpperCase()

    const saved = await tempPost.save()

    res.status(201).json({
      message: 'Tạo bài đăng thành công!',
      data: saved
    })
  } catch (error: any) {
    res.status(500).json({ message: 'Lỗi máy chủ!', error: error.message })
  }
}
