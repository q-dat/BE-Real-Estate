import mongoose, { Schema, Document } from 'mongoose'

export interface IUser extends Document {
  _id: string
  email: string
  password: string
  avatar?: string

  phoneNumber?: number
  zaloNumber?: number

  role: 'admin' | 'user'
  isActive: boolean

  emailVerified: boolean

  emailVerifyOtp?: string
  emailVerifyOtpExpiresAt?: Date
  emailVerifyOtpAttempts?: number

  resetPasswordOtp?: string
  resetPasswordOtpExpiresAt?: Date
  resetPasswordOtpAttempts?: number

  passwordChangedAt?: Date
  failedLoginAttempts: number
  lockUntil?: Date

  lastLoginAt?: Date
  lastLoginIp?: string

  createdAt: string
  updatedAt: string
}

const UserSchema = new Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
    password: { type: String, required: true, select: false },

    avatar: String,
    phoneNumber: Number,
    zaloNumber: Number,

    role: { type: String, enum: ['admin', 'user'], default: 'user' },
    isActive: { type: Boolean, default: true },

    emailVerified: { type: Boolean, default: false },

    emailVerifyOtp: { type: String, select: false },
    emailVerifyOtpExpiresAt: { type: Date, select: false },
    emailVerifyOtpAttempts: { type: Number, default: 0, select: false },

    resetPasswordOtp: { type: String, select: false },
    resetPasswordOtpExpiresAt: { type: Date, select: false },
    resetPasswordOtpAttempts: { type: Number, default: 0, select: false },

    passwordChangedAt: Date,
    failedLoginAttempts: { type: Number, default: 0, select: false },
    lockUntil: { type: Date, select: false },

    lastLoginAt: Date,
    lastLoginIp: String
  },
  { timestamps: true, collection: 'users' }
)

const UserModel = mongoose.model<IUser>('UserModel', UserSchema)
export default UserModel
