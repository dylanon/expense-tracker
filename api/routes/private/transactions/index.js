const schemas = require('./schemas')
const ResourceHandler = require('../../../models/ResourceHandler')

const resourceName = 'transaction'
const dbTable = 'transactions'
const resourceHandler = new ResourceHandler(resourceName, dbTable, schemas)

module.exports = resourceHandler.router
