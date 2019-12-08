const { Router } = require('express')
const knex = require('../../../db')
const {
  createSchema,
  readSchema,
  updateParamsSchema,
  updateBodySchema,
  deleteSchema,
} = require('./schemas')

const router = new Router()

const dbTable = 'projects'

const list = async (req, res) => {
  const list = await knex(dbTable).select('*')
  res.json(list)
}

const create = async (req, res, next) => {
  try {
    const { user } = req
    const body = await createSchema.validateAsync(req.body)
    const { name } = body
    const [project] = await knex(dbTable)
      .returning('*')
      .insert({
        name,
        owner: user.id,
      })
    res.status(201).json(project)
  } catch (error) {
    next(error)
  }
}

const read = async (req, res, next) => {
  try {
    const { id } = await readSchema.validateAsync(req.params)
    const [transaction] = await knex(dbTable)
      .returning('*')
      .where('id', id)
    if (!transaction) {
      // TODO: Add NotFoundError to error handling
      return res
        .status(404)
        .json({ errors: [`Could not find a project with id ${id}.`] })
    }
    res.json(transaction)
  } catch (error) {
    next(error)
  }
}

const update = async (req, res, next) => {
  try {
    const { id } = await updateParamsSchema.validateAsync(req.params)
    const updates = await updateBodySchema.validateAsync(req.body)
    const [updatedTransaction] = await knex(dbTable)
      .returning('*')
      .where('id', id)
      .update(updates)
    if (!updatedTransaction) {
      // TODO: Add NotFoundError to error handling
      return res
        .status(404)
        .json({ errors: [`Could not find a project with id ${id}.`] })
    }
    res.json(updatedTransaction)
  } catch (error) {
    next(error)
  }
}

const del = async (req, res, next) => {
  try {
    const { id } = await deleteSchema.validateAsync(req.params)
    const [deletedProject] = await knex(dbTable)
      .returning('*')
      .where('id', id)
      .delete()
    if (!deletedProject) {
      // TODO: Add NotFoundError to error handling
      return res
        .status(404)
        .json({ errors: [`Could not find a project with id ${id}.`] })
    }
    res.json(deletedProject)
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
