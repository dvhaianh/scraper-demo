const crawl = require('../src/core/googleMapsCrawl')

setImmediate(async () => {
    await crawl('Ha Long Bay')
})