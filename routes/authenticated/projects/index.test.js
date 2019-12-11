const request = require('supertest')
const app = require('../../../app')
const UserFixture = require('../../../testing/fixtures/User')
const { createAgentWithAuth } = require('../../../testing/helpers')

describe('with authentication', () => {
  const username = 'authedProjectsEndpoint'
  const password = '12341234'
  const email = `${username}@test.com`

  const user = new UserFixture(username, password, email)

  beforeAll(async () => {
    await user.create()
  })

  afterAll(async () => {
    await user.destroy()
  })

  it('lists projects', async () => {
    const requestWithAuth = createAgentWithAuth(user)
    const { body } = await requestWithAuth
      .get('/projects')
      .expect(200)
    // TODO: Truncate the table before these tests run
    expect(body).toEqual([])
  })
})

describe('without authentication it responds with 403 Forbidden', () => {
  test('GET /projects', () => {
    return request(app)
      .get('/projects')
      .expect(403)
  })

  test('POST /projects', () => {
    return request(app)
      .post('/projects')
      .send({
        blah: 'Some value',
      })
      .expect(403)
  })

  test('PATCH /projects/:id', () => {
    return request(app)
      .patch('/projects/1')
      .send({
        blahblah: 'Some other value',
      })
      .expect(403)
  })

  test('DELETE /projects/:id', () => {
    return request(app)
      .delete('/projects/1')
      .expect(403)
  })
})
