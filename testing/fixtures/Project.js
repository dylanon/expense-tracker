const Resource = require('./Resource')

class Project extends Resource {
  constructor(attributes) {
    const { name = null, createdBy } = attributes
    if (!createdBy) {
      throw new Error(
        'Project: `createdBy` is a required argument constructor.'
      )
    }
    super('projects', { name, createdBy })
  }
}

module.exports = Project
