import app from './app'
import { startCrawl } from '~/modules/crawler/crawler.service'

const PORT = process.env.PORT

async function bootstrap(): Promise<void> {
  console.log('[BOOTSTRAP] Khởi tạo hệ thống')

  try {
    console.log('[CRAWLER] Bắt đầu quy trình crawl')
    console.time('[CRAWLER] Thời gian thực thi')

    await startCrawl()

    console.timeEnd('[CRAWLER] Thời gian thực thi')
    console.log('[CRAWLER] Kết thúc quy trình crawl')
  } catch (error) {
    console.error('[CRAWLER] Quy trình crawl bị gián đoạn', error)
  }
}

bootstrap().catch((err) => {
  console.error('[BOOTSTRAP] Lỗi không thể khởi động hệ thống', err)
})

// console.log(`
// ██████╗ ██╗███████╗██╗   ██╗     ██████╗ ██╗   ██╗ ██████╗  ██████╗    ██████╗  █████╗ ████████╗
// ██╔══██╗██║██╔════╝██║   ██║    ██╔═══██╗██║   ██║██╔═══██╗██╔════╝    ██╔══██╗██╔══██╗╚══██╔══╝
// ██║  ██║██║█████╗  ██║   ██║    ██║   ██║██║   ██║██║   ██║██║         ██║  ██║███████║   ██║
// ██║  ██║██║██╔══╝  ██║   ██║    ██║▄▄ ██║██║   ██║██║   ██║██║         ██║  ██║██╔══██║   ██║
// ██████╔╝██║███████╗╚██████╔╝    ╚██████╔╝╚██████╔╝╚██████╔╝╚██████╗    ██████╔╝██║  ██║   ██║
// ╚═════╝ ╚═╝╚══════╝ ╚═════╝      ╚══▀▀═╝  ╚═════╝  ╚═════╝  ╚═════╝    ╚═════╝ ╚═╝  ╚═╝   ╚═╝
// `)
app.listen(PORT, () => {
  console.log(`http://localhost:${PORT}`)
})
