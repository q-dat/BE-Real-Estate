import mongoose, { Schema, Document } from 'mongoose'
import { IRentalCategory } from './rentalCategoryModel'

/**
 * RentalPost - Bài đăng cho thuê / tìm người ở ghép / nhà, mặt bằng
 */
export interface IRentalPostAdmin extends Document {
  _id: string // id bài đăng (ObjectId)
  code: string // mã bài đăng ngắn (vd: "POST-17234")
  images: string[] // danh sách ảnh
  phoneNumbers?: string // danh sách số điện thoại liên hệ
  zaloLink?: string // link Zalo liên hệ
  title: string // tiêu đề bài đăng
  description: string // mô tả chi tiết nội dung bài đăng
  category: IRentalCategory // danh mục (liên kết đến bảng danh mục)
  price: number // giá cho thuê (VNĐ)
  priceUnit: string // đơn vị giá (vd: "VNĐ/tháng")
  area: number // diện tích (m2)
  province: string // tỉnh/thành phố
  district: string // quận/huyện
  ward?: string // phường/xã
  address: string // địa chỉ cụ thể
  coordinates?: { lat: number; lng: number } // vị trí bản đồ
  amenities?: string // tiện ích đi kèm (vd: máy lạnh, chỗ để xe,...)
  youtubeLink?: string // link video Youtube người đăng nhập
  videoTitle?: string // tiêu đề video minh họa
  videoDescription?: string // mô tả ngắn cho video
  status: 'active' | 'pending' | 'expired' | 'hidden' // trạng thái tin
  /** -------------------- THÔNG TIN NGƯỜI ĐĂNG -------------------- */
  author?: string // người đăng tin
  adminNote?: string // ghi chú nội bộ cho admin
  createdAt: string // ngày tạo tin
  updatedAt: string // ngày cập nhật gần nhất
}

const RentalPostSchema: Schema = new Schema(
  {
    code: { type: String, required: true, unique: true, trim: true },
    images: { type: [String], default: [] },
    phoneNumbers: { type: String },
    zaloLink: { type: String },
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    category: { type: Schema.Types.ObjectId, ref: 'RentalCategoryModel', required: true },
    price: { type: Number, required: true, min: 0 },
    priceUnit: { type: String, required: true },
    area: { type: Number, required: true, min: 0 },
    province: { type: String, required: true },
    district: { type: String, required: true },
    ward: { type: String },
    address: { type: String, required: true },
    coordinates: {
      lat: { type: Number },
      lng: { type: Number }
    },
    amenities: { type: String },
    youtubeLink: { type: String },
    videoTitle: { type: String },
    videoDescription: { type: String },
    status: {
      type: String,
      enum: ['active', 'pending', 'expired', 'hidden'],
      default: 'active'
    },
    author: { type: String, default: 'admin' },
    adminNote: { type: String }
  },
  { timestamps: true, collection: 'rental-posts-admin' }
)
const RentalPostAdminModel = mongoose.model<IRentalPostAdmin>('RentalPostAdminModel', RentalPostSchema)
export default RentalPostAdminModel
