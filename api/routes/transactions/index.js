const { Router } = require('express')
const knex = require('../../db')
const { createBadRequestError } = require('../../utils')
const { createSchema } = require('./schemas')

const router = new Router()

const create = async (req, res) => {
  // validate properties
  const body = await createSchema
    .validateAsync(req.body)
    .catch(error => res.status(400).json(createBadRequestError(error)))
  // insert into db
  const { amount, type } = body
  const { date = new Date(), name = 'Transaction' } = body
  const transaction = await knex('transactions')
    .returning(['id', 'amount', 'date', 'name', 'type'])
    .insert({
      amount,
      date,
      name,
      type,
    })
    .catch(error => res.status(500).json({ errors: [error] }))
  // return created transaction
  res.json(transaction)
}

const read = async (req, res) => {
  const list = await knex('transactions').select('*')
  res.json(list)
}

router.post('/', create)
router.get('/', read)

module.exports = router
