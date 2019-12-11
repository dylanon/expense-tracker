const UserFixture = require('../../../testing/fixtures/User')
const ProjectFixture = require('../../../testing/fixtures/Project')
const {
  clearTable,
  createAuthenticatedClient,
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

  it('creates a project', async () => {
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

  it('lists projects', async () => {
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
