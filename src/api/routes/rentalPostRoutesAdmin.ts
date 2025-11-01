import express from 'express'
import uploadCloud from '~/config/cloudinary'
import { getAllRentalPostsAdmin } from '../controllers/items/rentalPostAdminController/getAllRentalPostAdmin'
import { getRentalPostAdminById } from '../controllers/items/rentalPostAdminController/getRentalPostAdminById'
import { createRentalPostAdmin } from '../controllers/items/rentalPostAdminController/createRentalPostAdmin'
import { deleteRentalPostAdmin } from '../controllers/items/rentalPostAdminController/deleteRentalPostAdmin'
import { updateRentalPostAdmin } from '../controllers/items/rentalPostAdminController/updateRentalPostAdmin'

const rentalPostAdminRoutes = express.Router()

rentalPostAdminRoutes.get('/rental-admin-posts', getAllRentalPostsAdmin)
rentalPostAdminRoutes.get('/rental-admin-post/:id', getRentalPostAdminById)
rentalPostAdminRoutes.post('/rental-admin-post', uploadCloud.fields([{ name: 'images', maxCount: 25 }]), createRentalPostAdmin)
rentalPostAdminRoutes.put('/rental-admin-post/:id', uploadCloud.fields([{ name: 'images', maxCount: 25 }]), updateRentalPostAdmin)
rentalPostAdminRoutes.delete('/rental-admin-post/:id', deleteRentalPostAdmin)

export default rentalPostAdminRoutes
