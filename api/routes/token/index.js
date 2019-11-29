const { Router } = require('express')
const knex = require('../../db')
const { loginSchema } = require('./schemas')
const jwt = require('jsonwebtoken')

const AUTH_SIGNING_SECRET = process.env.AUTH_SIGNING_SECRET

if (!AUTH_SIGNING_SECRET) {
  throw new Error(
    'Critical error: A signing secret was not provided to the authentication module.'
  )
}

const router = new Router()

const login = async (req, res, next) => {
  try {
    const body = await loginSchema.validateAsync(req.body)
    const { username, password } = body
    const [user] = await knex('users')
      .select(['username', 'password'])
      .where({
        username,
        password,
      })
    // TODO: Verify encrypted-at-rest passwords with bcrypt
    if (!user) {
      // TODO: Add NotFoundError to error handling
      return res.status(404).json({ errors: [`Could not find user.`] })
    }
    const claim = { username }
    const token = jwt.sign(claim, AUTH_SIGNING_SECRET, {
      expiresIn: '1d',
    })
    // TODO: Harden cookie security (httpOnly, sameSite, secure, expires)
    res.cookie('auth', token)
    res.json({ token })
  } catch (error) {
    next(error)
  }
}

router.post('/', login)

module.exports = router
