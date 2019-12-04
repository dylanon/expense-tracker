const joi = require('@hapi/joi')

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

module.exports = {
  createSchema,
}
