const { Router } = require('express')
const router = new Router()

const { routeHandler } = require('../middleware')

const up = require('./public/up')
const tokenPublic = require('./public/token')
const usersPublic = require('./public/users')
const transactions = require('./transactions')
const users = require('./users')

// Public (unauthenticated) routes
router.use('/up', routeHandler(up, { requiresAuthentication: false }))
router.use(
  '/token',
  routeHandler(tokenPublic, { requiresAuthentication: false })
)
router.use(
  '/users',
  routeHandler(usersPublic, { requiresAuthentication: false })
)

// Authenticated Routes
router.use('/transactions', routeHandler(transactions))
router.use('/users', routeHandler(users))

module.exports = router
