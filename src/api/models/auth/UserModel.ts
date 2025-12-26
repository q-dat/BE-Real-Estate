import mongoose, { Schema, Document } from 'mongoose'

export interface IUser extends Document {
  _id: string
  email: string // Email
  password: string
  avatar?: string

  phoneNumber?: string
  zaloNumber?: string

  role: 'admin' | 'user' // Vai trò cấp cao
  isActive: boolean // Trạng thái hoạt động của tài khoản

  emailVerified: boolean // Email đã xác thực hay chưa
  emailOtp?: string // OTP email (hash)
  emailOtpExpiresAt?: Date // Thời gian hết hạn OTP
  emailOtpPurpose?: 'verify' | 'reset' // Mục đích OTP
  emailOtpAttempts?: number // Số lần nhập OTP sai

  passwordChangedAt?: Date // Thời điểm đổi mật khẩu (invalidate token cũ)
  failedLoginAttempts: number // Số lần login sai
  lockUntil?: Date // Khoá tạm thời khi brute-force

  lastLoginAt?: Date // Lần đăng nhập gần nhất
  lastLoginIp?: string // IP đăng nhập gần nhất

  createdAt: string // Ngày tạo
  updatedAt: string // Ngày cập nhật
}

const UserSchema: Schema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true // tối ưu login
    },
    password: {
      type: String,
      required: true,
      select: false // không trả về khi query
    },
    avatar: {
      type: String // lưu URL ảnh
    },

    phoneNumber: {
      type: String,
      trim: true
    },
    zaloNumber: {
      type: String,
      trim: true
    },

    role: {
      type: String,
      enum: ['admin', 'user'],
      default: 'user'
    },
    isActive: {
      type: Boolean,
      default: true
    },

    emailVerified: {
      type: Boolean,
      default: false
    },
    emailOtp: {
      type: String,
      select: false
    },
    emailOtpExpiresAt: {
      type: Date,
      select: false
    },
    emailOtpPurpose: {
      type: String,
      enum: ['verify', 'reset'],
      select: false
    },
    emailOtpAttempts: {
      type: Number,
      default: 0,
      select: false
    },

    passwordChangedAt: {
      type: Date
    },
    failedLoginAttempts: {
      type: Number,
      default: 0,
      select: false
    },
    lockUntil: {
      type: Date,
      select: false
    },

    lastLoginAt: {
      type: Date
    },
    lastLoginIp: {
      type: String
    }
  },
  {
    timestamps: true,
    collection: 'users'
  }
)

const UserModel = mongoose.model<IUser>('UserModel', UserSchema)
export default UserModel
