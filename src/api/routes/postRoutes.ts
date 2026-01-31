import { Router } from 'express'
import { createPost } from '../controllers/post/createPost'
import { getPosts } from '../controllers/post/getAllPost'
import { getPostById } from '../controllers/post/getPostById'
import { updatePost } from '../controllers/post/updatePost'
import { deletePost } from '../controllers/post/deletePost'
import uploadCloud from '~/config/cloudinary'

const postRoutes = Router()

postRoutes.get('/posts', getPosts)
postRoutes.get('/post/:id', getPostById)
postRoutes.post('/post', uploadCloud.fields([{ name: 'image', maxCount: 1 }]), createPost)
postRoutes.put('/post/:id', uploadCloud.fields([{ name: 'image', maxCount: 1 }]), updatePost)
postRoutes.delete('/post/:id', deletePost)

export default postRoutes
