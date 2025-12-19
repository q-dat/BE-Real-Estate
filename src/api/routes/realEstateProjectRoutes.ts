import express from 'express'
import uploadCloud from '~/config/cloudinary'
import { getAllRealEstateProjects } from '../controllers/items/realEstateProjectController/getAllRealEstateProjects'
import { createRealEstateProject } from '../controllers/items/realEstateProjectController/createRealEstateProject'
import { deleteRealEstateProject } from '../controllers/items/realEstateProjectController/deleteRealEstateProject'
import { getRealEstateProjectById } from '../controllers/items/realEstateProjectController/getRealEstateProjectById'
import { updateRealEstateProject } from '../controllers/items/realEstateProjectController/updateRealEstateProject'
import { getRealEstateProjectBySlug } from '../controllers/items/realEstateProjectController/getRealEstateProjectBySlug'

const realEstateProjectRoutes = express.Router()

realEstateProjectRoutes.get('/real-estate-projects', getAllRealEstateProjects)
realEstateProjectRoutes.get('/real-estate-project/:id', getRealEstateProjectById)
realEstateProjectRoutes.get('/real-estate-project/slug/:slug', getRealEstateProjectBySlug)

const uploadFields = uploadCloud.fields([{ name: 'images' }, { name: 'thumbnails', maxCount: 99 }])

realEstateProjectRoutes.post('/real-estate-project', uploadFields, createRealEstateProject)
realEstateProjectRoutes.put('/real-estate-project/:id', uploadFields, updateRealEstateProject)
realEstateProjectRoutes.delete('/real-estate-project/:id', deleteRealEstateProject)

export default realEstateProjectRoutes
