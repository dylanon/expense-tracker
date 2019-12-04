const { Router } = require('express')
const router = new Router()

const { routeHandler } = require('../middleware')

const token = require('./token')
const usersPublic = require('./users/public')
const transactions = require('./transactions')
const users = require('./users')

// Public (unauthenticated) routes
router.get('/', (req, res) => {
  res.send('Hello, world!')
})
router.use('/token', routeHandler(token, { requiresAuthentication: false }))
router.use(
  '/users',
  routeHandler(usersPublic, { requiresAuthentication: false })
)

// Authenticated Routes
router.use('/transactions', routeHandler(transactions))
router.use('/users', routeHandler(users))

module.exports = router
