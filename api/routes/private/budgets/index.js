const schemas = require('./schemas')
const Resource = require('../../../models/Resource')

const resourceName = 'budget'
const dbTable = 'budgets'
const resource = new Resource(resourceName, dbTable, schemas)

module.exports = resource.router
