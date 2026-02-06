export interface CrawlDomainConfig {
  domain: string
  entryUrls: string[]
  selectors: {
    articleLinks: string
    title: string
    content: string
    image?: string
  }
  sourceName: string
  catalogSlug: string
}

export const CRAWL_DOMAINS: CrawlDomainConfig[] = [
  {
    domain: 'dantri.com.vn',
    entryUrls: ['https://dantri.com.vn/bat-dong-san.htm'],
    selectors: {
      articleLinks: 'h3.article-title a',
      title: 'h1',
      content: '.singular-content p',
      image: '.singular-content img'
    },
    sourceName: 'DanTri',
    catalogSlug: 'bat-dong-san'
  },
  {
    domain: 'cafeland.vn',
    entryUrls: ['https://cafeland.vn/tin-tuc/bat-dong-san/'],
    selectors: {
      articleLinks: 'h3.title a',
      title: 'h1',
      content: '.content-detail p',
      image: '.content-detail img'
    },
    sourceName: 'CafeLand',
    catalogSlug: 'bat-dong-san'
  },

  {
    domain: 'batdongsan.com.vn',
    entryUrls: ['https://batdongsan.com.vn/tin-tuc'],
    selectors: {
      articleLinks: '.re__title a',
      title: 'h1',
      content: '.re__content p',
      image: '.re__content img'
    },
    sourceName: 'BatDongSan',
    catalogSlug: 'bat-dong-san'
  },

  {
    domain: 'vietnamnet.vn',
    entryUrls: ['https://vietnamnet.vn/bat-dong-san'],
    selectors: {
      articleLinks: 'h3 a',
      title: 'h1',
      content: '.maincontent p',
      image: '.maincontent img'
    },
    sourceName: 'VietnamNet',
    catalogSlug: 'bat-dong-san'
  },

  {
    domain: 'vneconomy.vn',
    entryUrls: ['https://vneconomy.vn/bat-dong-san.htm'],
    selectors: {
      articleLinks: 'h3.story__title a',
      title: 'h1',
      content: '.detail__content p',
      image: '.detail__content img'
    },
    sourceName: 'VnEconomy',
    catalogSlug: 'bat-dong-san'
  }
]
