const botBuilder = require('claudia-bot-builder')

// Searx instance hosted by the non-profit association La Quadrature du Net
const defaultInstance = 'https://searx.laquadrature.net/'

module.exports = botBuilder((request) => {
  return `Request received for: ${request.text}`
})
