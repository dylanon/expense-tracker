const UserFixture = require('../../../testing/fixtures/User')
const {
  clearTable,
  createAuthenticatedClient,
  requestWithoutAuth,
} = require('../../../testing/helpers')

describe('with authentication', () => {
  const username = 'authedUsersEndpoint'
  const email = `${username}@test.com`
  const password = '12341234'

  let user
  let requestWithAuth

  beforeEach(async () => {
    clearTable('users')
    user = new UserFixture(username, password, email)
    await user.create()
    requestWithAuth = createAuthenticatedClient(user)
  })

  afterAll(async () => {
    await user.destroy()
  })

  it('lists users', async () => {
    const usernames = [
      'authedUsersEndpointOne',
      'authedUsersEndpointTwo',
      'authedUsersEndpointThree',
    ]
    const userFixtures = usernames.map(
      fixtureUsername =>
        new UserFixture(
          fixtureUsername,
          password,
          `${fixtureUsername}@test.com`
        )
    )
    const userCreateOperations = userFixtures.map(user => user.create())
    const createdUsers = await Promise.all(userCreateOperations)

    const expectedUsers = createdUsers
      .map(user => {
        const { password, ...otherAttributes } = user
        return { ...otherAttributes }
      })
      .concat([user.attributes])

    const { body } = await requestWithAuth.get('/users').expect(200)
    body.forEach(returnedUser => {
      expect(expectedUsers).toContainEqual(returnedUser)
    })
  })

  describe('read', () => {
    it('reads a user by id', async () => {
      const userName = 'readUser'
      const userToRead = new UserFixture(
        userName,
        '12341234',
        `${userName}@test.com`
      )
      const userAttributes = await userToRead.create()
      const { body } = await requestWithAuth
        .get(`/users/${userAttributes.id}`)
        .expect(200)
      expect(body).toEqual(userAttributes)
    })

    it('responds with 404 when the user is not found', async () => {
      const {
        body: { errors },
      } = await requestWithAuth.get(`/users/1`).expect(404)
      expect(errors).toEqual(expect.any(Array))
    })
  })

  describe('update', () => {
    it("updates a user's email", async () => {
      const userName = 'original'
      const originalUserEmail = `${userName}@test.com`
      const newUserEmail = 'new@test.com'
      const user = new UserFixture(userName, '12341234', originalUserEmail)
      const { id: userId } = await user.create()

      const { body } = await requestWithAuth
        .patch(`/users/${userId}`)
        .send({
          email: newUserEmail,
        })
        .expect(200)
      expect(newUserEmail).not.toBe(originalUserEmail)
      expect(body.id).toBe(userId)
      expect(body.email).toBe(newUserEmail)
    })

    it('prevents updating invalid properties', async () => {
      const userName = 'updateUser'
      const userToUpdate = new UserFixture(
        userName,
        '12341234',
        `${userName}@test.com`
      )
      const { id: userId } = await userToUpdate.create()

      const updateCreatedBy = requestWithAuth.patch(`/users/${userId}`).send({
        createdBy: userToUpdate.id,
      })
      const updateBlah = requestWithAuth.patch(`/users/${userId}`).send({
        blah: 'Some text',
      })
      const responses = await Promise.all([updateCreatedBy, updateBlah])
      responses.forEach(response => {
        const {
          status,
          body: { id, errors },
        } = response
        expect(status).toBe(400)
        expect(errors).toEqual(expect.any(Array))
        expect(id).toBeUndefined()
      })
    })

    it('responds with 404 when the user is not found', async () => {
      const {
        body: { errors },
      } = await requestWithAuth
        .patch(`/users/1`)
        .send({ email: 'newemail@test.com' })
        .expect(404)
      expect(errors).toEqual(expect.any(Array))
    })
  })

  describe('delete', () => {
    it('deletes a user', async () => {
      const userName = 'deleteUser'
      const userToDelete = new UserFixture(
        userName,
        '12341234',
        `${userName}@test.com`
      )
      const userAttributes = await userToDelete.create()
      const { id: userId } = userAttributes

      const responseWhenRead = await requestWithAuth.get(`/users/${userId}`)

      const responseWhenDeleted = await requestWithAuth.del(`/users/${userId}`)

      const responseWhenReadAfterDeleted = await requestWithAuth.get(
        `/users/${userId}`
      )

      expect(responseWhenRead.body).toEqual(userAttributes)
      expect(responseWhenDeleted.body).toEqual(userAttributes)
      expect(responseWhenReadAfterDeleted.status).toBe(404)
      expect(responseWhenReadAfterDeleted.body.errors).toEqual(
        expect.any(Array)
      )
    })

    it('responds with 404 when the user is not found', async () => {
      const {
        body: { errors },
      } = await requestWithAuth.del(`/users/1`).expect(404)
      expect(errors).toEqual(expect.any(Array))
    })
  })
})

describe('without authentication it responds with 403 Forbidden', () => {
  test('GET /users', () => {
    return requestWithoutAuth.get('/users').expect(403)
  })

  test('PATCH /users/:id', () => {
    return requestWithoutAuth
      .patch('/users/1')
      .send({
        blahblah: 'Some other value',
      })
      .expect(403)
  })

  test('DELETE /users/:id', () => {
    return requestWithoutAuth.delete('/users/1').expect(403)
  })
})
