const { Router } = require('express')

const isAuthenticated = require('./isAuthenticated')

const routeHandler = (handler, { requiresAuthentication = true } = {}) => {
  const router = new Router()
  if (requiresAuthentication) {
    router.use(isAuthenticated)
  }
  router.use(handler)
  return router
}

module.exports = routeHandler
