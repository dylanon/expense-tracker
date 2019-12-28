const joi = require('@hapi/joi')

const byIdSchema = joi.object({
  id: joi.number().required(),
})

const createSchema = joi.object({
  projectId: joi.number().required(),
  name: joi.string(),
  startDate: joi.date().timestamp(),
  endDate: joi.date().timestamp(),
  target: joi.number(),
})

const updateParamsSchema = byIdSchema

const updateBodySchema = joi.object({
  // TODO: Allow updates to projectId
  name: joi.string(),
  startDate: joi.date().timestamp(),
  endDate: joi.date().timestamp(),
  target: joi.number(),
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
