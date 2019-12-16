const Resource = require('./Resource')
const { createSchema } = require('../../routes/authenticated/projects/schemas')

class Project extends Resource {
  constructor(attributes) {
    const { error, value } = createSchema.validate(attributes, {
      allowUnknown: true,
    })
    if (error) {
      throw error
    }
    super('projects', value)
  }
}

module.exports = Project
