const bcrypt = require('bcrypt')
const { PASSWORD_SALT_ROUNDS } = require('../constants')

function createBadRequestError(schemaError) {
  return { errors: schemaError.details.map(detail => detail.message) }
}

async function hashPassword(password) {
  return bcrypt.hash(password, PASSWORD_SALT_ROUNDS)
}

module.exports = {
  createBadRequestError,
  hashPassword
}
