const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { PASSWORD_SALT_ROUNDS } = require('../constants')
const AUTH_SIGNING_SECRET = process.env.AUTH_SIGNING_SECRET

if (!AUTH_SIGNING_SECRET) {
  throw new Error(
    'Critical error: A signing secret was not provided to the authentication module.'
  )
}

function createBadRequestError(schemaError) {
  return { errors: schemaError.details.map(detail => detail.message) }
}

function createAuthToken(claim) {
  return jwt.sign(claim, AUTH_SIGNING_SECRET, {
    expiresIn: '1d',
  })
}

async function hashPassword(password) {
  return bcrypt.hash(password, PASSWORD_SALT_ROUNDS)
}

module.exports = {
  createAuthToken,
  createBadRequestError,
  hashPassword,
}
