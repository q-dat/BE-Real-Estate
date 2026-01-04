import { JwtPayload } from 'jsonwebtoken'
import mongoose, { Schema, Document } from 'mongoose'

export type OtpType = 'verify_email' | 'reset_password'

export interface AuthPayload extends JwtPayload {
  id: string
  role: 'user' | 'admin' | 'owner'
}

export interface IUserOtp extends Document {
  userId: mongoose.Types.ObjectId
  email: string
  type: OtpType
  otpHash: string
  expiresAt: Date
  attempts: number
  isUsed: boolean
  createdAt: Date
}

const UserOtpSchema = new Schema<IUserOtp>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'UserModel',
      required: true,
      index: true
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      index: true
    },
    type: {
      type: String,
      enum: ['verify_email', 'reset_password'],
      required: true,
      index: true
    },
    otpHash: {
      type: String,
      required: true,
      select: false
    },
    expiresAt: {
      type: Date,
      required: true,
      index: { expires: 0 }
    },
    attempts: {
      type: Number,
      default: 0
    },
    isUsed: {
      type: Boolean,
      default: false,
      index: true
    }
  },
  {
    timestamps: true,
    collection: 'user_otps'
  }
)

export default mongoose.model<IUserOtp>('UserOtpModel', UserOtpSchema)
