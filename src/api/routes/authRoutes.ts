import express from 'express'
import uploadCloud from '~/config/cloudinary'
import { register } from '../controllers/auth/register'
import { login } from '../controllers/auth/login'
import { updateProfile } from '../controllers/auth/updateProfile'
import { requireAuth } from '~/middlewares/requireAuth'

const authRoutes = express.Router()

authRoutes.post('/register', register)
authRoutes.post('/login', login)

const uploadAvatar = uploadCloud.fields([{ name: 'avatar', maxCount: 1 }])

authRoutes.put('/profile', requireAuth, uploadAvatar, updateProfile)

export default authRoutes
