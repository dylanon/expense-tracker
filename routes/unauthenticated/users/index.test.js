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

afterEach(deleteUser)

describe('/users (unauthenticated)', () => {

  describe('with valid user info', () => {

    test('POST creates a user & does not send password in response', async () => {
      const { body: createdUser } = await request(app)
        .post('/users')
        .send({
          username,
          password,
          email
        })
        .expect(201)
      expect(createdUser).toEqual(expect.objectContaining({
        username,
        email,
        id: expect.any(String)
      }))
      expect(createdUser.password).toBe(undefined)
    })

  })
  
  describe('with invalid user info', () => {

    test('POST responds with bad request (no body)', () => {
      return request(app)
        .post('/users')
        .expect(400)
    })

    test('POST responds with bad request (no username)', () => {
      return request(app)
        .post('/users')
        .send({
          password,
          email
        })
        .expect(400)
    })

    test('POST responds with bad request (no password)', () => {
      return request(app)
        .post('/users')
        .send({
          username,
          email
        })
        .expect(400)
    })

    test('POST responds with bad request (password too short)', () => {
      return request(app)
        .post('/users')
        .send({
          username,
          email,
          password: '1234123'
        })
        .expect(400)
    })

    test('POST responds with bad request (no email)', () => {
      return request(app)
        .post('/users')
        .send({
          username,
          password
        })
        .expect(400)
    })

    test('POST responds with bad request (invalid email)', () => {
      return request(app)
        .post('/users')
        .send({
          username,
          password,
          email: 'notanemail'
        })
        .expect(400)
    })

  })
  
})
