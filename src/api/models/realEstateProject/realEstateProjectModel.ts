import mongoose, { Schema, Document } from 'mongoose'

export interface IRealEstateProject extends Document {
  _id: string
  name: string // Tên dự án
  images: string
  thumbnails?: string[]
  province?: string // tỉnh/thành phố
  district?: string // quận/huyện
  ward?: string // phường/xã
  address: string // địa chỉ cụ thể
  slug: string // SEO
  introduction?: string // Giới thiệu
  description?: string // Mô tả chi tiết
  article?: string // Bài viết
  pricing?: string // Bảng giá (string)
  status?: string // Tình trạng (ví dụ: "0: Đang mở bán", "1: Sắp mở bán", "2: Đã bàn giao")
  projectType?: string // Loại hình dự án
  area?: string // Diện tích (vd: "80–120 m2")
  investor?: string // Chủ đầu tư
  partners?: string // Đối tác
  amenities?: string // Tiện ích (text / HTML)
  hotline?: string
  email?: string
  zalo?: string
  message?: string
  createdAt?: string
  updatedAt?: string
}
const RealEstateProjectSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    images: { type: String, required: true },
    thumbnails: { type: [String], default: [] },
    slug: { type: String, required: true, unique: true },
    introduction: { type: String },
    description: { type: String },
    article: { type: String },
    pricing: { type: String },
    status: { type: String },
    projectType: { type: String },
    area: { type: String },
    investor: { type: String },
    partners: { type: String },
    province: { type: String },
    district: { type: String },
    address: { type: String },
    ward: { type: String },
    amenities: { type: String },
    hotline: { type: String },
    email: { type: String },
    zalo: { type: String },
    message: { type: String }
  },
  { timestamps: true, collection: 'real-estate-project' }
)

const RealEstateProjectModel = mongoose.model<IRealEstateProject>('ReaIEstateProjectModel', RealEstateProjectSchema)
export default RealEstateProjectModel
