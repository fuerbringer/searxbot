const botBuilder = require('claudia-bot-builder')
const telegramTemplate = require('claudia-bot-builder').telegramTemplate
const request = require('minimal-request-promise')

// Searx instance hosted by the non-profit association La Quadrature du Net
const defaultInstance = 'https://searx.laquadrature.net/'

const search = req => {
  return request.get(`${defaultInstance}?q=${req}&format=json`).then(res => {
    const maxResults = 5
    const json = JSON.parse(res.body)
    const count = json.results.length >= maxResults ? maxResults : json.results.length

    if(count > 0) {
      // Anon. function to build individual search result strings
      const buildResults = (results, index) => {
        return `${index+1}. [${results.title}](${results.pretty_url})`
      }
      const requestResults = json.results.slice(0, maxResults)
      const titleStr = `Here's ${count} result${count > 1 ? "s" : ""} related to *${req}*.:\n`
      const resultStr = requestResults.map(buildResults).join(`\n`) // Combine results
      const messageString = titleStr + resultStr
      return new telegramTemplate.Text(messageString).get()
    } else {
      return new telegramTemplate.Text(`*Sorry!* I couldn't find anything related to *${req}*.`).get()
    }
  })
}

module.exports = botBuilder(request => {
  const match = request.text.match(/\/searx (.+)/)
  if(match !== null) {
    return search(match[1])
  }
})
