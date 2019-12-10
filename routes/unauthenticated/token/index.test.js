const request = require('supertest')
const app = require('../../../app')
const UserFixture = require('../../../testing/fixtures/User')

const username = 'unauthedTokenEndpoint'
const plainTextPassword = '12341234'
const email = 'unauthedTokenEndpoint@test.com'

const user = new UserFixture(username, plainTextPassword, email)

beforeAll(async () => {
  await user.destroy()
  await user.create()
})

describe('/token (unauthenticated)', () => {
  describe('with correct credentials', () => {
    test('POST responds with success', () => {
      return request(app)
        .post('/token')
        .send({
          username,
          password: plainTextPassword,
        })
        .expect(200)
    })
  })

  describe('with wrong credentials', () => {
    test('POST responds with forbidden (wrong password)', () => {
      return request(app)
        .post('/token')
        .send({
          username,
          password: 'wrongpassword',
        })
        .expect(403)
    })

    test('POST responds with forbidden (wrong username)', () => {
      return request(app)
        .post('/token')
        .send({
          username: 'wrongusername',
          password: plainTextPassword,
        })
        .expect(403)
    })
  })
})

afterAll(user.destroy)
