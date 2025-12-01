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
      propertyType,
      locationType,
      direction,
      price,
      priceUnit,
      pricePerM2,
      area,
      length,
      width,
      backSize,
      floorNumber,
      bedroomNumber,
      toiletNumber,
      legalStatus,
      furnitureStatus,
      province,
      district,
      ward,
      address,
      amenities,
      youtubeLink,
      videoTitle,
      videoDescription,
      postType,
      status,
      author,
      adminNote,
      postedAt,
      expiredAt
    } = req.body

    const files = req.files as { [fieldname: string]: Express.Multer.File[] }
    const imageFiles = files?.['images'] || []
    const adminImageFiles = files?.['adminImage'] || []

    if (!imageFiles.length) {
      res.status(400).json({ message: 'Hình ảnh là bắt buộc.' })
      return
    }

    const imageUrls = await Promise.all(imageFiles.map((f) => uploadImageToCloudinary(f.path)))
    const adminImageUrls = await Promise.all(adminImageFiles.map((f) => uploadImageToCloudinary(f.path)))

    const tempPost = new RentalPostAdminModel({
      images: imageUrls,
      adminImage: adminImageUrls,
      phoneNumbers,
      zaloLink,
      title,
      description,
      category,
      propertyType,
      locationType,
      direction,
      price,
      priceUnit,
      pricePerM2,
      area,
      length,
      width,
      backSize,
      floorNumber,
      bedroomNumber,
      toiletNumber,
      legalStatus,
      furnitureStatus,
      province,
      district,
      ward,
      address,
      amenities,
      youtubeLink,
      videoTitle,
      videoDescription,
      postType,
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
