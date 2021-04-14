const api = require('express').Router()
const maps = require('./googleMaps/index')

api.get('/', (req, res) => {
    res.json({
        message: `Get API Successfully`
    })
})

api.use('/maps', maps)

module.exports = api