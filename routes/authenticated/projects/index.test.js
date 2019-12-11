const UserFixture = require('../../../testing/fixtures/User')
const {
  createAuthenticatedClient,
  requestWithoutAuth,
} = require('../../../testing/helpers')

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
    const requestWithAuth = createAuthenticatedClient(user)
    const { body } = await requestWithAuth.get('/projects').expect(200)
    // TODO: Truncate the table before these tests run
    expect(body).toEqual([])
  })
})

describe('without authentication it responds with 403 Forbidden', () => {
  test('GET /projects', () => {
    return requestWithoutAuth.get('/projects').expect(403)
  })

  test('POST /projects', () => {
    return requestWithoutAuth
      .post('/projects')
      .send({
        blah: 'Some value',
      })
      .expect(403)
  })

  test('PATCH /projects/:id', () => {
    return requestWithoutAuth
      .patch('/projects/1')
      .send({
        blahblah: 'Some other value',
      })
      .expect(403)
  })

  test('DELETE /projects/:id', () => {
    return requestWithoutAuth.delete('/projects/1').expect(403)
  })
})
