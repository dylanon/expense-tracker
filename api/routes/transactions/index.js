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

const dbTable = 'transactions'

const list = async (req, res) => {
  const list = await knex(dbTable).select('*')
  res.json(list)
}

const create = async (req, res, next) => {
  try {
    const { user } = req
    const body = await createSchema.validateAsync(req.body)
    const { amount, type } = body
    const { date = new Date(), name = 'Transaction' } = body
    const [transaction] = await knex(dbTable)
      .returning(['id', 'amount', 'date', 'name', 'type'])
      .insert({
        amount,
        date,
        name,
        type,
        createdBy: user.id,
      })
    res.status(201).json(transaction)
  } catch (error) {
    next(error)
  }
}

const read = async (req, res, next) => {
  try {
    const { id } = await readSchema.validateAsync(req.params)
    const [transaction] = await knex(dbTable)
      .returning(['id', 'amount', 'date', 'name', 'type'])
      .where('id', id)
    if (!transaction) {
      // TODO: Add NotFoundError to error handling
      return res
        .status(404)
        .json({ errors: [`Could not find a transaction with id ${id}.`] })
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
      .returning(['id', 'amount', 'date', 'name', 'type'])
      .where('id', id)
      .update(updates)
    if (!updatedTransaction) {
      // TODO: Add NotFoundError to error handling
      return res
        .status(404)
        .json({ errors: [`Could not find a transaction with id ${id}.`] })
    }
    res.json(updatedTransaction)
  } catch (error) {
    next(error)
  }
}

const del = async (req, res, next) => {
  try {
    const { id } = await deleteSchema.validateAsync(req.params)
    const [deletedTransaction] = await knex(dbTable)
      .returning(['id', 'amount', 'date', 'name', 'type'])
      .where('id', id)
      .delete()
    if (!deletedTransaction) {
      // TODO: Add NotFoundError to error handling
      return res
        .status(404)
        .json({ errors: [`Could not find a transaction with id ${id}.`] })
    }
    res.json(deletedTransaction)
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
