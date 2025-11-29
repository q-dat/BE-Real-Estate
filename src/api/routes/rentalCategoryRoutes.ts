import express from 'express'
import { getAllRentalCategory } from '../controllers/catalog/rentalCategoryController/getAllRentalCategory'
import uploadCloud from '~/config/cloudinary'
import { createRentalCategory } from '../controllers/catalog/rentalCategoryController/createRentalCategory'
import { updateRentalCategory } from '../controllers/catalog/rentalCategoryController/updateRentalCategory'
import { deleteRentalCategory } from '../controllers/catalog/rentalCategoryController/deleteRentalCategory'

const rentalCategoryRoutes = express.Router()

rentalCategoryRoutes.get('/rental-categories', getAllRentalCategory)
rentalCategoryRoutes.post('/rental-category', uploadCloud.fields([{ name: 'images', maxCount: 25 }]), createRentalCategory)
rentalCategoryRoutes.put('/rental-category/:id', uploadCloud.fields([{ name: 'images', maxCount: 25 }]), updateRentalCategory)
rentalCategoryRoutes.delete('/rental-category/:id', deleteRentalCategory)

export default rentalCategoryRoutes
