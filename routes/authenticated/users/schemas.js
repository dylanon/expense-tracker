const joi = require('@hapi/joi')

const byIdSchema = joi.object({
  id: joi.number().required(),
})

const createSchema = joi.object({
  email: joi
    .string()
    .email()
    .required(),
  username: joi.string().required(),
  password: joi
    .string()
    .min(8)
    .required(),
})

const updateParamsSchema = byIdSchema

const updateBodySchema = joi
  .object({
    email: joi.string().email(),
    username: joi.string(),
    password: joi.string().min(8),
  })
  .unknown(false)

const readSchema = byIdSchema

const deleteSchema = byIdSchema

module.exports = {
  createSchema,
  readSchema,
  updateParamsSchema,
  updateBodySchema,
  deleteSchema,
}
