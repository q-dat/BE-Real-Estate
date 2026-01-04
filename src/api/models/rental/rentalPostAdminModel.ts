import mongoose, { Schema, Document } from 'mongoose'
import { IRentalCategory } from './rentalCategoryModel'
import { IUser } from '../auth/UserModel'

export interface IRentalPostAdmin extends Document {
  _id: string // id bài đăng (ObjectId)
  code: string // mã bài đăng ngắn (vd: "POST-12345")
  images: string[] // danh sách ảnh
  phoneNumbers?: string // số điện thoại
  zaloLink?: string // link Zalo liên hệ
  title: string // tiêu đề bài đăng
  description: string // mô tả chi tiết nội dung bài đăng
  category: IRentalCategory // danh mục (liên kết đến bảng danh mục)
  propertyType?: string // loại hình bất động sản (vd: "Căn hộ", "Nhà phố",...)
  locationType?: string // loại hình vị trí (vd: "đường lớn", "hẻm",...)
  direction?: string // hướng nhà (vd: "Đông", "Tây",...)
  price: number // Giá bán hoặc giá thuê
  priceUnit: string // VD: "Tỷ", "Triệu/m²", "/tháng", "/m²"...
  pricePerM2?: number // giá theo m2 (VNĐ/m2)
  area: number // diện tích (m2)
  length?: string // chiều ngang
  width?: string // chiều rộng
  backSize?: string // mặt hậu
  floorNumber?: number // số tầng
  bedroomNumber?: number // số phòng ngủ
  toiletNumber?: number // số toilet
  legalStatus?: string // tình trạng pháp lý (vd: "sổ hồng", "sổ đỏ",...)
  furnitureStatus?: string // tình trạng nội thất (vd: "đầy đủ", "chưa có",...)
  province: string // tỉnh/thành phố
  district: string // quận/huyện
  ward?: string // phường/xã
  address: string // địa chỉ cụ thể
  amenities?: string // tiện ích đi kèm (vd: máy lạnh, chỗ để xe,...)
  youtubeLink?: string // link video Youtube người đăng nhập
  videoTitle?: string // tiêu đề video minh họa
  videoDescription?: string // mô tả ngắn cho video
  postType: 'basic' | 'vip1' | 'vip2' | 'vip3' | 'highlight' // loại tin
  status: 'active' | 'pending' | 'expired' | 'hidden' // trạng thái tin
  author: IUser // người đăng tin
  adminNote?: string // ghi chú nội bộ cho admin
  adminImages: string[] // ảnh dành cho admin
  postedAt?: Date // ngày đăng tin
  expiredAt?: Date // ngày hết hạn tin
  createdAt: string // ngày tạo tin
  updatedAt: string // ngày cập nhật gần nhất
}

const RentalPostSchema: Schema = new Schema<IRentalPostAdmin>(
  {
    code: { type: String, required: true, unique: true, trim: true },
    images: { type: [String], default: [] },
    phoneNumbers: { type: String },
    zaloLink: { type: String },
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    category: { type: Schema.Types.ObjectId, ref: 'RentalCategoryModel', required: true },

    propertyType: { type: String },
    locationType: { type: String },
    direction: { type: String },

    price: { type: Number, required: true, min: 0 },
    priceUnit: { type: String, required: true },
    pricePerM2: { type: Number, min: 0 },

    area: { type: Number, required: true, min: 0 },
    length: { type: String },
    width: { type: String },
    backSize: { type: String },
    floorNumber: { type: Number, min: 0 },
    bedroomNumber: { type: Number, min: 0 },
    toiletNumber: { type: Number, min: 0 },
    legalStatus: { type: String },
    furnitureStatus: { type: String },

    province: { type: String, required: true },
    district: { type: String, required: true },
    ward: { type: String },
    address: { type: String, required: true },

    amenities: { type: String },
    youtubeLink: { type: String },
    videoTitle: { type: String },
    videoDescription: { type: String },

    postType: {
      type: String,
      enum: ['basic', 'vip1', 'vip2', 'vip3', 'highlight'],
      default: 'highlight'
    },
    status: {
      type: String,
      enum: ['active', 'pending', 'expired', 'hidden'],
      default: 'active'
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: 'UserModel',
      required: true,
      index: true
    },
    adminNote: { type: String },
    adminImages: { type: [String], default: [] },
    postedAt: { type: Date, default: Date.now },
    expiredAt: { type: Date }
  },
  { timestamps: true, collection: 'rental-posts-admin' }
)

const RentalPostAdminModel = mongoose.model<IRentalPostAdmin>('RentalPostAdminModel', RentalPostSchema)

export default RentalPostAdminModel
