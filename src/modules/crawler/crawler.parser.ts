import * as cheerio from 'cheerio'
import { CrawlDomainConfig } from './crawler.config'

export function parseArticle(
  html: string,
  config: CrawlDomainConfig
): {
  title: string
  content: string
  image?: string
} {
  const $ = cheerio.load(html)

  /* ---------- TITLE ---------- */
  let title = $(config.selectors.title).first().text().trim() || $('meta[property="og:title"]').attr('content') || $('title').text().trim()

  title = title.replace(/\s+/g, ' ').trim()

  /* ---------- CONTENT ---------- */
  const contentParts = $(config.selectors.content)
    .map((_, el) => {
      const text = $(el).clone().find('script, style, iframe, ads, .ads, .advertisement').remove().end().text().replace(/\s+/g, ' ').trim()

      return text
    })
    .get()
    .filter((text) => text.length > 40)

  const content = contentParts.join('\n\n')

  /* ---------- IMAGE ---------- */
  let image: string | undefined

  if (config.selectors.image) {
    const img = $(config.selectors.image).first()

    image = img.attr('data-src') || img.attr('data-original') || img.attr('src') || undefined

    if (image && image.startsWith('/')) {
      image = `https://${config.domain}${image}`
    }
  }

  return {
    title,
    content,
    image
  }
}
