const joi = require('@hapi/joi')
const { TRANSACTION_TYPE } = require('../../constants')

const byIdSchema = joi.object({
  id: joi.number().required(),
})

const createSchema = joi.object({
  amount: joi.number().required(),
  date: joi.date(),
  name: joi.string(),
  type: joi
    .string()
    .valid(...Object.values(TRANSACTION_TYPE))
    .required(),
})

const readSchema = byIdSchema

const deleteSchema = byIdSchema

module.exports = {
  createSchema,
  readSchema,
  deleteSchema,
}
