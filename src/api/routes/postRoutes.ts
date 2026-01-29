import { Router } from 'express'
import { createPost } from '../controllers/post/createPost'
import { getPosts } from '../controllers/post/getAllPost'
import { getPostDetail } from '../controllers/post/getPostById'
import { updatePost } from '../controllers/post/updatePost'
import { deletePost } from '../controllers/post/deletePost'

const postRoutes = Router()

postRoutes.get('/posts', getPosts)
postRoutes.get('/post/:slug', getPostDetail)
postRoutes.post('/post', createPost)
postRoutes.put('/post/:id', updatePost)
postRoutes.delete('/post/:id', deletePost)

export default postRoutes
