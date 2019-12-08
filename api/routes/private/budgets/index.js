const schemas = require('./schemas')
const ResourceHandler = require('../../../models/ResourceHandler')

const resourceName = 'budget'
const dbTable = 'budgets'
const resourceHandler = new ResourceHandler(resourceName, dbTable, schemas)

module.exports = resourceHandler.router
