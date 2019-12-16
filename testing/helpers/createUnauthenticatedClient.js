const request = require('supertest')
const app = require('../../app')

const createUnauthenticatedClient = (requestHandler = app) => {
  return request.agent(requestHandler)
}

module.exports = createUnauthenticatedClient
