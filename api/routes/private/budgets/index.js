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

const dbTable = 'budgets'

const list = async (req, res) => {
  const list = await knex(dbTable).select('*')
  res.json(list)
}

const create = async (req, res, next) => {
  try {
    const body = await createSchema.validateAsync(req.body)
    const { projectId, name, startDate, endDate, target } = body
    const [budget] = await knex(dbTable)
      .returning('*')
      .insert({
        projectId,
        name,
        startDate,
        endDate,
        target,
      })
    res.status(201).json(budget)
  } catch (error) {
    next(error)
  }
}

const read = async (req, res, next) => {
  try {
    const { id } = await readSchema.validateAsync(req.params)
    const [budget] = await knex(dbTable)
      .returning('*')
      .where('id', id)
    if (!budget) {
      // TODO: Add NotFoundError to error handling
      return res
        .status(404)
        .json({ errors: [`Could not find a budget with id ${id}.`] })
    }
    res.json(budget)
  } catch (error) {
    next(error)
  }
}

const update = async (req, res, next) => {
  try {
    const { id } = await updateParamsSchema.validateAsync(req.params)
    const updates = await updateBodySchema.validateAsync(req.body)
    const [updatedBudget] = await knex(dbTable)
      .returning('*')
      .where('id', id)
      .update(updates)
    if (!updatedBudget) {
      // TODO: Add NotFoundError to error handling
      return res
        .status(404)
        .json({ errors: [`Could not find a budget with id ${id}.`] })
    }
    res.json(updatedBudget)
  } catch (error) {
    next(error)
  }
}

const del = async (req, res, next) => {
  try {
    const { id } = await deleteSchema.validateAsync(req.params)
    const [deletedBudget] = await knex(dbTable)
      .returning('*')
      .where('id', id)
      .delete()
    if (!deletedBudget) {
      // TODO: Add NotFoundError to error handling
      return res
        .status(404)
        .json({ errors: [`Could not find a budget with id ${id}.`] })
    }
    res.json(deletedBudget)
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
