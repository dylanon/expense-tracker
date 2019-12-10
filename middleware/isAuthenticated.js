const jwt = require('jsonwebtoken')

const AUTH_SIGNING_SECRET = process.env.AUTH_SIGNING_SECRET

const isAuthenticated = (req, res, next) => {
  try {
    const { auth: authToken } = req.cookies
    if (!authToken) {
      throw new MissingTokenError()
    }

    const verifiedToken = jwt.verify(authToken, AUTH_SIGNING_SECRET)

    const nowInSeconds = Date.now() / 1000
    const isTokenExpired = verifiedToken.exp <= nowInSeconds
    if (isTokenExpired) {
      throw new ExpiredTokenError()
    }

    req.authTokenPayload = verifiedToken
    next()
  } catch (error) {
    // TODO: Improve error handling
    if (
      error.name === 'MissingTokenError' ||
      error.name === 'JsonWebTokenError' ||
      error.name === 'ExpiredTokenError'
    ) {
      return res
        .status(403)
        .json({ errors: [error.message || 'Unauthorized.'] })
    }
    next(error)
  }
}

class MissingTokenError extends Error {
  constructor(message) {
    super(message)
    this.name = 'MissingTokenError'
    this.message = message || 'Unauthorized - Missing authorization token.'
  }
}

class ExpiredTokenError extends Error {
  constructor(message) {
    super(message)
    this.name = 'ExpiredTokenError'
    this.message = message || 'Unauthorized - Expired authorization token.'
  }
}

module.exports = isAuthenticated
