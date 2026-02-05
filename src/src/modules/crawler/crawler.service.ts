import * as cheerio from 'cheerio'
import { fetchHtml } from '~/src/utils/fetch-html'
import { runWithConcurrency } from '~/src/utils/concurrency'
import { CRAWL_DOMAINS } from '~/src/modules/crawler/crawler.config'
import { processArticle } from './crawler.processor'

export async function startCrawl(): Promise<void> {
  console.log('[CRAWLER] Start')

  for (const domain of CRAWL_DOMAINS) {
    console.log(`[CRAWLER] Domain: ${domain.domain}`)

    for (const entryUrl of domain.entryUrls) {
      console.log(`[CRAWLER] Entry URL: ${entryUrl}`)

      let html: string

      try {
        html = await fetchHtml(entryUrl)
        console.log(`[CRAWLER] Fetched entry HTML (${html.length} chars)`)
      } catch (error) {
        console.error('[CRAWLER] Failed to fetch entry URL', error)
        continue
      }

      const $ = cheerio.load(html)

      const links = $(domain.selectors.articleLinks)
        .map((_, el) => $(el).attr('href'))
        .get()
        .filter(Boolean)

      console.log(`[CRAWLER] Found ${links.length} article links`)

      if (links.length === 0) {
        console.warn('[CRAWLER] No article links found, check selector')
        continue
      }

      const tasks = links.map((link, index) => {
        const url = link.startsWith('http') ? link : `https://${domain.domain}${link}`

        return async () => {
          console.log(`[ARTICLE] (${index + 1}/${links.length}) ${url}`)
          await processArticle(url, domain)
        }
      })

      console.time('[CRAWLER] Process articles')
      await runWithConcurrency(tasks, 5)
      console.timeEnd('[CRAWLER] Process articles')
    }
  }

  console.log('[CRAWLER] Done')
}
