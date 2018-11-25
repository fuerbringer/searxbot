require('dotenv').config()

const searxBot = require('./bot')

const Telegraf = require('telegraf')
const bot = new Telegraf(process.env.BOT_TOKEN)

bot.start(ctx => ctx.reply('hello'))

bot.command('searx', ctx => {
    const match = ctx.message.text.match(/\/searx (.+)/)
    if(match && match.length > 1) {
      searxBot.search(match[1]).then(result => ctx.replyWithMarkdown(result))
    }
})

bot.startPolling()
