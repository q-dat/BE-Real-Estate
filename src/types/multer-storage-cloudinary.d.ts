declare module 'multer-storage-cloudinary' {
  import { StorageEngine } from 'multer'
  import { v2 as cloudinary } from 'cloudinary'
  import { Request } from 'express'

  interface CloudinaryStorageParams {
    folder?: string
    format?: string | ((req: Request, file: Express.Multer.File) => string | Promise<string>)
    public_id?: string | ((req: Request, file: Express.Multer.File) => string)
    resource_type?: 'image' | 'video' | 'raw' | 'auto'
    transformation?: unknown
  }

  interface CloudinaryStorageOptions {
    cloudinary: typeof cloudinary
    params?: CloudinaryStorageParams
  }

  export class CloudinaryStorage implements StorageEngine {
    constructor(options: CloudinaryStorageOptions)
    _handleFile(req: Request, file: Express.Multer.File, cb: (error?: unknown, info?: Partial<Express.Multer.File>) => void): void
    _removeFile(req: Request, file: Express.Multer.File, cb: (error: Error | null) => void): void
  }
}
