require('dotenv').config()
const cloudinary = require('cloudinary').v2
const { CloudinaryStorage } = require('multer-storage-cloudinary')
const multer = require('multer')
const { Request } = require('express')

// Configuration
cloudinary.config({
  cloud_name: 'cloud7teck',
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
})

interface File {
  originalname: string
}

// Khởi tạo CloudinaryStorage
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'products',
    format: async (req: Request, file: File) => {
      const extension = file.originalname.split('.').pop()?.toLowerCase()
      if (extension === 'jpg' || extension === 'png' || extension === 'webp') {
        return extension
      } else {
        throw new Error('Định dạng tập tin không hợp lệ')
      }
    },
    public_id: (req: Request, file: File) => file.originalname.split('.')[0]
  }
})

const uploadCloud = multer({ storage })

export default uploadCloud
