import mongoose, { Schema, Document } from 'mongoose'

export interface IRealEstateProject extends Document {
  _id: string

  name: string // Tên dự án
  slug: string // SEO
  introduction?: string // Giới thiệu
  description?: string // Mô tả chi tiết
  article?: string // Bài viết
  pricing?: string // Bảng giá (string)
  status?: string // Tình trạng (ví dụ: "Đang mở bán", "Sắp mở bán", "Đã bàn giao")
  projectType?: string // Loại hình dự án
  area?: string // Diện tích (vd: "80–120 m2")
  investor?: string // Chủ đầu tư
  partners?: string // Đối tác
  location?: string // Vị trí (text hoặc địa chỉ)
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
    location: { type: String },
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
