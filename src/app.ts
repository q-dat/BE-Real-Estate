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
import rentalPostRoutes from './api/routes/rentalPostRoutes'

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
  process.env.HOST_NAME || 'https://www.7teck.vn',
  'https://7teck.vercel.app',
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
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
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
app.use('/api/', rentalPostRoutes)

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
