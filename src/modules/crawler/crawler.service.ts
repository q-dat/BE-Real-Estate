import * as cheerio from 'cheerio'
import { fetchHtml } from '~/utils/fetch-html'
import { runWithConcurrency } from '~/utils/concurrency'
import { CRAWL_DOMAINS } from '~/modules/crawler/crawler.config'
import { processArticle } from './crawler.processor'

export async function startCrawl(): Promise<void> {
  console.log('[CRAWLER] Bắt đầu thu thập dữ liệu')

  for (const domain of CRAWL_DOMAINS) {
    console.log(`[CRAWLER] Đang xử lý domain: ${domain.domain}`)

    for (const entryUrl of domain.entryUrls) {
      console.log(`[CRAWLER] Truy cập trang đầu vào: ${entryUrl}`)

      let html: string

      try {
        html = await fetchHtml(entryUrl)
        console.log(`[CRAWLER] Lấy HTML thành công (${html.length} ký tự)`)
      } catch (error) {
        console.error('[CRAWLER] Không thể lấy HTML từ trang đầu vào', error)
        continue
      }

      const $ = cheerio.load(html)

      const links = $(domain.selectors.articleLinks)
        .map((_, el) => $(el).attr('href'))
        .get()
        .filter(Boolean)

      console.log(`[CRAWLER] Phát hiện ${links.length} liên kết bài viết`)

      if (links.length === 0) {
        console.warn('[CRAWLER] Không tìm thấy liên kết bài viết, cần kiểm tra selector')
        continue
      }

      const tasks = links.map((link, index) => {
        const url = link.startsWith('http') ? link : `https://${domain.domain}${link}`

        return async () => {
          console.log(`[BÀI VIẾT] (${index + 1}/${links.length}) Đang xử lý: ${url}`)
          await processArticle(url, domain)
        }
      })

      console.time('[CRAWLER] Thời gian xử lý danh sách bài viết')
      await runWithConcurrency(tasks, 5)
      console.timeEnd('[CRAWLER] Thời gian xử lý danh sách bài viết')
    }
  }

  console.log('[CRAWLER] Hoàn tất thu thập dữ liệu')
}
