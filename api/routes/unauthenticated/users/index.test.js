const request = require('supertest')
const app = require('../../../app')
const knex = require('../../../db')

const dbTable = 'users'
const username = 'testuser'
const password = '12341234'
const email = 'testuser@test.com'

const deleteUser = async () => {
  try {
    await knex(dbTable)
    .where({ username })
    .del()
  } catch (error) {
    throw new Error('Failed to delete user.')
  }
}

beforeAll(deleteUser)

describe('/users (unauthenticated)', () => {
  test('POST /users creates a user', () => {
    return request(app)
      .post('/users')
      .send({
        username,
        password,
        email
      })
      .expect(201)
  })
})

afterAll(deleteUser)
