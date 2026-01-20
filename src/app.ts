// External dependencies
import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import path from 'path'
import compression from 'compression'
import bodyParser from 'body-parser'

// Internal dependencies
import connectDB from './config/db'
import { errorHandler } from './middlewares/errorMiddleware'
// import { endpointsByCategory } from './views/endpointsByCategory'

// Routes
// import authRoutes from './api/routes/auth/authRoutes'
import rentalCategoryRoutes from './api/routes/rentalCategoryRoutes'
import rentalPostAdminRoutes from './api/routes/rentalPostRoutesAdmin'
import interiorRoutes from './api/routes/InteriorRoutes'
import interiorCategoryRoutes from './api/routes/interiorCategoryRoutes'
import realEstateProjectRoutes from './api/routes/realEstateProjectRoutes'
import authRoutes from './api/routes/authRoutes'

// Environment setup
dotenv.config()

// Database connection
connectDB()
// connectRedis().catch((err) => {
//   console.error('Lỗi kết nối Redis:', err)
//   process.exit(1)
// })

// Sitemap generation
// generateAndSaveSitemap()

// Allowed origins for CORS
export const allowedOrigins = [
  process.env.HOST_NAME || 'https://www.nguonnhagiare.vn',
  'https://nguonnhagiare.vn',
  'https://fe-real-estate-sooty.vercel.app/',
  'http://localhost:5173',
  'http://localhost:3000'
]

const app = express()

// Middleware setup
app.use(compression())
app.use(express.json())
app.use(express.urlencoded({ limit: '50mb', extended: true }))

app.use(bodyParser.json({ limit: '50mb' }))

// CORS configuration
app.use(
  cors({
    origin: allowedOrigins,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization', 'X-CSRF-Token', 'x-client-id', 'Session-ID'],
    exposedHeaders: ['X-CSRF-Token']
  })
)
app.options('*', cors())

// ----------------------------------------------------------------
// app.use(cookieParser())
// app.use(sessionMiddleware)
// app.use(csrfMiddleware)
// app.use(requestLoggerMiddleware)
// app.get('/csrf-token', csrfTokenHandler)
// app.use(sessionHeaderMiddleware)
// ----------------------------------------------------------------
// API routes
app.use('/api/', rentalPostAdminRoutes)
app.use('/api/', rentalCategoryRoutes)
app.use('/api/', interiorRoutes)
app.use('/api/', interiorCategoryRoutes)
app.use('/api/', realEstateProjectRoutes)
app.use('/api/auth/', authRoutes)

// EJS setup
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

// Root route
// app.get('/', (req, res) => {
//   res.render('index', { endpointsByCategory })
// })

// Error handler middleware
app.use(errorHandler)

export default app
