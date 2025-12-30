import 'dotenv/config'
import linebot from 'linebot'
import commandSky from './commands/sky.js'

const bot = linebot({
  channelID: process.env.CHANNEL_ID,
  channelSecret: process.env.CHANNEL_SECRET,
  channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN,
})

bot.on('message', async (event) => {
  if (event.message.type === 'text' && event.message.text.trim().length > 0) {
    try {
      await commandSky(event)
    } catch (error) {
      console.error('執行 sky 指令時出錯:', error)
    }
  }
})

bot.listen('/', process.env.PORT || 3000, () => {
  console.log('啟動成功')
})
