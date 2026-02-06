import { fetchHtml } from '~/utils/fetch-html'
import { parseArticle } from './crawler.parser'
import { CrawlDomainConfig } from './crawler.config'
import { sleep } from '~/utils/sleep'
import { PostService } from '~/services/post.service'

export async function processArticle(url: string, domain: CrawlDomainConfig): Promise<void> {
  try {
    const existed = await PostService.existsBySource(url)
    if (existed) {
      console.log(`[CRAWLER] Skip existed: ${url}`)
      return
    }

    console.log(`[CRAWLER] Fetch article: ${url}`)
    const html = await fetchHtml(url)

    const parsed = parseArticle(html, domain)

    if (!parsed.title || !parsed.content) {
      console.warn(`[CRAWLER] Invalid article data: ${url}`)
      return
    }

    await PostService.createFromCrawler({
      title: parsed.title,
      content: parsed.content,
      image: parsed.image,
      source: url,
      sourceName: domain.sourceName,
      catalogSlug: domain.catalogSlug
    })

    console.log(`[CRAWLER] Saved article: ${parsed.title}`)
  } catch (error: any) {
    if (error?.response?.status === 429) {
      console.warn(`[CRAWLER] 429 Too Many Requests, delay & skip: ${url}`)
      await sleep(5000)
      return
    }

    console.error(`[CRAWLER] Error processing: ${url}`, error)
  } finally {
    // Delay sau mỗi bài – BẮT BUỘC
    await sleep(1500 + Math.random() * 1500)
  }
}
