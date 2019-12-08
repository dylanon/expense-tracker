const schemas = require('./schemas')
const Resource = require('../../../models/Resource')

const resourceName = 'transaction'
const dbTable = 'transactions'
const resource = new Resource(resourceName, dbTable, schemas)

module.exports = resource.router
