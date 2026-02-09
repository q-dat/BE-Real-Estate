import { v2 as cloudinary } from 'cloudinary'
import { Readable } from 'stream'

export const uploadImageToCloudinary = async (file: string | Buffer): Promise<string> => {
  // Disk storage (file.path)
  if (typeof file === 'string') {
    if (!file) {
      throw new Error('File path is empty')
    }

    const uploadResult = await cloudinary.uploader.upload(file)
    return uploadResult.secure_url
  }

  // Memory storage (file.buffer)
  if (!Buffer.isBuffer(file)) {
    throw new Error('Invalid file buffer')
  }

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream({ resource_type: 'image' }, (error, result) => {
      if (error || !result) {
        reject(new Error(error?.message || 'Upload failed'))
        return
      }
      resolve(result.secure_url)
    })

    Readable.from(file).pipe(uploadStream)
  })
}
