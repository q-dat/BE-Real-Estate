import express from 'express'
import uploadCloud from '~/config/cloudinary'
import { getAllRentalPostsAdmin } from '../controllers/items/rentalPostAdminController/getAllRentalPostAdmin'
import { getRentalPostAdminById } from '../controllers/items/rentalPostAdminController/getRentalPostAdminById'
import { createRentalPostAdmin } from '../controllers/items/rentalPostAdminController/createRentalPostAdmin'
import { deleteRentalPostAdmin } from '../controllers/items/rentalPostAdminController/deleteRentalPostAdmin'
import { updateRentalPostAdmin } from '../controllers/items/rentalPostAdminController/updateRentalPostAdmin'
import { requireAuth } from '~/middlewares/requireAuth'
import { requireAdmin } from '~/middlewares/requireAdmin'
import { getMyRentalPostsAdmin } from '../controllers/items/rentalPostAdminController/getMyRentalPostsAdmin'

const rentalPostAdminRoutes = express.Router()
rentalPostAdminRoutes.get('/rental-posts/me', requireAuth, requireAdmin, getMyRentalPostsAdmin)

rentalPostAdminRoutes.get('/rental-admin-posts', getAllRentalPostsAdmin)
rentalPostAdminRoutes.get('/rental-admin-post/:id', getRentalPostAdminById)

const uploadFields = uploadCloud.fields([
  { name: 'images', maxCount: 25 },
  { name: 'adminImages', maxCount: 25 }
])

rentalPostAdminRoutes.post('/rental-admin-post', uploadFields, createRentalPostAdmin)
rentalPostAdminRoutes.put('/rental-admin-post/:id', uploadFields, updateRentalPostAdmin)
rentalPostAdminRoutes.delete('/rental-admin-post/:id', deleteRentalPostAdmin)

export default rentalPostAdminRoutes
