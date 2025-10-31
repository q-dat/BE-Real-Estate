import express from 'express'
import { getAllRentalCategory } from '../controllers/items/rentalCategoryController/getAllRentalCategory'
import uploadCloud from '~/config/cloudinary'
import { createRentalCategory } from '../controllers/items/rentalCategoryController/createRentalCategory'
import { updateRentalCategory } from '../controllers/items/rentalCategoryController/updateRentalCategory'
import { deleteRentalCategory } from '../controllers/items/rentalCategoryController/deleteRentalCategory'

const rentalCategoryRoutes = express.Router()

rentalCategoryRoutes.get('/rental-categories', getAllRentalCategory)
rentalCategoryRoutes.post('/rental-category', uploadCloud.fields([{ name: 'images', maxCount: 25 }]), createRentalCategory)
rentalCategoryRoutes.put('/rental-category/:id', uploadCloud.fields([{ name: 'images', maxCount: 25 }]), updateRentalCategory)
rentalCategoryRoutes.delete('/rental-category/:id', deleteRentalCategory)

export default rentalCategoryRoutes
