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
  removeSelectors?: string[] // Optional: Additional selectors to remove for this domain
}

export const CRAWL_DOMAINS: CrawlDomainConfig[] = [
  // BÁO CHÍ
  {
    domain: 'dantri.com.vn',
    entryUrls: ['https://dantri.com.vn/bat-dong-san.htm'],
    selectors: {
      articleLinks: 'h3.article-title a',
      title: 'h1',
      content: '.singular-content'
    },
    sourceName: 'DanTri',
    catalogSlug: 'bat-dong-san'
  },

  {
    domain: 'vietnamnet.vn',
    entryUrls: ['https://vietnamnet.vn/bat-dong-san'],
    selectors: {
      articleLinks: 'h3 a',
      title: 'h1',
      content: '.maincontent'
    },
    sourceName: 'VietnamNet',
    catalogSlug: 'bat-dong-san',
    removeSelectors: ['article.ck-cms-wiki-news-full', 'article[data-vnnembedtype="article"]']
  },

  {
    domain: 'vnexpress.net',
    entryUrls: ['https://vnexpress.net/bat-dong-san'],
    selectors: {
      articleLinks: 'h3.title-news a',
      title: 'h1.title-detail',
      content: '.fck_detail'
    },
    sourceName: 'VnExpress',
    catalogSlug: 'bat-dong-san',
    removeSelectors: ['.banner-ads', 'div[data-component-type="tin_xemthem"]', 'span#article-end'] // Added domain-specific removes for cleaner content
  },

  {
    domain: 'tuoitre.vn',
    entryUrls: ['https://tuoitre.vn/bat-dong-san.htm'],
    selectors: {
      articleLinks: 'h3.title-news a',
      title: 'h1.article-title',
      content: '.content-article'
    },
    sourceName: 'TuoiTre',
    catalogSlug: 'bat-dong-san'
  },

  {
    domain: 'thanhnien.vn',
    entryUrls: ['https://thanhnien.vn/bat-dong-san.htm'],
    selectors: {
      articleLinks: 'h3 a',
      title: 'h1.details__headline',
      content: '.details__content'
    },
    sourceName: 'ThanhNien',
    catalogSlug: 'bat-dong-san'
  },

  // TRANG CHUYÊN BĐS
  {
    domain: 'cafeland.vn',
    entryUrls: ['https://cafeland.vn/tin-tuc/bat-dong-san/'],
    selectors: {
      articleLinks: 'h3.title a',
      title: 'h1',
      content: '.content-detail'
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
      content: '.re__content'
    },
    sourceName: 'BatDongSan',
    catalogSlug: 'bat-dong-san'
  },

  {
    domain: 'reatimes.vn',
    entryUrls: ['https://reatimes.vn/bat-dong-san.htm'],
    selectors: {
      articleLinks: 'h3 a',
      title: 'h1',
      content: '.detail-content'
    },
    sourceName: 'Reatimes',
    catalogSlug: 'bat-dong-san'
  },

  {
    domain: 'nhadatviet247.net',
    entryUrls: ['https://nhadatviet247.net/tin-tuc-bat-dong-san'],
    selectors: {
      articleLinks: 'h3 a',
      title: 'h1',
      content: '.post-content'
    },
    sourceName: 'NhaDatViet247',
    catalogSlug: 'bat-dong-san'
  },

  // KINH TẾ – ĐẦU TƯ LIÊN QUAN BĐS
  {
    domain: 'vneconomy.vn',
    entryUrls: ['https://vneconomy.vn/bat-dong-san.htm'],
    selectors: {
      articleLinks: 'h3.story__title a',
      title: 'h1',
      content: '.detail__content'
    },
    sourceName: 'VnEconomy',
    catalogSlug: 'bat-dong-san'
  },

  {
    domain: 'baodautu.vn',
    entryUrls: ['https://baodautu.vn/bat-dong-san'],
    selectors: {
      articleLinks: 'h3 a',
      title: 'h1.title',
      content: '.article-content'
    },
    sourceName: 'BaoDauTu',
    catalogSlug: 'bat-dong-san'
  },

  {
    domain: 'tinnhanhchungkhoan.vn',
    entryUrls: ['https://tinnhanhchungkhoan.vn/bat-dong-san'],
    selectors: {
      articleLinks: 'h3 a',
      title: 'h1.detail-title',
      content: '.detail-content'
    },
    sourceName: 'TinNhanhCK',
    catalogSlug: 'bat-dong-san'
  }
]
