const request = require('supertest')
const app = require('../../app')

const createAgentWithAuth = (userFixtureInstance, requestHandler = app) => {
  const authCookie = userFixtureInstance.getAuthCookie()
  return request.agent(requestHandler).set('Cookie', authCookie)
}

module.exports = createAgentWithAuth
