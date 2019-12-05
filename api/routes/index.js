const { Router } = require('express')
const router = new Router()

const public = require('./public')
const private = require('./private')

router.use(public)
router.use(private)

module.exports = router
