const { Router } = require('express')
const router = new Router()

const token = require('./token')
const transactions = require('./transactions')
const users = require('./users')

router.get('/', (req, res) => {
  res.send('Hello, world!')
})

router.use('/token', token)
router.use('/transactions', transactions)
router.use('/users', users)

module.exports = router
