const { Router } = require('express')
const bcrypt = require('bcrypt')
const { createAuthToken } = require('../../../utils')

const knex = require('../../../db')
const { loginSchema } = require('./schemas')

const router = new Router()

const login = async (req, res, next) => {
  try {
    const body = await loginSchema.validateAsync(req.body)
    const { username, password } = body

    const [user] = await knex('users')
      .select(['password'])
      .where({
        username,
      })
    if (!user) {
      // TODO: Add Forbidden to error handling
      return res
        .status(403)
        .json({ errors: [`Incorrect username or password.`] })
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password)
    if (!isPasswordCorrect) {
      // TODO: Add Forbidden to error handling
      return res
        .status(403)
        .json({ errors: [`Incorrect username or password.`] })
    }

    const claim = { username }
    const token = createAuthToken(claim)
    // TODO: Harden cookie security (httpOnly, sameSite, secure, expires)
    res.cookie('auth', token)
    res.json({ token })
  } catch (error) {
    next(error)
  }
}

router.post('/', login)

module.exports = router
