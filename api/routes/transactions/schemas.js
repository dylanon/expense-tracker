const joi = require('@hapi/joi')
const { TRANSACTION_TYPE } = require('../../constants')

const createSchema = joi.object({
  amount: joi.number().required(),
  date: joi.date(),
  name: joi.string(),
  type: joi
    .string()
    .valid(...Object.values(TRANSACTION_TYPE))
    .required(),
})

const deleteSchema = joi.object({
  id: joi.number().required(),
})

module.exports = {
  createSchema,
  deleteSchema,
}
