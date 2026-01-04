import bcrypt from 'bcrypt'
import mongoose from 'mongoose'
import UserOtpModel, { OtpType } from '~/api/models/owner/UserOtpModel'

export const createOtp = async ({ userId, email, type, ttlMinutes = 10 }: { userId: string; email: string; type: OtpType; ttlMinutes?: number }) => {
  const otp = Math.floor(100000 + Math.random() * 900000).toString()
  const otpHash = await bcrypt.hash(otp, 10)

  await UserOtpModel.updateMany({ email, type, isUsed: false }, { isUsed: true })

  await UserOtpModel.create({
    userId: new mongoose.Types.ObjectId(userId),
    email,
    type,
    otpHash,
    expiresAt: new Date(Date.now() + ttlMinutes * 60 * 1000)
  })

  return otp
}
