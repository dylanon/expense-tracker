const { Router } = require('express')
const router = new Router()

const token = require('./token')
const users = require('./users')

router.use('/token', token)
router.use('/users', users)

module.exports = router
