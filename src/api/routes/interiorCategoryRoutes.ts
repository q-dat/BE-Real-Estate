import express from 'express'
import { getAllInteriorCategory } from '../controllers/catalog/interiorCategoryController/getAllInteriorCategory'
import { createInteriorCategory } from '../controllers/catalog/interiorCategoryController/createInteriorCategory'
import { updateInteriorCategory } from '../controllers/catalog/interiorCategoryController/updateInteriorCategory'
import { deleteInteriorCategory } from '../controllers/catalog/interiorCategoryController/deleteInteriorCategory'

const interiorCategoryRoutes = express.Router()

interiorCategoryRoutes.get('/interior-categories', getAllInteriorCategory)

interiorCategoryRoutes.post('/interior-category', createInteriorCategory)

interiorCategoryRoutes.put('/interior-category/:id', updateInteriorCategory)

interiorCategoryRoutes.delete('/interior-category/:id', deleteInteriorCategory)

export default interiorCategoryRoutes
