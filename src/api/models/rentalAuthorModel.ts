import mongoose, { Schema, Document } from 'mongoose'

/**
 * RentalAuthor - Người đăng bài
 */
export interface IRentalAuthor extends Document {
  _id: string // id người dùng (ObjectId)
  userCode: string // mã định danh người dùng trên hệ thống (vd: "USER-000123")
  name: string // tên hiển thị
  phone: string // số điện thoại liên hệ
  zalo?: string // liên kết Zalo (nếu có)
  avatar?: string // URL ảnh đại diện
  accountBalance: number // số dư tài khoản hiện tại (VNĐ)
  joinedAt: string // ngày tham gia hệ thống
  role: 'user' | 'admin' // phân quyền tài khoản
  isVerified: boolean // tài khoản đã xác minh hay chưa
}
const RentalAuthorSchema: Schema = new Schema(
  {
    userCode: { type: String, required: true },
    name: { type: String, required: true },
    phone: { type: String, required: true },
    zalo: { type: String },
    avatar: { type: String },
    accountBalance: { type: Number, default: 0 },
    joinedAt: { type: Date, default: Date.now },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    isVerified: { type: Boolean, default: false }
  },
  { timestamps: true, collection: 'rental-author' }
)
const RentalAuthorModel = mongoose.model<IRentalAuthor>('RentalAuthorModel', RentalAuthorSchema)
export default RentalAuthorModel
