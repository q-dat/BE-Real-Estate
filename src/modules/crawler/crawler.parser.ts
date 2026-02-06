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
  const contentNode = $(config.selectors.content).first().clone()

  contentNode
    .find(
      [
        'script',
        'style',
        'iframe',
        'ins',
        '.ads',
        '.advertisement',
        '.related',
        '.social',
        'article.ck-cms-wiki-news-full',
        'article[data-vnnembedtype="article"]'
      ].join(',')
    )
    .remove()

  contentNode.find('img').each((_, img) => {
    const $img = $(img)

    const realSrc = $img.attr('data-original') || $img.attr('data-src') || $img.attr('data-lazy-src') || $img.attr('data-srcset')?.split(' ')[0]

    if (realSrc) {
      $img.attr('src', realSrc)
    }

    // cleanup rác
    $img.removeAttr('data-original')
    $img.removeAttr('data-src')
    $img.removeAttr('data-lazy-src')
    $img.removeAttr('data-srcset')
    $img.removeAttr('class')
  })

  const content = contentNode.html()?.trim() || ''

  /* ---------- IMAGE ĐẠI DIỆN ---------- */
  let image: string | undefined
  const firstImg = contentNode.find('img[src^="http"]').first()
  image = firstImg.attr('src')

  if (firstImg.length) {
    image = firstImg.attr('src')
  }

  return {
    title,
    content,
    image
  }
}
