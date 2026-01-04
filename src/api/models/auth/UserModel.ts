import mongoose, { Schema, Document } from 'mongoose'

export interface IUser extends Document {
  _id: string
  email: string
  password: string

  profile: {
    avatar?: string
    displayName?: string
    username?: string
    aboutMe?: string
    instagram?: string
    messenger?: string
    facebook?: string
    viberNumber?: string
    phoneNumber?: string
    zaloNumber?: string
  }

  role: 'admin' | 'user' | 'owner'
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

const UserSchema = new Schema<IUser>(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
    password: { type: String, required: true, select: false },

    profile: {
      avatar: String,
      displayName: { type: String, trim: true },
      username: { type: String, trim: true, index: true },
      aboutMe: { type: String, trim: true },
      instagram: String,
      messenger: String,
      facebook: String,
      phoneNumber: String,
      zaloNumber: String,
      viberNumber: String
    },

    role: {
      type: String,
      role: {
        type: String,
        enum: ['user', 'admin', 'owner'],
        default: 'user',
        index: true
      }
    },
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
