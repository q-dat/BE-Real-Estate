import express from 'express'
import uploadCloud from '~/config/cloudinary'
import { getAllRentalPostsAdmin } from '../controllers/items/rentalPostAdminController/getAllRentalPostAdmin'
import { getRentalPostAdminById } from '../controllers/items/rentalPostAdminController/getRentalPostAdminById'
import { createRentalPostAdmin } from '../controllers/items/rentalPostAdminController/createRentalPostAdmin'
import { deleteRentalPostAdmin } from '../controllers/items/rentalPostAdminController/deleteRentalPostAdmin'
import { updateRentalPostAdmin } from '../controllers/items/rentalPostAdminController/updateRentalPostAdmin'
import { requireAuth } from '~/middlewares/requireAuth'
import { requireAdmin } from '~/middlewares/requireAdmin'
import { getMyRentalPostsAdmin } from '../controllers/items/rentalPostAdminController/getMyRentalPostsAdmin'

const rentalPostAdminRoutes = express.Router()

/**
 * @swagger
 * tags:
 *   name: RentalAdmin
 *   description: Rental Post Management - Admin APIs
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     RentalPost:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         title:
 *           type: string
 *         price:
 *           type: number
 *         images:
 *           type: array
 *           items:
 *             type: string
 *         adminImages:
 *           type: array
 *           items:
 *             type: string
 *         createdAt:
 *           type: string
 *           format: date-time
 */

/**
 * @swagger
 * /rental-posts/me:
 *   get:
 *     summary: Get my rental posts (Admin only)
 *     tags: [RentalAdmin]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of admin rental posts
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/RentalPost'
 */
rentalPostAdminRoutes.get('/rental-posts/me', requireAuth, requireAdmin, getMyRentalPostsAdmin)

/**
 * @swagger
 * /rental-admin-posts:
 *   get:
 *     summary: Get all rental posts (Admin)
 *     tags: [RentalAdmin]
 *     responses:
 *       200:
 *         description: List of rental posts
 */
rentalPostAdminRoutes.get('/rental-admin-posts', getAllRentalPostsAdmin)

/**
 * @swagger
 * /rental-admin-post/{id}:
 *   get:
 *     summary: Get rental post by ID
 *     tags: [RentalAdmin]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Rental post detail
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RentalPost'
 *       404:
 *         description: Not found
 */
rentalPostAdminRoutes.get('/rental-admin-post/:id', getRentalPostAdminById)

const uploadFields = uploadCloud.fields([
  { name: 'images', maxCount: 25 },
  { name: 'adminImages', maxCount: 25 }
])

/**
 * @swagger
 * /rental-admin-post:
 *   post:
 *     summary: Create rental post (Admin)
 *     tags: [RentalAdmin]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               price:
 *                 type: number
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *               adminImages:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       201:
 *         description: Rental post created successfully
 */
rentalPostAdminRoutes.post('/rental-admin-post', uploadFields, createRentalPostAdmin)

/**
 * @swagger
 * /rental-admin-post/{id}:
 *   put:
 *     summary: Update rental post
 *     tags: [RentalAdmin]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               price:
 *                 type: number
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *               adminImages:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       200:
 *         description: Rental post updated successfully
 */
rentalPostAdminRoutes.put('/rental-admin-post/:id', uploadFields, updateRentalPostAdmin)

/**
 * @swagger
 * /rental-admin-post/{id}:
 *   delete:
 *     summary: Delete rental post
 *     tags: [RentalAdmin]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Rental post deleted successfully
 */
rentalPostAdminRoutes.delete('/rental-admin-post/:id', deleteRentalPostAdmin)

export default rentalPostAdminRoutes
