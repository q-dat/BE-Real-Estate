import { Router } from 'express'
import { createPostCategory } from '../controllers/catalog/postCategoryController/createPostCategory'
import { getAllPostCategory } from '../controllers/catalog/postCategoryController/getAllPostCategory'
import { updatePostCategory } from '../controllers/catalog/postCategoryController/updatePostCategory'
import { deletePostCategory } from '../controllers/catalog/postCategoryController/deletePostCategory'
import { getPostCategoryById } from '../controllers/catalog/postCategoryController/getPostCategoryById'

const postCategoryRoutes = Router()

postCategoryRoutes.get('/post-categories', getAllPostCategory)
postCategoryRoutes.get('/post-category/:id', getPostCategoryById)
postCategoryRoutes.post('/post-category', createPostCategory)
postCategoryRoutes.put('/post-category/:id', updatePostCategory)
postCategoryRoutes.delete('/post-category/:id', deletePostCategory)

export default postCategoryRoutes
