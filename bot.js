const request = require('request-promise')

// Searx instance hosted by the non-profit association La Quadrature du Net
const defaultInstance = 'https://searx.laquadrature.net/'

module.exports.search = term => {
  const params = {
    method: 'POST',
    uri: defaultInstance,
    json: true,
    form: {
      q: term,
      format: 'json'
    }
  }
  return request(params)
    .then(jsonResults => {
      const maxResults = 5
      const count = jsonResults.results.length >= maxResults ? maxResults : jsonResults.results.length

      if(count > 0) {
        // Anon. function to build individual search result strings
        const buildResults = (results, index) => {
          return `${index+1}. [${results.title}](${results.pretty_url})`
        }
        const requestResults = jsonResults.results.slice(0, maxResults)
        const titleStr = `Here's ${count} result${count > 1 ? "s" : ""} related to *${params.form.q}*.:\n`
        const resultStr = requestResults.map(buildResults).join(`\n`) // Combine results
        const messageString = titleStr + resultStr
        return messageString
      } else {
        return `*Sorry!* I couldn't find anything related to *${params.form.q}*.`
      }
    })
    .catch(error => {
      return `*Sorry!* Something went wrong on our end. Will be back soon. Complain @sevfbr in the meantime.`
    }) 
}
