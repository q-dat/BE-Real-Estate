import express from 'express'
import uploadCloud from '~/config/cloudinary'
import { getAllInterior } from '../controllers/items/interiorController/getAllInterior'
import { getInteriorById } from '../controllers/items/interiorController/getInteriorById'
import { createInterior } from '../controllers/items/interiorController/createInterior'
import { updateInterior } from '../controllers/items/interiorController/updateInterior'
import { deleteInterior } from '../controllers/items/interiorController/deleteInterior'

const interiorRoutes = express.Router()

interiorRoutes.get('/interiors', getAllInterior)
interiorRoutes.get('/interior/:id', getInteriorById)

const uploadFields = uploadCloud.fields([{ name: 'images' }, { name: 'thumbnails', maxCount: 99 }])

interiorRoutes.post('/interior', uploadFields, createInterior)
interiorRoutes.put('/interior/:id', uploadFields, updateInterior)
interiorRoutes.delete('/interior/:id', deleteInterior)

export default interiorRoutes
