import express from 'express'
import uploadCloud from '~/config/cloudinary'
import { createRentalPost } from '../controllers/items/rentalPostController/createRentalPost'
import { deleteRentalPost } from '../controllers/items/rentalPostController/deleteRentalPost'
import { getAllRentalPosts } from '../controllers/items/rentalPostController/getAllRentalPosts'
import { getRentalPostById } from '../controllers/items/rentalPostController/getRentalPostById'
import { updateRentalPost } from '../controllers/items/rentalPostController/updateRentalPost'

const rentalPostRoutes = express.Router()

rentalPostRoutes.get('/rental-posts', getAllRentalPosts)
rentalPostRoutes.get('/rental-post/:id', getRentalPostById)
rentalPostRoutes.post('/rental-post', uploadCloud.fields([{ name: 'images', maxCount: 25 }]), createRentalPost)
rentalPostRoutes.put('/rental-post/:id', uploadCloud.fields([{ name: 'images', maxCount: 25 }]), updateRentalPost)
rentalPostRoutes.delete('/rental-post/:id', deleteRentalPost)

export default rentalPostRoutes
