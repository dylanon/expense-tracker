const { Router } = require('express')
const router = new Router()

const transactions = require('./transactions')
const users = require('./users')

router.get('/', (req, res) => {
  res.send('Hello, world!')
})

router.use('/transactions', transactions)
router.use('/users', users)

module.exports = router
