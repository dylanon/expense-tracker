const { Router } = require('express')

const isAuthenticated = require('./isAuthenticated')
const user = require('./user')

const routeHandler = (handler, { requiresAuthentication = true } = {}) => {
  const router = new Router()
  if (requiresAuthentication) {
    router.use(isAuthenticated)
    router.use(user)
  }
  router.use(handler)
  return router
}

module.exports = routeHandler
