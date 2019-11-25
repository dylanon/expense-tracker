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

const dbTable = 'transactions'

const list = async (req, res) => {
  const list = await knex('transactions').select('*')
  res.json(list)
}

const create = async (req, res) => {
  // validate properties
  const body = await createSchema
    .validateAsync(req.body)
    .catch(error => res.status(400).json(createBadRequestError(error)))
  // insert into db
  const { amount, type } = body
  const { date = new Date(), name = 'Transaction' } = body
  const [transaction] = await knex(dbTable)
    .returning(['id', 'amount', 'date', 'name', 'type'])
    .insert({
      amount,
      date,
      name,
      type,
    })
    .catch(error => res.status(500).json({ errors: [error] }))
  // return created transaction
  res.status(201).json(transaction)
}

const read = async (req, res) => {
  const { id } = await readSchema
    .validateAsync(req.params)
    .catch(error => res.status(400).json(createBadRequestError(error)))
  const [transaction] = await knex('transactions')
    .returning(['id', 'amount', 'date', 'name', 'type'])
    .where('id', id)
  if (!transaction) {
    return res
      .status(404)
      .json({ errors: [`Could not find a transaction with id ${id}.`] })
  }
  res.json(transaction)
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
  const [updatedTransaction] = await knex(dbTable)
    .returning(['id', 'amount', 'date', 'name', 'type'])
    .where('id', id)
    .update(updates)
    .catch(error => res.status(500).json({ errors: [error] }))
  if (!updatedTransaction) {
    return res
      .status(404)
      .json({ errors: [`Could not find a transaction with id ${id}.`] })
  }
  res.json(updatedTransaction)
}

const del = async (req, res) => {
  const { id } = await deleteSchema
    .validateAsync(req.params)
    .catch(error => res.status(400).json(createBadRequestError(error)))
  const [deletedTransaction] = await knex(dbTable)
    .returning(['id', 'amount', 'date', 'name', 'type'])
    .where('id', id)
    .delete()
    .catch(error => res.status(500).json({ errors: [error] }))
  if (!deletedTransaction) {
    return res
      .status(404)
      .json({ errors: [`Could not find a transaction with id ${id}.`] })
  }
  res.json(deletedTransaction)
}

router.get('/', list)
router.post('/', create)
router.get('/:id', read)
router.patch('/:id', update)
router.delete('/:id', del)

module.exports = router
