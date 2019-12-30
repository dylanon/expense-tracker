const UserFixture = require('../../../testing/fixtures/User')
const ProjectFixture = require('../../../testing/fixtures/Project')
const {
  clearTable,
  createAuthenticatedClient,
  createDatabaseNoise,
  requestWithoutAuth,
} = require('../../../testing/helpers')

describe('with authentication', () => {
  const username = 'authedProjectsEndpoint'
  const password = '12341234'
  const email = `${username}@test.com`

  const user = new UserFixture(username, password, email)

  let requestWithAuth

  beforeAll(async () => {
    await user.create()
    requestWithAuth = createAuthenticatedClient(user)
  })

  beforeEach(async () => {
    await clearTable('projects')
  })

  afterAll(async () => {
    await clearTable('projects')
    await user.destroy()
  })

  describe('list', () => {
    let cleanupNoise

    beforeEach(async () => {
      cleanupNoise = await createDatabaseNoise()
    })

    afterEach(async () => {
      await cleanupNoise()
    })

    it(`lists the user's projects`, async () => {
      const projectNames = [
        'Project One',
        'Project Two',
        'Project Three',
        undefined,
      ]
      const projectFixtures = projectNames.map(
        name => new ProjectFixture({ name, createdBy: user.id })
      )
      const projectCreateOperations = projectFixtures.map(project =>
        project.create()
      )
      const expectedProjects = await Promise.all(projectCreateOperations)

      const { body } = await requestWithAuth.get('/projects').expect(200)
      body.forEach(returnedProject => {
        expect(expectedProjects).toContainEqual(returnedProject)
        expect(returnedProject.createdBy).toBe(user.id)
      })
    })
  })

  describe('create', () => {
    it('creates a project without a name', async () => {
      const { body } = await requestWithAuth.post('/projects').expect(201)
      expect(body).toEqual(
        expect.objectContaining({
          id: expect.any(String),
          name: null,
          createdBy: expect.any(String),
        })
      )
    })

    it('creates a project with a name', async () => {
      const projectName = 'Test Project'
      const { body } = await requestWithAuth
        .post('/projects')
        .send({ name: projectName })
        .expect(201)
      expect(body).toEqual(
        expect.objectContaining({
          id: expect.any(String),
          name: projectName,
          createdBy: expect.any(String),
        })
      )
    })

    it('prevents creation a project with invalid attributes', async () => {
      const projectName = 'Test Project 2'
      const createWithCreatedBy = requestWithAuth
        .post('/projects')
        .send({ name: projectName, createdBy: user.id })
      const createWithBlah = requestWithAuth
        .post('/projects')
        .send({ blah: 2019 })
      const responses = await Promise.all([createWithCreatedBy, createWithBlah])
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
  })

  describe('read', () => {
    it('reads a project by id', async () => {
      const projectName = 'Project Z'
      const project = new ProjectFixture({
        name: projectName,
        createdBy: user.id,
      })
      const projectAttributes = await project.create()
      const { body } = await requestWithAuth
        .get(`/projects/${projectAttributes.id}`)
        .expect(200)
      expect(body).toEqual(projectAttributes)
    })

    it('responds with 404 when the project is not found', async () => {
      const {
        body: { errors },
      } = await requestWithAuth.get(`/projects/1`).expect(404)
      expect(errors).toEqual(expect.any(Array))
    })
  })

  describe('update', () => {
    it('updates a project name', async () => {
      const originalProjectName = 'Project A'
      const newProjectName = 'Project B'
      const project = new ProjectFixture({
        name: originalProjectName,
        createdBy: user.id,
      })
      const { id: projectId } = await project.create()
      const { body } = await requestWithAuth
        .patch(`/projects/${projectId}`)
        .send({
          name: newProjectName,
        })
        .expect(200)
      expect(newProjectName).not.toBe(originalProjectName)
      expect(body.id).toBe(projectId)
      expect(body.name).toBe(newProjectName)
    })

    it('prevents updating invalid properties', async () => {
      const project = new ProjectFixture({
        name: 'Project Y',
        createdBy: user.id,
      })
      const { id: projectId } = await project.create()

      const updateCreatedBy = requestWithAuth
        .patch(`/projects/${projectId}`)
        .send({
          createdBy: user.id,
        })
      const updateBlah = requestWithAuth.patch(`/projects/${projectId}`).send({
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

    it('responds with 404 when the project is not found', async () => {
      const {
        body: { errors },
      } = await requestWithAuth
        .patch(`/projects/1`)
        .send({ name: 'New Name' })
        .expect(404)
      expect(errors).toEqual(expect.any(Array))
    })

    // TODO: Send Bad Request for missing patch body - currently sends a 500 error
  })

  describe('delete', () => {
    it('deletes a project', async () => {
      const project = new ProjectFixture({
        name: 'Project W',
        createdBy: user.id,
      })
      const projectAttributes = await project.create()
      const { id: projectId } = projectAttributes

      const responseWhenRead = await requestWithAuth.get(
        `/projects/${projectId}`
      )

      const responseWhenDeleted = await requestWithAuth.del(
        `/projects/${projectId}`
      )

      const responseWhenReadAfterDeleted = await requestWithAuth.get(
        `/projects/${projectId}`
      )

      expect(responseWhenRead.body).toEqual(projectAttributes)
      expect(responseWhenDeleted.body).toEqual(projectAttributes)
      expect(responseWhenReadAfterDeleted.status).toBe(404)
      expect(responseWhenReadAfterDeleted.body.errors).toEqual(
        expect.any(Array)
      )
    })

    it('responds with 404 when the project is not found', async () => {
      const {
        body: { errors },
      } = await requestWithAuth.del(`/projects/1`).expect(404)
      expect(errors).toEqual(expect.any(Array))
    })
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
