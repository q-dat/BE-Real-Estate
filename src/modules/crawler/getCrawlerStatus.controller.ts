import { Request, Response } from 'express'
import { crawlerState } from '~/modules/crawler/crawler.state'

export function getCrawlerStatusController(
  _req: Request,
  res: Response
): void {
  const status = crawlerState.getStatus()

  res.json({
    running: status.running,
    lastRunAt: status.lastRunAt
  })
}
