'use strict'
const express = require('express')
const services = require('./services.js')
const router = require('./routes.js')
const app = express()
const port = 3000

services.transformExtDataToOdds()

app.use(function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', 'GET')
    next()
})

app.use('/api', router)
app.get('/', (req, res) => res.send('A simple API for Oddschecker!'))

app.listen(port, () => console.log(`Oddschecker-test listening on port ${port}!`))