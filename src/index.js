const axios = require('axios')
const cron = require('node-cron')
const TelegramBot = require('node-telegram-bot-api')
const config = require('./config.js')
const { targets } = config

const check = () => {
  targets.forEach(async (target) => {
    const { url, name } = target

    try {
      const { data } = await axios.get(url)
      console.info(`Check server ${name}`)
      console.info(data)
    } catch (err) {
      console.error(err)
      sendAlert(target)
    }
  })
}

const sendAlert = async (target) => {
  const { name, url } = target

  const token = process.env.TELEGRAM_TOKEN
  const userIds = process.env.TELEGRAM_USER_IDS.split(',')

  try {
    const bot = new TelegramBot(token, {})
    const message = `Looks like server "${name}" is down. Health check url: ${url}`

    userIds.forEach((id) => {
      bot.sendMessage(id, message)
    })
  } catch (err) {
    console.error(err)
  }
}

const timeInterval = process.env.CRON_VALUE
cron.schedule(timeInterval, check)
