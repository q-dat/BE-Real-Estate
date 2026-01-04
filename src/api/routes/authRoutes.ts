import express from 'express'
import uploadCloud from '~/config/cloudinary'
import { register } from '../controllers/auth/register'
import { login } from '../controllers/auth/login'
import { updateProfile } from '../controllers/auth/updateProfile'
import { requireAuth } from '~/middlewares/requireAuth'
import { verifyEmail } from '../controllers/auth/verifyEmail'
import { resetPassword } from '../controllers/auth/resetPassword'
import { changePassword } from '../controllers/auth/changePassword'
import { confirmResetPassword } from '../controllers/auth/confirmResetPassword'
import { me } from '../controllers/auth/me'
import { getAllOtps } from '../controllers/owner/getAllOtps'
import { requireOwner } from '~/middlewares/requireOwner'
import { getAllUsers } from '../controllers/owner/getAllUsers'
import { updateUserRole } from '../controllers/owner/updateUserRole'
import { updateUserActive } from '../controllers/owner/updateUserActive'
import { resendVerifyEmailOtp } from '../controllers/auth/resendVerifyEmailOtp'
import { getVerifyEmailStatus } from '../controllers/auth/getVerifyEmailStatus'

const authRoutes = express.Router()

const uploadAvatar = uploadCloud.fields([{ name: 'avatar', maxCount: 1 }])

authRoutes.post('/register', register)
authRoutes.post('/login', login)

// Owner
authRoutes.get('/owner/otps', requireAuth, requireOwner, getAllOtps)
authRoutes.get('/owner/users', requireAuth, requireOwner, getAllUsers)
authRoutes.patch('/owner/:id/role', requireAuth, requireOwner, updateUserRole)
authRoutes.patch('/owner/:id/active', requireAuth, requireOwner, updateUserActive)
authRoutes.post('/resend-verify-email', resendVerifyEmailOtp)
authRoutes.get('/verify-email/status', getVerifyEmailStatus)

// Account
authRoutes.get('/me', requireAuth, me)
authRoutes.put('/profile', requireAuth, uploadAvatar, updateProfile)
authRoutes.post('/verify-email', verifyEmail)
authRoutes.post('/reset-password', resetPassword)
authRoutes.post('/change-password', requireAuth, changePassword)
authRoutes.post('/confirm-reset-password', confirmResetPassword)

export default authRoutes
