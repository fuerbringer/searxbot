const botBuilder = require('claudia-bot-builder')
const telegramTemplate = require('claudia-bot-builder').telegramTemplate
const request = require('minimal-request-promise')

// Searx instance hosted by the non-profit association La Quadrature du Net
const defaultInstance = 'https://searx.laquadrature.net/'

const search = (req) => {
  return request.get(`${defaultInstance}?q=${req}&format=json`).then(res => {
    const json = JSON.parse(res.body)
    const max = json.results.length >= 5 ? 5 : json.results.length

    if(max > 0) {
      const titleStr = `Here's ${max} result${max > 1 ? "s" : ""} related to *${req}*:\n`
      var resultStr = ''
      for(var i = 0; i < max; i++) {
        resultStr += `${i+1}. [${json.results[i].title}](${json.results[i].pretty_url})\n`
      }
      return new telegramTemplate.Text(titleStr + resultStr).get()
    } else {
      return new telegramTemplate.Text(`*Sorry!* I couldn't find anything related to *${req}*.`).get()
    }
  })
}

module.exports = botBuilder((request) => {
  const match = request.text.match(/\/searx (.+)/)
  if(match !== null) {
    return search(match[1])
  }
})
