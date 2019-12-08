const schemas = require('./schemas')
const Resource = require('../../../models/Resource')

const resourceName = 'project'
const dbTable = 'projects'
const resource = new Resource(resourceName, dbTable, schemas)

module.exports = resource.router
