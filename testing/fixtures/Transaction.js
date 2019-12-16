const Resource = require('./Resource')
const {
  createSchema,
} = require('../../routes/authenticated/transactions/schemas')

class Transaction extends Resource {
  constructor(attributes) {
    const { error, value } = createSchema.validate(attributes, {
      allowUnknown: true,
    })
    if (error) {
      throw error
    }
    super('transactions', value)
  }
}

module.exports = Transaction
