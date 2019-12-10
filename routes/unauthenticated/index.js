const { Router } = require('express')
const router = new Router()

const token = require('./token')
const up = require('./up')
const users = require('./users')

router.use('/token', token)
router.use('/up', up)
router.use('/users', users)

module.exports = router
