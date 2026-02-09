import dotenv from 'dotenv'
import { v2 as cloudinary } from 'cloudinary'
import multer, { FileFilterCallback } from 'multer'
import { Request } from 'express'

dotenv.config()

cloudinary.config({
  cloud_name: 'cloud7teck',
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
})

const storage = multer.memoryStorage()

const uploadCloud = multer({
  storage,
  limits: { fileSize: 6 * 1024 * 1024 },
  fileFilter: (_req: Request, file, cb: FileFilterCallback): void => {
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
