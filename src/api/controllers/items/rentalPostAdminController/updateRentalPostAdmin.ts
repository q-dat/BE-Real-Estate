import { Request, Response } from 'express'
import RentalPostAdminModel from '~/api/models/rental/rentalPostAdminModel'
import { uploadImageToCloudinary } from '~/common/uploadImageToCloudinary'

export const updateRentalPostAdmin = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      code,
      images,
      adminImages,
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

    // Lấy file upload (nếu có)
    const files = req.files as { [fieldname: string]: Express.Multer.File[] }
    const imagesFiles = files?.['images'] || []
    const adminImagesFiles = files?.['adminImages'] || []

    // Object lưu field cần cập nhật
    const updateData: Record<string, any> = {
      code,
      images,
      adminImages,
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
    }

    // Nếu có hình ảnh mới, upload và gán lại
    if (imagesFiles.length > 0) {
      const imageUrls = await Promise.all(imagesFiles.map((file) => uploadImageToCloudinary(file.path)))
      updateData.images = imageUrls
    }

    // Nếu có adminImages mới, upload và gán lại
    if (adminImagesFiles.length > 0) {
      const adminImagesUrls = await Promise.all(adminImagesFiles.map((file) => uploadImageToCloudinary(file.path)))
      updateData.adminImages = adminImagesUrls
    }

    // Thực hiện cập nhật trong MongoDB
    const updatedPost = await RentalPostAdminModel.findByIdAndUpdate(req.params.id, updateData, { new: true })

    if (!updatedPost) {
      res.status(404).json({ message: 'Bài đăng không tồn tại!' })
      return
    }

    res.status(200).json({
      message: 'Cập nhật bài đăng thành công!',
      data: updatedPost
    })
  } catch (error: any) {
    res.status(500).json({ message: 'Lỗi máy chủ!', error: error.message })
  }
}
