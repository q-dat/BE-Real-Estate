import express from 'express'
import { requireAuth } from '~/middlewares/requireAuth'
import { requireAdmin } from '~/middlewares/requireAdmin'
import { startCrawlerController } from '~/modules/crawler/crawl.controller'
import { getCrawlerStatusController } from '~/modules/crawler/getCrawlerStatus.controller'

const crawlerRoutes = express.Router()
crawlerRoutes.post('/crawler/start', requireAuth, requireAdmin, startCrawlerController)
crawlerRoutes.get('/crawler/status', requireAuth, requireAdmin, getCrawlerStatusController)

export default crawlerRoutes
