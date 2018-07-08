const botBuilder = require('claudia-bot-builder')
const telegramTemplate = require('claudia-bot-builder').telegramTemplate
const bot = require('./bot')

module.exports = botBuilder(request => {
  const match = request.text.match(/\/searx (.+)/)
  if(match !== null) {
    const result = bot.search(match[1])
    return new telegramTemplate.Text(result).get()
  }
})
