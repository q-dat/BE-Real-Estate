declare module 'multer-storage-cloudinary' {
  import type { StorageEngine } from 'multer'
  import type { UploadApiOptions } from 'cloudinary'

  export interface CloudinaryStorageOptions {
    cloudinary: any
    params?: UploadApiOptions | ((req: Express.Request, file: Express.Multer.File) => UploadApiOptions)
  }

  export class CloudinaryStorage implements StorageEngine {
    constructor(options: CloudinaryStorageOptions)
    _handleFile(req: Express.Request, file: Express.Multer.File, cb: (error?: any, info?: Partial<Express.Multer.File>) => void): void

    _removeFile(req: Express.Request, file: Express.Multer.File, cb: (error: Error | null) => void): void
  }
}
