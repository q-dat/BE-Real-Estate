import dotenv from 'dotenv'
import { v2 as cloudinary } from 'cloudinary'
import multerStorageCloudinary from 'multer-storage-cloudinary'
import multer, { FileFilterCallback } from 'multer'
import { Request } from 'express'

dotenv.config()

const { CloudinaryStorage } = multerStorageCloudinary

cloudinary.config({
  cloud_name: 'cloud7teck',
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
})

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'products',
    format: async (_req: Request, file: Express.Multer.File): Promise<string> => {
      const ext = file.originalname.split('.').pop()?.toLowerCase()
      if (!ext || !['jpg', 'jpeg', 'png', 'webp'].includes(ext)) {
        throw new Error('Định dạng tập tin không hợp lệ')
      }
      return ext
    },
    public_id: (_req: Request, file: Express.Multer.File): string => file.originalname.split('.')[0]
  }
})

const uploadCloud = multer({
  storage,
  limits: { fileSize: 6 * 1024 * 1024 }, //6MB
  fileFilter: (_req, file, cb: FileFilterCallback): void => {
    const allowed = /jpg|jpeg|png|webp/i
    const ext = file.originalname.split('.').pop() ?? ''
    if (allowed.test(ext) && allowed.test(file.mimetype)) {
      cb(null, true)
    } else {
      cb(new Error('Chỉ được phép tải lên hình ảnh'))
    }
  }
})

export default uploadCloud
