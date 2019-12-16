const request = require('supertest')
const app = require('../../app')

const requestWithoutAuth = request(app)

module.exports = requestWithoutAuth
