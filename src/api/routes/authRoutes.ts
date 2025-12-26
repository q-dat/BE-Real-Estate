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

const authRoutes = express.Router()

authRoutes.post('/register', register)
authRoutes.post('/login', login)

const uploadAvatar = uploadCloud.fields([{ name: 'avatar', maxCount: 1 }])

authRoutes.put('/profile', requireAuth, uploadAvatar, updateProfile)
authRoutes.post('/verify-email', verifyEmail)
authRoutes.post('/reset-password', resetPassword)
authRoutes.post('/change-password', requireAuth, changePassword)
authRoutes.post('/confirm-reset-password', confirmResetPassword)

export default authRoutes
