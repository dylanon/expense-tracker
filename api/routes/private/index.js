const { Router } = require('express')
const router = new Router()

const { isAuthenticated, user } = require('../../middleware')

const transactions = require('./transactions')
const users = require('./users')

// Middleware
router.use(isAuthenticated)
router.use(user)

// Routes
router.use('/transactions', transactions)
router.use('/users', users)

module.exports = router
