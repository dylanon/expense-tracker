const schemas = require('./schemas')
const Resource = require('../../../models/Resource')

const resourceName = 'user'
const dbTable = 'users'
const options = {
  operations: {
    create: false,
  },
  // Omit password for security
  returnAttributes: ['id', 'email', 'username'],
}
const resource = new Resource(resourceName, dbTable, schemas, options)

module.exports = resource.router
