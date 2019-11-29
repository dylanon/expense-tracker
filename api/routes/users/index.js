const { Router } = require('express')
const knex = require('../../db')
const {
  createSchema,
  readSchema,
  updateParamsSchema,
  updateBodySchema,
  deleteSchema,
} = require('./schemas')

const router = new Router()

const dbTable = 'users'

const list = async (req, res) => {
  const list = await knex(dbTable).select(['id', 'email', 'username'])
  res.json(list)
}

const create = async (req, res, next) => {
  try {
    const body = await createSchema.validateAsync(req.body)
    const { email, username, password } = body
    // TODO: Only store encrypted/hashed password (use bcrypt)
    const [user] = await knex(dbTable)
      .returning(['id', 'email', 'username'])
      .insert({
        email,
        username,
        password,
      })
    res.status(201).json(user)
  } catch (error) {
    next(error)
  }
}

const read = async (req, res, next) => {
  try {
    const { id } = await readSchema.validateAsync(req.params)
    const [user] = await knex(dbTable)
      .select(['id', 'email', 'username'])
      .where('id', id)
    if (!user) {
      // TODO: Add NotFoundError to error handling
      return res
        .status(404)
        .json({ errors: [`Could not find a user with id ${id}.`] })
    }
    res.json(user)
  } catch (error) {
    next(error)
  }
}

const update = async (req, res, next) => {
  try {
    const { id } = await updateParamsSchema.validateAsync(req.params)
    const updates = await updateBodySchema.validateAsync(req.body)
    const [updatedUser] = await knex(dbTable)
      .returning(['id', 'email', 'username'])
      .where('id', id)
      .update(updates)
    if (!updatedUser) {
      // TODO: Add NotFoundError to error handling
      return res
        .status(404)
        .json({ errors: [`Could not find a user with id ${id}.`] })
    }
    res.json(updatedUser)
  } catch (error) {
    next(error)
  }
}

const del = async (req, res, next) => {
  try {
    const { id } = await deleteSchema.validateAsync(req.params)
    const [deletedUser] = await knex(dbTable)
      .returning(['id', 'email', 'username'])
      .where('id', id)
      .delete()
    if (!deletedUser) {
      // TODO: Add NotFoundError to error handling
      return res
        .status(404)
        .json({ errors: [`Could not find a user with id ${id}.`] })
    }
    res.json(deletedUser)
  } catch (error) {
    next(error)
  }
}

router.get('/', list)
router.post('/', create)
router.get('/:id', read)
router.patch('/:id', update)
router.delete('/:id', del)

module.exports = router
