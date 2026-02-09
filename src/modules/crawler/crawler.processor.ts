import { fetchHtml } from '~/utils/fetch-html'
import { parseArticle } from './crawler.parser'
import { CrawlDomainConfig } from './crawler.config'
import { sleep } from '~/utils/sleep'
import { PostService } from '~/services/post.service'

export async function processArticle(url: string, domain: CrawlDomainConfig): Promise<void> {
  try {
    const existed = await PostService.existsBySource(url)
    if (existed) {
      console.log(`[CRAWLER] Bỏ qua bài viết đã tồn tại: ${url}`)
      return
    }

    console.log(`[CRAWLER] Đang tải nội dung bài viết: ${url}`)
    const html = await fetchHtml(url)

    const parsed = parseArticle(html, domain)

    if (!parsed.title || !parsed.content) {
      console.warn(`[CRAWLER] Dữ liệu bài viết không hợp lệ: ${url}`)
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

    console.log(`[CRAWLER] Lưu bài viết thành công: ${parsed.title}`)
  } catch (error: any) {
    if (error?.response?.status === 429) {
      console.warn(`[CRAWLER] Bị giới hạn truy cập (429), tạm dừng và bỏ qua: ${url}`)
      await sleep(5000)
      return
    }

    console.error(`[CRAWLER] Lỗi khi xử lý bài viết: ${url}`, error)
  } finally {
    // Delay sau mỗi bài – bắt buộc để tránh bị chặn
    await sleep(1500 + Math.random() * 1500)
  }
}
