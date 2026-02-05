import axios from 'axios'

const crawlerHttp = axios.create({
  timeout: 15000,
  headers: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 ' + '(KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
    Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
    'Accept-Language': 'vi-VN,vi;q=0.9,en-US;q=0.8',
    Connection: 'keep-alive',
    Referer: 'https://www.google.com/'
  }
})

export async function fetchHtml(url: string): Promise<string> {
  const res = await crawlerHttp.get<string>(url)
  return res.data
}
