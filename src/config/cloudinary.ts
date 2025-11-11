import dotenv from 'dotenv'
import { v2 as cloudinary } from 'cloudinary'
import { CloudinaryStorage } from 'multer-storage-cloudinary'
import multer, { FileFilterCallback } from 'multer'
import { Request } from 'express'

dotenv.config()

/**
 * Cấu hình Cloudinary
 */
cloudinary.config({
  cloud_name: 'cloud7teck',
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
})

/**
 * Cấu hình Cloudinary Storage
 */
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'products',
    format: async (req: Request, file: Express.Multer.File): Promise<string> => {
      const extension = file.originalname.split('.').pop()?.toLowerCase()
      if (['jpg', 'jpeg', 'png', 'webp'].includes(extension || '')) {
        return extension!
      }
      throw new Error('Định dạng tập tin không hợp lệ — chỉ chấp nhận JPG, JPEG, PNG, WEBP')
    },
    public_id: (req: Request, file: Express.Multer.File): string => file.originalname.split('.')[0]
  } as Record<string, unknown> // Ép kiểu tránh TS2353
})

/**
 * Cấu hình Multer Upload
 */
const uploadCloud = multer({
  storage,
  limits: {
    fileSize: 6 * 1024 * 1024 // 6MB
  },
  fileFilter: (_req: Request, file: Express.Multer.File, cb: FileFilterCallback): void => {
    const allowed = /jpg|jpeg|png|webp/i
    const ext = file.originalname.split('.').pop()
    const mime = file.mimetype

    if (ext && allowed.test(ext) && allowed.test(mime)) {
      cb(null, true)
    } else {
      cb(new Error('Chỉ được phép tải lên hình ảnh (JPG, JPEG, PNG, WEBP)'))
    }
  }
})

export default uploadCloud
