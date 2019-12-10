const knex = require('../db')

const userMiddleware = async (req, res, next) => {
  if (!req.authTokenPayload) {
    next()
  }
  try {
    const { username } = req.authTokenPayload
    const [user] = await knex('users').where({ username })
    req.user = user
    next()
  } catch (error) {
    next(error)
  }
}

module.exports = userMiddleware
