const api = require('express').Router()
const crawl = require('../../core/googleMapsCrawl')
const mapper = require('../../models/maps')

api.get('/', async (req, res) => {
    try {
        const data = await mapper.listing()
        res.json({
            success: true,
            data
        })
    } catch (e) {
        res.json({
            success: false,
            error: `${e.message}`
        })
    }
})

api.get('/detail/:title', async (req, res) => {
    const {title} = req.params
    try {
        const data = await mapper.reading({title})
        res.json({
            success: true,
            data
        })
    } catch (e) {
        res.json({
            success: false,
            error: `${e.message}`
        })
    }
})

api.post('/', async (req, res) => {
    const {keyword} = req.body
    try {
        const data = await crawl(keyword)
        await mapper.update(data)
        res.json({
            success: true,
            data
        })
    } catch (e) {
        res.json({
            success: false,
            error: `${e.message}`
        })
    }
})

api.post('/suggestion', async(req, res) => {
    const {category, rating, address} = req.body
    try {
        const data = await mapper.filtering({category, rating, address})
        res.json({
            success: true,
            data
        })
    } catch (e) {
        res.json({
            success: false,
            error: `${e.message}`
        })
    }
})

module.exports = api