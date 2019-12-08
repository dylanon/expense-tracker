const { Router } = require('express')
const router = new Router()

const { isAuthenticated, user } = require('../../middleware')

const budgets = require('./budgets')
const projects = require('./projects')
const transactions = require('./transactions')
const users = require('./users')

// Middleware
router.use(isAuthenticated)
router.use(user)

// Routes
router.use('/budgets', budgets)
router.use('/projects', projects)
router.use('/transactions', transactions)
router.use('/users', users)

module.exports = router
