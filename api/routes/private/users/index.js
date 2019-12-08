const schemas = require('./schemas')
const ResourceHandler = require('../../../models/ResourceHandler')

const resourceName = 'user'
const dbTable = 'users'
const options = {
  operations: {
    create: false,
  },
  // Omit password for security
  returnAttributes: ['id', 'email', 'username'],
}
const resourceHandler = new ResourceHandler(
  resourceName,
  dbTable,
  schemas,
  options
)

module.exports = resourceHandler.router
