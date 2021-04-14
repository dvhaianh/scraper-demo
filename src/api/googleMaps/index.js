const api = require('express').Router()
const crawl = require('../../core/googleMapsCrawl')

api.get('/', (req, res) => {
    res.json({
        message: `Get Maps Successfully`
    })
})

api.post('/', async (req, res) => {
    const {keyword} = req.body
    const data = await crawl(keyword)
    res.json({
        message: 'success',
        data
    })
})

module.exports = api