const { Router } = require('express')
const bcrypt = require('bcrypt')

const { createSchema } = require('./schemas')
const knex = require('../../../db')
const { PASSWORD_SALT_ROUNDS } = require('../../../constants')

const router = new Router()
const dbTable = 'users'

const create = async (req, res, next) => {
  try {
    const body = await createSchema.validateAsync(req.body)
    const { email, username, password } = body
    const [existingUser] = await knex(dbTable)
      .select('username', 'email')
      .where({ email })
      .orWhere({ username })
    if (existingUser) {
      // TODO: Add to error handling
      return res.status(409).json({ errors: ['User already exists.'] })
    }
    const hashedPassword = await bcrypt.hash(password, PASSWORD_SALT_ROUNDS)
    const [user] = await knex(dbTable)
      .returning(['id', 'email', 'username'])
      .insert({
        email,
        username,
        password: hashedPassword,
      })
    res.status(201).json(user)
  } catch (error) {
    next(error)
  }
}

router.post('/', create)

module.exports = router
