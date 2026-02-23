import swaggerJsdoc, { Options } from 'swagger-jsdoc'
import { Express } from 'express'
import swaggerUi from 'swagger-ui-express'

const options: Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Real Estate API',
      version: '1.0.0',
      description: 'Backend API Documentation'
    },
    servers: [
      {
        url: process.env.HOST_NAME ? `${process.env.HOST_NAME}/api` : 'http://localhost:6001/api'
      }
    ],
    tags: [
      {
        name: 'Auth',
        description: 'Authentication & Authorization APIs'
      },
      {
        name: 'RentalAdmin',
        description: 'Rental Post Management (Admin)'
      },
      {
        name: 'RentalCategory',
        description: 'Rental Category Management'
      },
      {
        name: 'Interior',
        description: 'Interior Management'
      },
      {
        name: 'InteriorCategory',
        description: 'Interior Category Management'
      },
      {
        name: 'RealEstateProject',
        description: 'Real Estate Project Management'
      },
      {
        name: 'Post',
        description: 'Public Post Management'
      },
      {
        name: 'PostCategory',
        description: 'Post Category Management'
      },
      {
        name: 'Crawler',
        description: 'Crawler System APIs'
      }
    ],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      },
      schemas: {
        ApiResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            message: { type: 'string' }
          }
        },
        ErrorResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: false },
            message: { type: 'string' },
            errors: {
              type: 'array',
              items: { type: 'string' }
            }
          }
        }
      }
    }
  },
  apis: ['src/api/routes/**/*.ts']
}

const swaggerSpec = swaggerJsdoc(options)

export function setupSwagger(app: Express): void {
  app.use(
    '/',
    swaggerUi.serve,
    swaggerUi.setup(swaggerSpec, {
      explorer: true,
      customSiteTitle: 'Real Estate API'
    })
  )
}
