import app from './app'
import { startCrawl } from '~/modules/crawler/crawler.service'

const PORT = process.env.PORT

async function bootstrap(): Promise<void> {
  console.log('[BOOTSTRAP] Starting application...')

  try {
    console.time('[CRAWLER] Total time')
    await startCrawl()
    console.timeEnd('[CRAWLER] Total time')
    console.log('[CRAWLER] Finished successfully')
  } catch (error) {
    console.error('[CRAWLER] Failed', error)
  }
}

bootstrap().catch((err) => {
  console.error('[BOOTSTRAP] Fatal error', err)
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
