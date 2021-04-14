require('dotenv').config()

const createError = require('http-errors')
const path = require('path')

const express = require('express')
const cookieParser = require('cookie-parser')

const api = require('./api')

const app = express()
app.listen(process.env.PORT || 3000, () => {
    console.log(`SERVER LISTENGING ON PORT ${process.env.PORT || 3000}`)
})


app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))

app.use('/api', api)

app.use((req, res, next) => {
    next(createError(404))
})

app.use((err, req, res, next) => {
    res.locals.message = err.message
    res.locals.error = req.app.get('env') === 'development' ? err : {}

    res.status(err.status || 500)
    res.json({
        message: 'error'
    })
})

module.exports = app