const UserFixture = require('../../../testing/fixtures/User')
const { requestWithoutAuth } = require('../../../testing/helpers')

const username = 'unauthedUsersEndpoint'
const password = '12341234'
const email = 'unauthedUsersEndpoint@test.com'

const user = new UserFixture(username, password, email)

describe('/users (unauthenticated)', () => {
  describe('with valid user info', () => {
    beforeAll(user.destroy)
    afterAll(user.destroy)

    test('POST creates a user & does not send password in response', async () => {
      const { body: createdUser } = await requestWithoutAuth
        .post('/users')
        .send({
          username,
          password,
          email,
        })
        .expect(201)
      expect(createdUser).toEqual(
        expect.objectContaining({
          username,
          email,
          id: expect.any(String),
        })
      )
      expect(createdUser.password).toBe(undefined)
    })
  })

  describe('with invalid user info', () => {
    test('POST responds with bad request (no body)', () => {
      return requestWithoutAuth.post('/users').expect(400)
    })

    test('POST responds with bad request (no username)', () => {
      return requestWithoutAuth
        .post('/users')
        .send({
          password,
          email,
        })
        .expect(400)
    })

    test('POST responds with bad request (no password)', () => {
      return requestWithoutAuth
        .post('/users')
        .send({
          username,
          email,
        })
        .expect(400)
    })

    test('POST responds with bad request (password too short)', () => {
      return requestWithoutAuth
        .post('/users')
        .send({
          username,
          email,
          password: '1234123',
        })
        .expect(400)
    })

    test('POST responds with bad request (no email)', () => {
      return requestWithoutAuth
        .post('/users')
        .send({
          username,
          password,
        })
        .expect(400)
    })

    test('POST responds with bad request (invalid email)', () => {
      return requestWithoutAuth
        .post('/users')
        .send({
          username,
          password,
          email: 'notanemail',
        })
        .expect(400)
    })
  })
})
