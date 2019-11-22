const { Router } = require('express')
const router = new Router()

const transactions = require('./transactions')

router.get('/', (req, res) => {
  res.send('Hello, world!')
})

router.use('/transactions', transactions)

module.exports = router
