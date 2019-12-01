const { Router } = require('express')
const router = new Router()

const { routeHandler } = require('../middleware')

const token = require('./token')
const transactions = require('./transactions')
const users = require('./users')

router.get('/', (req, res) => {
  res.send('Hello, world!')
})

router.use('/token', routeHandler(token, { requiresAuthentication: false }))
router.use('/transactions', routeHandler(transactions))
router.use('/users', routeHandler(users))

module.exports = router
