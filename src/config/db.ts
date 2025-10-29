require('dotenv').config()
import mongoose from 'mongoose'

const mongoURL = process.env.MONGO_URL as string

const connectDB = async () => {
  const timeLabel = 'Thời gian kết nối MongoDB'
  const connections = mongoose.connections.length

  console.time(timeLabel)
  try {
    await mongoose.connect(mongoURL, {
      maxPoolSize: 10, // Giới hạn số lượng kết nối
      serverSelectionTimeoutMS: 5000, // Timeout sau 5 giây nếu không kết nối được
      socketTimeoutMS: 30000, // Đảm bảo kết nối không bị treo lâu
      retryWrites: true // Bật chế độ tự động retry nếu gặp lỗi ghi
    })
    console.log('Kết nối MongoDB thành công!')
    console.timeEnd(timeLabel)
    console.log(`Số kết nối MongoDB hiện tại: ${connections}`)

    // Ping MongoDB định kỳ để giữ kết nối
    const pingInterval = 30 * 60 * 1000
    let countdown = pingInterval / 1000
    setInterval(async () => {
      // console.log(`--->Ping MongoDB: ${countdown}s`)

      if (countdown <= 0) {
        try {
          console.time('Thời gian phản hồi ping')
          await mongoose.connection.db?.admin().ping()
          console.timeEnd('Thời gian phản hồi ping')
          console.log('Ping MongoDB thành công!')
        } catch (error) {
          console.error('Lỗi ping MongoDB:', error)
        }
        countdown = pingInterval / 1000
      }

      countdown--
    }, 1000)
  } catch (err) {
    if (err instanceof Error) {
      console.error('Lỗi kết nối MongoDB:', err.message)
    } else {
      console.error('Lỗi kết nối MongoDB:', err)
    }
    process.exit(1)
  }
}

export default connectDB
