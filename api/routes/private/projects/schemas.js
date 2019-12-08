const joi = require('@hapi/joi')

const byIdSchema = joi.object({
  id: joi.number().required(),
})

const createSchema = joi.object({
  name: joi.string(),
})

const updateParamsSchema = byIdSchema

const updateBodySchema = joi.object({
  name: joi.string(),
})

const readSchema = byIdSchema

const deleteSchema = byIdSchema

module.exports = {
  createSchema,
  readSchema,
  updateParamsSchema,
  updateBodySchema,
  deleteSchema,
}
