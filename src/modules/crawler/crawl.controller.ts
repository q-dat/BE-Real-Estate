import { Request, Response } from 'express'
import { startCrawl } from '~/modules/crawler/crawler.service'
import { crawlerState } from '~/modules/crawler/crawler.state'

export async function startCrawlerController(_req: Request, res: Response): Promise<void> {
  const started = crawlerState.start()

  if (!started) {
    res.status(409).json({
      message: 'Crawler đang chạy'
    })
    return
  }

  startCrawl().catch((error) => {
    console.error('[CRAWLER] Lỗi khi chạy crawler', error)
  })

  res.status(202).json({
    message: 'Đã khởi động crawler'
  })
}
