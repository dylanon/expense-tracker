const request = require('supertest')
const app = require('../../../app')
const knex = require('../../../db')
const { hashPassword } = require('../../../utils')

const dbTable = 'users'

const username = 'testUser'
const plainTextPassword = '12341234'
const email = 'testuser@test.com'

const createUser = async (userInfo) => {
  try {
    await knex(dbTable)
    .insert(userInfo)
  } catch (error) {
    throw new Error('Failed to create user.')
  }
}

const deleteUser = async () => {
  try {
    await knex(dbTable)
    .where({ username })
    .del()
  } catch (error) {
    throw new Error('Failed to delete user.')
  }
}

beforeAll(async () => {
  await deleteUser()
  const hashedPassword = await hashPassword(plainTextPassword)
  await createUser({
    username,
    password: hashedPassword,
    email
  })
})

describe('/token (unauthenticated)', () => {
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

afterAll(deleteUser)