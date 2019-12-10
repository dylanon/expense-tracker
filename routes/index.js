const { Router } = require('express')
const router = new Router()

const unauthenticated = require('./unauthenticated')
const authenticated = require('./authenticated')

router.use(unauthenticated)
router.use(authenticated)

module.exports = router
