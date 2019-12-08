const schemas = require('./schemas')
const ResourceHandler = require('../../../models/ResourceHandler')

const resourceName = 'project'
const dbTable = 'projects'
const resourceHandler = new ResourceHandler(resourceName, dbTable, schemas)

module.exports = resourceHandler.router
