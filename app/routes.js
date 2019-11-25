'use strict'
const dataQueries = require('./data-queries.js')
const router = require('express').Router()

router.get('/events/:event_id', async (req, res) => {
    const eventIds = [... new Set(req.params.event_id.split(','))]
    let data

    try {
        data = await dataQueries.getOddsData(eventIds, 'events')
    }
    catch (err) {
        console.error(err)
        return res.status(500).end(err.message)
    }
    return res.send(data)
})

router.get('/subevents/:subevent_id', async (req, res) => {
    let data
    const subeventIds = [... new Set(req.params.subevent_id.split(','))]

    try {
        data = await dataQueries.getOddsData(subeventIds, 'events.subevents')
    }
    catch (err) {
        console.error(err)
        return res.status(500).end(err.message)
    }
    return res.send(data)
})

router.get('/markets/:market_id', async (req, res) => {
    let data
    const marketIds = [... new Set(req.params.market_id.split(','))]

    try {
        data = await dataQueries.getOddsData(marketIds, 'events.subevents.markets')
    }
    catch (err) {
        console.error(err)
        return res.status(500).end(err.message)
    }
    return res.send(data)
})

router.get('/bets/:bet_id', async (req, res) => {
    let data
    const betIds = [... new Set(req.params.bet_id.split(','))]

    try {
        data = await dataQueries.getOddsData(betIds, 'events.subevents.markets.bets')
    }
    catch (err) {
        console.error(err)
        return res.status(500).end(err.message)
    }
    return res.send(data)
})

module.exports = router