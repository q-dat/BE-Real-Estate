import { v2 as cloudinary } from 'cloudinary'

// Utility function to upload image to Cloudinary
export const uploadImageToCloudinary = async (filePath: string): Promise<string> => {
    try {
      const uploadResult = await cloudinary.uploader.upload(filePath)
      return uploadResult.secure_url
    } catch (error: any) {
      throw new Error('Error uploading image to Cloudinary: ' + error.message)
    }
  }