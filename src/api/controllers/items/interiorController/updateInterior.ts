import { Request, Response } from 'express'
import InteriorModel from '~/api/models/interior/interiorModel'
import { uploadImageToCloudinary } from '~/common/uploadImageToCloudinary'

export const updateInterior = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, status, description } = req.body

     const files = req.files as { [fieldname: string]: Express.Multer.File[] }
    const imagesFiles = files?.['images'] || []

    const updateData: Record<string, any> = {
         name, status, description 
    }
      // Nếu có hình ảnh mới, upload và gán lại
        if (imagesFiles.length > 0) {
          const imageUrls = await Promise.all(imagesFiles.map((file) => uploadImageToCloudinary(file.path)))
          updateData.images = imageUrls
        }
   
    // Thực hiện cập nhật trong MongoDB
    const updatedPost = await InteriorModel.findByIdAndUpdate(req.params.id, updateData, { new: true })

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
