const Resource = require('./Resource')
const { createSchema } = require('../../routes/authenticated/budgets/schemas')

class Budget extends Resource {
  constructor(attributes) {
    const { error, value } = createSchema.validate(attributes, {
      allowUnknown: true,
    })
    if (error) {
      throw error
    }
    super('budgets', value)
  }
}

module.exports = Budget
