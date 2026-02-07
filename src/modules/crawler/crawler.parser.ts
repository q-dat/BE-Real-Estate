import * as cheerio from 'cheerio'
import type { Element } from 'domhandler'
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

  /* TITLE */
  let title = $(config.selectors.title).first().text().trim() || $('meta[property="og:title"]').attr('content') || $('title').text().trim()

  title = title.replace(/\s+/g, ' ').trim()

  /* CONTENT */
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

  contentNode.find('img').each((_: number, img: Element) => {
    const $img = $(img)

    const realSrc =
      $img.attr('data-original') ||
      $img.attr('data-src') ||
      $img.attr('data-lazy-src') ||
      $img
        .attr('data-srcset')
        ?.split(',')
        .map((s) => s.trim().split(' ')[0])[0]

    if (realSrc && realSrc.startsWith('http')) {
      $img.attr('src', realSrc)
    }

    // chỉ remove attr rác, KHÔNG TOUCH tag inline
    $img.removeAttr('data-original')
    $img.removeAttr('data-src')
    $img.removeAttr('data-lazy-src')
    $img.removeAttr('data-srcset')
    $img.removeAttr('class')
  })

  /* SLIDESHOW → IMG */

  contentNode.find('.block_thumb_slide_show').each((_, el) => {
    const $el = $(el)

    const src = $el.attr('data-src') || $el.attr('data-thumbnail-src')
    if (!src) {
      $el.remove()
      return
    }

    const $img = $('<img />').attr('src', src).attr('loading', 'lazy')

    const caption = $el.closest('.item_slide_show').find('.desc_cation p').first().text().trim()

    if (caption) {
      $img.attr('alt', caption)
    }

    $el.closest('.item_slide_show').replaceWith($('<p></p>').append($img))
  })

  /* NORMALIZE IMG SRC */

  contentNode.find('img').each((_, el) => {
    const $img = $(el)

    const realSrc =
      $img.attr('data-original') ||
      $img.attr('data-src') ||
      $img.attr('data-lazy-src') ||
      $img.attr('data-srcset')?.split(',')[0]?.split(' ')[0] ||
      $img.attr('src')

    if (realSrc) {
      $img.attr('src', realSrc)
    }

    $img
      .removeAttr('data-original')
      .removeAttr('data-src')
      .removeAttr('data-lazy-src')
      .removeAttr('data-srcset')
      .removeAttr('srcset')
      .removeAttr('sizes')
      .removeAttr('class')
      .removeAttr('style')
  })

  /* FIGURE / PICTURE CLEANUP */

  contentNode.find('figure').each((_, el) => {
    const $fig = $(el)
    const $img = $fig.find('img').first()

    if ($img.length) {
      $fig.replaceWith($('<p></p>').append($img))
    } else {
      $fig.remove()
    }
  })

  contentNode.find('picture').each((_, el) => {
    const $pic = $(el)
    const $img = $pic.find('img').first()

    if ($img.length) {
      $pic.replaceWith($img)
    } else {
      $pic.remove()
    }
  })

  contentNode.find('figcaption').remove()
  contentNode.find('meta').remove()
  const content = contentNode.html()?.trim() || ''

  /* IMAGE ĐẠI DIỆN */
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
