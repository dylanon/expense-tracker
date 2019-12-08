const request = require('supertest')
const app = require('./')
const knex = require('../db')

const username = 'testuser'

beforeAll(async () => {
  await knex('users')
    .where({ username })
    .del()
})

describe('public endpoints are accessible without auth', () => {
  test('GET /up', () => {
    return request(app)
      .get('/up')
      .expect(200)
  })

  test('POST /users', () => {
    return request(app)
      .post('/users')
      .send({
        username,
        password: '12341234',
        email: 'testuser@test.com',
      })
      .set('Content-Type', 'application/json')
      .expect(201)
  })

  test('POST /token', () => {
    return request(app)
      .post('/token')
      .send({
        username: 'testuser',
        password: '12341234',
      })
      .set('Content-Type', 'application/json')
      .expect(200)
  })
})
