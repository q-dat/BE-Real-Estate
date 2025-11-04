import { Request, Response } from 'express'
import { uploadImageToCloudinary } from '~/common/uploadImageToCloudinary'
import RentalPostModel from '~/api/models/rentalPostModel'

export const updateRentalPost = async (req: Request, res: Response): Promise<void> => {
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

    // Lấy file upload (nếu có)
    const files = req.files as { [fieldname: string]: Express.Multer.File[] }
    const imagesFiles = files?.['images'] || []

    // Object lưu field cần cập nhật
    const updateData: Record<string, any> = {
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
    }

    // Nếu có hình ảnh mới, upload và gán lại
    if (imagesFiles.length > 0) {
      const imageUrls = await Promise.all(imagesFiles.map((file) => uploadImageToCloudinary(file.path)))
      updateData.images = imageUrls
    }

    // Thực hiện cập nhật trong MongoDB
    const updatedPost = await RentalPostModel.findByIdAndUpdate(req.params.id, updateData, { new: true })

    if (!updatedPost) {
      res.status(404).json({ message: 'Bài đăng không tồn tại!'})
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
