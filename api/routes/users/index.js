const { Router } = require('express')
const knex = require('../../db')
const { createBadRequestError } = require('../../utils')
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

const create = async (req, res) => {
  const body = await createSchema
    .validateAsync(req.body)
    .catch(error => res.status(400).json(createBadRequestError(error)))
  const { email, username, password } = body
  const [user] = await knex(dbTable)
    .returning(['id', 'email', 'username'])
    .insert({
      email,
      username,
      password,
    })
    .catch(error => res.status(500).json({ errors: [error] }))
  res.status(201).json(user)
}

const read = async (req, res) => {
  const { id } = await readSchema
    .validateAsync(req.params)
    .catch(error => res.status(400).json(createBadRequestError(error)))
  const [user] = await knex(dbTable)
    .select(['id', 'email', 'username'])
    .where('id', id)
  if (!user) {
    return res
      .status(404)
      .json({ errors: [`Could not find a user with id ${id}.`] })
  }
  res.json(user)
}

const update = async (req, res) => {
  // validate id parameter
  const { id } = await updateParamsSchema
    .validateAsync(req.params)
    .catch(error => res.status(400).json(createBadRequestError(error)))
  // validate properties to update
  const updates = await updateBodySchema
    .validateAsync(req.body)
    .catch(error => res.status(400).json(createBadRequestError(error)))
  // TODO: Prevent handler from continuing after failed validation (all endpoints)
  // ! Issue appears to be using async/await with .catch instead of try/catch
  const [updatedUser] = await knex(dbTable)
    .returning(['id', 'email', 'username'])
    .where('id', id)
    .update(updates)
    .catch(error => res.status(500).json({ errors: [error] }))
  if (!updatedUser) {
    return res
      .status(404)
      .json({ errors: [`Could not find a user with id ${id}.`] })
  }
  res.json(updatedUser)
}

const del = async (req, res) => {
  const { id } = await deleteSchema
    .validateAsync(req.params)
    .catch(error => res.status(400).json(createBadRequestError(error)))
  const [deletedUser] = await knex(dbTable)
    .returning(['id', 'email', 'username'])
    .where('id', id)
    .delete()
    .catch(error => res.status(500).json({ errors: [error] }))
  if (!deletedUser) {
    return res
      .status(404)
      .json({ errors: [`Could not find a user with id ${id}.`] })
  }
  res.json(deletedUser)
}

router.get('/', list)
router.post('/', create)
router.get('/:id', read)
router.patch('/:id', update)
router.delete('/:id', del)

module.exports = router
