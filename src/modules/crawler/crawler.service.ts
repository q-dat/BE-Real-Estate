import * as cheerio from 'cheerio'
import { fetchHtml } from '~/utils/fetch-html'
import { runWithConcurrency } from '~/utils/concurrency'
import { CRAWL_DOMAINS } from '~/modules/crawler/crawler.config'
import { processArticle } from './crawler.processor'
import { crawlerState } from './crawler.state'

export async function startCrawl(): Promise<void> {
  console.log('[CRAWLER] Bắt đầu crawl')

  try {
    for (const domain of CRAWL_DOMAINS) {
      console.log(`[CRAWLER] Domain: ${domain.domain}`)

      for (const entryUrl of domain.entryUrls) {
        console.log(`[CRAWLER] Entry URL: ${entryUrl}`)

        const html = await fetchHtml(entryUrl)
        const $ = cheerio.load(html)

        const links = $(domain.selectors.articleLinks)
          .map((_, el) => $(el).attr('href'))
          .get()
          .filter(Boolean)

        console.log(`[CRAWLER] Tìm thấy ${links.length} bài viết`)

        const tasks = links.map((link, index) => {
          const url = link.startsWith('http') ? link : `https://${domain.domain}${link}`

          return async () => {
            console.log(`[ARTICLE] (${index + 1}/${links.length}) ${url}`)
            await processArticle(url, domain)
          }
        })

        await runWithConcurrency(tasks, 5)
      }
    }

    console.log('[CRAWLER] Hoàn tất crawl')
  } finally {
    crawlerState.finish()
  }
}
