import axios from 'axios'

export async function publishFromCrawler(payload: {
  title: string
  content: string
  image?: string
  source: string
  sourceName: string
  catalogSlug: string
}): Promise<void> {
  await axios.post('http://localhost:6001/api/internal/posts/from-crawler', payload, {
    headers: {
      'x-internal-key': process.env.CRAWLER_SECRET,
      'Content-Type': 'application/json'
    },
    timeout: 15000
  })
}
