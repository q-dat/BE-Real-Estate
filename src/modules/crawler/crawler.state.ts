interface CrawlerState {
  running: boolean
  lastRunAt?: Date
}

class CrawlerStateManager {
  private state: CrawlerState = {
    running: false
  }

  start(): boolean {
    if (this.state.running) {
      return false
    }

    this.state.running = true
    return true
  }

  finish(): void {
    this.state.running = false
    this.state.lastRunAt = new Date()
  }

  getStatus(): CrawlerState {
    return { ...this.state }
  }
}

export const crawlerState = new CrawlerStateManager()
